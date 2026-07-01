// MIGRATIONS — cria a tabela de snapshot diário
export function comissoesMigrations(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS comissoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            colaborador_id INTEGER NOT NULL,
            setor_id INTEGER NOT NULL,
            situacao TEXT NOT NULL,
            valor_setor REAL NOT NULL,
            valor_colaborador REAL NOT NULL,
            qtd_normais INTEGER NOT NULL,
            qtd_total INTEGER NOT NULL
        );
    `);
}

// Verifica se colaborador está normal no dia (situações)
function colaboradorNormalNoDia(db, colabId, data) {
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
    return !result; // true = normal
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
        async gerar(data) {
            // Buscar venda do dia
            const stmtVenda = db.prepare(`SELECT valor FROM vendas WHERE data = ?`);
            stmtVenda.bind([data]);
            const venda = stmtVenda.step() ? stmtVenda.getAsObject() : null;
            stmtVenda.free();

            if (!venda) return null;

            const comissaoTotal = venda.valor * 0.1;

            // Buscar setores
            const setoresStmt = db.prepare(`SELECT * FROM setores`);
            const setores = [];
            while (setoresStmt.step()) setores.push(setoresStmt.getAsObject());
            setoresStmt.free();

            // Limpar comissões anteriores do dia
            db.run(`DELETE FROM comissoes WHERE data = ?`, [data]);

            // Processar cada setor
            for (const setor of setores) {
                const comissaoSetor = comissaoTotal * (setor.percentual / 100);

                // Buscar colaboradores do setor
                const colStmt = db.prepare(`
                    SELECT * FROM colaboradores WHERE setor_id = ?
                `);
                colStmt.bind([setor.id]);

                const colaboradores = [];
                while (colStmt.step()) colaboradores.push(colStmt.getAsObject());
                colStmt.free();

                const qtdTotal = colaboradores.length;

                // Filtrar elegíveis por admissão/demissão
                const elegiveis = colaboradores.filter(c => colaboradorElegivel(c, data));

                // Filtrar elegíveis por situação
                const normais = elegiveis.filter(c => colaboradorNormalNoDia(db, c.id, data));

                const qtdNormais = normais.length;
                const valorPorColaborador = qtdNormais > 0 ? comissaoSetor / qtdNormais : 0;

                // Salvar snapshot
                for (const c of colaboradores) {
                    const elegivel = colaboradorElegivel(c, data);
                    const normal = elegivel && colaboradorNormalNoDia(db, c.id, data);

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

                    const situacao = situacaoRow ? situacaoRow.tipo : "Normal";

                    db.run(
                        `
                        INSERT INTO comissoes
                        (data, colaborador_id, setor_id, situacao, valor_setor, valor_colaborador, qtd_normais, qtd_total)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `,
                        [
                            data,
                            c.id,
                            setor.id,
                            situacao,
                            comissaoSetor,
                            normal ? valorPorColaborador : 0,
                            qtdNormais,
                            qtdTotal
                        ]
                    );
                }
            }

            saveDatabase(db);
            return true;
        },

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
        }
    };
}
