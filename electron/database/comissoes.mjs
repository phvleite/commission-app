// MIGRATIONS — cria as tabelas de snapshot diário
export function comissoesMigrations(db) {

    // Snapshot por colaborador
    db.run(`
        CREATE TABLE IF NOT EXISTS comissoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            colaborador_id INTEGER NOT NULL,
            setor_id INTEGER NOT NULL,
            situacao TEXT NOT NULL,
            valor_setor REAL NOT NULL,
            valor_colaborador REAL NOT NULL,
            qtd_aptos INTEGER NOT NULL,
            qtd_total INTEGER NOT NULL
        );
    `);

    // Snapshot por setor
    db.run(`
        CREATE TABLE IF NOT EXISTS venda_comissoes_setores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            setor_id INTEGER NOT NULL,
            percentual_aplicado REAL NOT NULL,
            valor_total_setor REAL NOT NULL,
            qtd_total_colaboradores INTEGER NOT NULL,
            qtd_aptos_colaboradores INTEGER NOT NULL
        );
    `);
}

// Verifica se colaborador está apto no dia (situações)
function colaboradorAptoNoDia(db, colabId, data) {
    const stmt = db.prepare(`
        SELECT 1 FROM situacoes
        WHERE colaborador_id = ?
        AND data_inicial <= ?
        AND data_final >= ?
        AND ativo = 1
    `);
    stmt.bind([colabId, data, data]);
    const result = stmt.step();
    stmt.free();
    return !result; // true = apto
}

// Verifica elegibilidade por admissão/demissão
function colaboradorElegivel(colaborador, dataComissao) {
    const dCom = new Date(dataComissao);
    const dAdm = new Date(colaborador.data_admissao);
    const dDem = colaborador.data_demissao ? new Date(colaborador.data_demissao) : null;

    if (dCom < dAdm) return false;        // comissão antes da admissão
    if (dDem && dCom >= dDem) return false; // comissão após demissão

    return true;
}

// API PRINCIPAL
export function comissoesAPI(db, saveDatabase) {
    return {

        // GERA COMISSÕES DO DIA
        async gerar(data) {

            // Buscar venda do dia
            const stmtVenda = db.prepare(`
                SELECT valor FROM vendas WHERE data = ?
            `);
            stmtVenda.bind([data]);
            const venda = stmtVenda.step() ? stmtVenda.getAsObject() : null;
            stmtVenda.free();

            if (!venda) return null;

            const comissaoTotal = venda.valor * 0.1;

            // Atualiza o valor total da comissão na tabela vendas
            db.run(`
                UPDATE vendas SET valor_comissao_total = ? WHERE data = ?
            `, [comissaoTotal, data]);

            // Buscar setores
            const setoresStmt = db.prepare(`SELECT * FROM setores`);
            const setores = [];
            while (setoresStmt.step()) setores.push(setoresStmt.getAsObject());
            setoresStmt.free();

            // Limpar snapshots anteriores
            db.run(`DELETE FROM comissoes WHERE data = ?`, [data]);
            db.run(`DELETE FROM venda_comissoes_setores WHERE data = ?`, [data]);

            // Processar cada setor
            for (const setor of setores) {

                const comissaoSetor = comissaoTotal * (setor.percentual / 100);

                // Buscar colaboradores elegíveis do setor (SQL já filtra admissão/demissão)
                const colStmt = db.prepare(`
                    SELECT *
                    FROM colaboradores
                    WHERE setor_id = ?
                    AND data_admissao <= ?
                    AND (data_demissao IS NULL OR data_demissao > ?)
                `);
                colStmt.bind([setor.id, data, data]);

                const colaboradores = [];
                while (colStmt.step()) colaboradores.push(colStmt.getAsObject());
                colStmt.free();

                const qtdTotal = colaboradores.length;

                // Filtrar aptos por situação
                const aptos = colaboradores.filter(c => colaboradorAptoNoDia(db, c.id, data));
                const qtdAptos = aptos.length;

                const valorPorColaborador = qtdAptos > 0 ? comissaoSetor / qtdAptos : 0;

                // Salvar snapshot por setor
                db.run(`
                    INSERT INTO venda_comissoes_setores
                    (data, setor_id, percentual_aplicado, valor_total_setor, qtd_total_colaboradores, qtd_aptos_colaboradores)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    data,
                    setor.id,
                    setor.percentual,
                    comissaoSetor,
                    qtdTotal,
                    qtdAptos
                ]);

                // Salvar snapshot por colaborador
                for (const c of colaboradores) {

                    const apto = colaboradorAptoNoDia(db, c.id, data);

                    // Buscar situação real
                    const stmtSit = db.prepare(`
                        SELECT t.descricao AS tipo
                        FROM situacoes s
                        JOIN tipo_situacoes t ON t.id = s.tipo_id
                        WHERE s.colaborador_id = ?
                        AND s.data_inicial <= ?
                        AND s.data_final >= ?
                        AND s.ativo = 1
                    `);
                    stmtSit.bind([c.id, data, data]);
                    const situacaoRow = stmtSit.step() ? stmtSit.getAsObject() : null;
                    stmtSit.free();

                    const situacao = situacaoRow ? situacaoRow.tipo : "Apto";

                    db.run(`
                        INSERT INTO comissoes
                        (data, colaborador_id, setor_id, situacao, valor_setor, valor_colaborador, qtd_aptos, qtd_total)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        data,
                        c.id,
                        setor.id,
                        situacao,
                        comissaoSetor,
                        apto ? valorPorColaborador : 0,
                        qtdAptos,
                        qtdTotal
                    ]);
                }
            }

            saveDatabase(db);
            return true;
        },

        // LISTAR POR DIA
        async listarPorDia(data) {
            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE c.data = ?
                ORDER BY col.nome COLLATE NOCASE ASC
            `);

            stmt.bind([data]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        // LISTAR MENSAL
        async listarMensal(mes, ano) {
            const mesStr = mes.toString().padStart(2, "0");
            const anoStr = ano.toString();

            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE strftime('%m', c.data) = ?
                AND strftime('%Y', c.data) = ?
                ORDER BY col.nome COLLATE NOCASE ASC
            `);

            stmt.bind([mesStr, anoStr]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarSetoresPorDia(data) {
            const stmt = db.prepare(`
                SELECT vcs.*, s.nome AS setor
                FROM venda_comissoes_setores vcs
                JOIN setores s ON s.id = vcs.setor_id
                WHERE vcs.data = ?
                ORDER BY s.nome COLLATE NOCASE ASC
            `);

            stmt.bind([data]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        }
    };
}
