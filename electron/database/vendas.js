export function vendasMigrations(db) {
    db.run(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT UNIQUE NOT NULL,
      valor REAL NOT NULL
    );
  `);
}

export function vendasAPI(db, saveDatabase) {
    return {
        salvar(data, valor) {
            db.run(
                `INSERT INTO vendas (data, valor)
         VALUES (?, ?)
         ON CONFLICT(data) DO UPDATE SET valor = excluded.valor`,
                [data, valor]
            );
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
        }
    };
}
