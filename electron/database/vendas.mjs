export function vendasMigrations(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT UNIQUE NOT NULL,
            valor INTEGER NOT NULL,
            valor_comissao_total INTEGER NOT NULL
        );
    `);
}

export function vendasAPI(db, saveDatabase, comissoesAPI) {
    return {

        // SALVAR VENDA (CRIAR OU ATUALIZAR)
        salvar(data, valorFloat) {
            const valorCentavos = Math.round(valorFloat * 100);
            const valorComissaoCentavos = Math.round(valorCentavos * 0.1);

            db.run(
                `
                INSERT INTO vendas (data, valor, valor_comissao_total)
                VALUES (?, ?, ?)
                ON CONFLICT(data) DO UPDATE SET
                    valor = excluded.valor,
                    valor_comissao_total = excluded.valor_comissao_total
                `,
                [data, valorCentavos, valorComissaoCentavos]
            );

            comissoesAPI.gerar(data);
            saveDatabase(db);
            return true;
        },

        // ALTERAR VENDA
        alterar(id, novaData, novoValorFloat) {
            const stmtAntiga = db.prepare(`
                SELECT * FROM vendas WHERE id = ?
            `);
            stmtAntiga.bind([id]);
            const vendaAntiga = stmtAntiga.step() ? stmtAntiga.getAsObject() : null;
            stmtAntiga.free();

            if (!vendaAntiga) return { ok: false, erro: "Venda não encontrada." };

            const dataAntiga = vendaAntiga.data;

            // Verificar conflito de data
            const stmtCheck = db.prepare(`
                SELECT id FROM vendas WHERE data = ? AND id != ?
            `);
            stmtCheck.bind([novaData, id]);
            const existeOutra = stmtCheck.step();
            stmtCheck.free();

            if (existeOutra) {
                return { ok: false, erro: "Já existe uma venda registrada para esta data." };
            }

            const novoValorCentavos = Math.round(novoValorFloat * 100);
            const novaComissaoCentavos = Math.round(novoValorCentavos * 0.1);

            // Se a data mudou, apagar comissões antigas
            if (dataAntiga !== novaData) {
                db.run(`DELETE FROM comissoes WHERE data = ?`, [dataAntiga]);
                db.run(`DELETE FROM venda_comissoes_setores WHERE data = ?`, [dataAntiga]);
            }

            // Atualizar venda
            db.run(
                `
                UPDATE vendas
                SET data = ?, valor = ?, valor_comissao_total = ?
                WHERE id = ?
                `,
                [novaData, novoValorCentavos, novaComissaoCentavos, id]
            );

            comissoesAPI.gerar(novaData);
            saveDatabase(db);

            return { ok: true };
        },

        listar() {
            const stmt = db.prepare(`
                SELECT * FROM vendas ORDER BY data DESC
            `);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

        buscarPorData(data) {
            const stmt = db.prepare(`
                SELECT * FROM vendas WHERE data = ?
            `);

            stmt.bind([data]);

            const row = stmt.step() ? stmt.getAsObject() : null;
            stmt.free();

            return row;
        },

        buscarPorId(id) {
            const stmt = db.prepare(`
                SELECT * FROM vendas WHERE id = ?
            `);

            stmt.bind([id]);

            const row = stmt.step() ? stmt.getAsObject() : null;
            stmt.free();

            return row;
        },

        listarPorPeriodo(dataInicial, dataFinal) {
            const stmt = db.prepare(`
                SELECT * FROM vendas
                WHERE data >= ? AND data <= ?
                ORDER BY data ASC
            `);

            stmt.bind([dataInicial, dataFinal]);

            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            stmt.free();

            return rows;
        },

    };
}
