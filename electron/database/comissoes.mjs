export function comissoesMigrations(db) {

    db.run(`
        CREATE TABLE IF NOT EXISTS comissoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            colaborador_id INTEGER NOT NULL,
            setor_id INTEGER NOT NULL,
            situacao TEXT NOT NULL,
            valor_setor INTEGER NOT NULL,
            valor_colaborador INTEGER NOT NULL,
            qtd_aptos INTEGER NOT NULL,
            qtd_total INTEGER NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS venda_comissoes_setores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            setor_id INTEGER NOT NULL,
            percentual_aplicado REAL NOT NULL,
            valor_total_setor INTEGER NOT NULL,
            qtd_total_colaboradores INTEGER NOT NULL,
            qtd_aptos_colaboradores INTEGER NOT NULL
        );
    `);
}

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
    return !result;
}

function colaboradorElegivel(colaborador, dataComissao) {
    const dCom = new Date(dataComissao);
    const dAdm = new Date(colaborador.data_admissao);
    const dDem = colaborador.data_demissao ? new Date(colaborador.data_demissao) : null;

    if (dCom < dAdm) return false;
    if (dDem && dCom >= dDem) return false;

    return true;
}

export function comissoesAPI(db, saveDatabase) {
    return {

        async gerar(data) {

            const stmtVenda = db.prepare(`
                SELECT valor FROM vendas WHERE data = ?
            `);
            stmtVenda.bind([data]);
            const venda = stmtVenda.step() ? stmtVenda.getAsObject() : null;
            stmtVenda.free();

            if (!venda) return null;

            const comissaoTotal = Math.round(venda.valor * 0.1);

            db.run(`
                UPDATE vendas SET valor_comissao_total = ? WHERE data = ?
            `, [comissaoTotal, data]);

            const setoresStmt = db.prepare(`SELECT * FROM setores`);
            const setores = [];
            while (setoresStmt.step()) setores.push(setoresStmt.getAsObject());
            setoresStmt.free();

            db.run(`DELETE FROM comissoes WHERE data = ?`, [data]);
            db.run(`DELETE FROM venda_comissoes_setores WHERE data = ?`, [data]);

            for (const setor of setores) {

                const comissaoSetor = Math.round(comissaoTotal * (setor.percentual / 100));

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

                const aptos = colaboradores.filter(c => colaboradorAptoNoDia(db, c.id, data));
                const qtdAptos = aptos.length;

                const valorPorColaborador = qtdAptos > 0
                    ? Math.round(comissaoSetor / qtdAptos)
                    : 0;

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

                for (const c of colaboradores) {

                    const apto = colaboradorAptoNoDia(db, c.id, data);

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
        },

        async listarPorPeriodo(dataInicial, dataFinal) {
            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE c.data BETWEEN ? AND ?
                ORDER BY col.nome COLLATE NOCASE ASC, c.data ASC
            `);

            stmt.bind([dataInicial, dataFinal]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarPorPeriodoColaborador(dataInicial, dataFinal, colaboradorId) {
            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE c.data BETWEEN ? AND ?
                AND c.colaborador_id = ?
                ORDER BY c.data ASC
            `);

            stmt.bind([dataInicial, dataFinal, colaboradorId]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarResumoSetoresPorPeriodo(dataInicial, dataFinal) {
            const stmt = db.prepare(`
                SELECT 
                    s.nome AS setor,
                    SUM(vcs.valor_total_setor) AS valor_total_setor,
                    SUM(vcs.qtd_total_colaboradores) AS qtd_total_colaboradores,
                    SUM(vcs.qtd_aptos_colaboradores) AS qtd_aptos_colaboradores
                FROM venda_comissoes_setores vcs
                JOIN setores s ON s.id = vcs.setor_id
                WHERE vcs.data BETWEEN ? AND ?
                GROUP BY setor
                ORDER BY setor ASC
            `);

            stmt.bind([dataInicial, dataFinal]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarResumoSetoresColaboradorPeriodo(dataInicial, dataFinal, colaboradorId) {
            const stmt = db.prepare(`
                SELECT 
                    s.nome AS setor,
                    SUM(c.valor_setor) AS valor_total_setor,
                    SUM(c.valor_colaborador) AS valor_total_colaborador
                FROM comissoes c
                JOIN setores s ON s.id = c.setor_id
                WHERE c.data BETWEEN ? AND ?
                AND c.colaborador_id = ?
                GROUP BY setor
            `);

            stmt.bind([dataInicial, dataFinal, colaboradorId]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarResumoSetoresColaboradorPeriodo(dataInicial, dataFinal, colaboradorId) {
            const stmt = db.prepare(`
                SELECT 
                    s.nome AS setor,
                    SUM(c.valor_setor) AS valor_total_setor,
                    SUM(c.valor_colaborador) AS valor_total_colaborador
                FROM comissoes c
                JOIN setores s ON s.id = c.setor_id
                WHERE c.data BETWEEN ? AND ?
                AND c.colaborador_id = ?
                GROUP BY setor
            `);

            stmt.bind([dataInicial, dataFinal, colaboradorId]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarMensalTodos(mes, ano) {
            const mesStr = mes.toString().padStart(2, "0");
            const anoStr = ano.toString();

            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE strftime('%m', c.data) = ?
                AND strftime('%Y', c.data) = ?
                ORDER BY col.nome COLLATE NOCASE ASC, c.data ASC
            `);

            stmt.bind([mesStr, anoStr]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarMensalColaborador(mes, ano, colaboradorId) {
            const mesStr = mes.toString().padStart(2, "0");
            const anoStr = ano.toString();

            const stmt = db.prepare(`
                SELECT c.*, col.nome AS colaborador, s.nome AS setor
                FROM comissoes c
                JOIN colaboradores col ON col.id = c.colaborador_id
                JOIN setores s ON s.id = c.setor_id
                WHERE strftime('%m', c.data) = ?
                AND strftime('%Y', c.data) = ?
                AND c.colaborador_id = ?
                ORDER BY c.data ASC
            `);

            stmt.bind([mesStr, anoStr, colaboradorId]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarResumoSetoresMensal(mes, ano) {
            const mesStr = mes.toString().padStart(2, "0");
            const anoStr = ano.toString();

            const stmt = db.prepare(`
                SELECT 
                    s.nome AS setor,
                    SUM(vcs.valor_total_setor) AS valor_total_setor,
                    SUM(vcs.qtd_total_colaboradores) AS qtd_total_colaboradores,
                    SUM(vcs.qtd_aptos_colaboradores) AS qtd_aptos_colaboradores
                FROM venda_comissoes_setores vcs
                JOIN setores s ON s.id = vcs.setor_id
                WHERE strftime('%m', vcs.data) = ?
                AND strftime('%Y', vcs.data) = ?
                GROUP BY setor
                ORDER BY setor ASC
            `);

            stmt.bind([mesStr, anoStr]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        async listarResumoSetoresColaboradorMensal(mes, ano, colaboradorId) {
            const mesStr = mes.toString().padStart(2, "0");
            const anoStr = ano.toString();

            const stmt = db.prepare(`
                SELECT 
                    s.nome AS setor,
                    SUM(c.valor_setor) AS valor_total_setor,
                    SUM(c.valor_colaborador) AS valor_total_colaborador
                FROM comissoes c
                JOIN setores s ON s.id = c.setor_id
                WHERE strftime('%m', c.data) = ?
                AND strftime('%Y', c.data) = ?
                AND c.colaborador_id = ?
                GROUP BY setor
            `);

            stmt.bind([mesStr, anoStr, colaboradorId]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },
       
    };  
}
