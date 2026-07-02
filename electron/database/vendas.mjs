export function vendasMigrations(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT UNIQUE NOT NULL,
            valor REAL NOT NULL,
            valor_comissao_total REAL NOT NULL
        );
    `);
}

export function vendasAPI(db, saveDatabase, comissoesAPI) {
    return {

        // SALVAR VENDA (CRIAR OU ATUALIZAR)
        salvar(data, valor) {
            const valorComissaoTotal = valor * 0.1;

            db.run(
                `
                INSERT INTO vendas (data, valor, valor_comissao_total)
                VALUES (?, ?, ?)
                ON CONFLICT(data) DO UPDATE SET
                    valor = excluded.valor,
                    valor_comissao_total = excluded.valor_comissao_total
                `,
                [data, valor, valorComissaoTotal]
            );

            // Gera comissões do dia
            comissoesAPI.gerar(data);

            saveDatabase(db);
            return true;
        },

        // ALTERAR VENDA (DATA E VALOR)
        alterar(id, novaData, novoValor) {
            // Buscar venda antiga
            const stmtAntiga = db.prepare(`
                SELECT * FROM vendas WHERE id = ?
            `);
            stmtAntiga.bind([id]);
            const vendaAntiga = stmtAntiga.step() ? stmtAntiga.getAsObject() : null;
            stmtAntiga.free();

            if (!vendaAntiga) return false;

            const dataAntiga = vendaAntiga.data;
            const valorComissaoTotal = novoValor * 0.1;

            // Se a data mudou, apagar comissões da data antiga
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
                [novaData, novoValor, valorComissaoTotal, id]
            );

            // Gerar comissões novas
            comissoesAPI.gerar(novaData);

            saveDatabase(db);
            return true;
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
        }
    };
}
