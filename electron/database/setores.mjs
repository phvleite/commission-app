export function setoresMigrations(db) {
    // Criar tabela se não existir
    db.run(`
    CREATE TABLE IF NOT EXISTS setores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      percentual REAL NOT NULL,
      ativo INTEGER DEFAULT 1,
      is_meritocracia INTEGER DEFAULT 0
    );
  `);

    // Garantir que MERITOCRACIA exista
    const result = db.exec(`SELECT COUNT(*) FROM setores WHERE nome = 'MERITOCRACIA'`);
    const count = result[0]?.values[0][0];

    if (count === 0) {
        db.run(`
      INSERT INTO setores (nome, percentual, is_meritocracia)
      VALUES ('MERITOCRACIA', 0, 1);
    `);
    }
}

export function setoresAPI(db, saveDatabase) {
    return {
        listar() {
            return (
                db.exec(
                    "SELECT id, nome, percentual, is_meritocracia FROM setores WHERE ativo = 1 ORDER BY nome COLLATE NOCASE ASC"
                )[0]?.values || []
            );
        },

        listarTodos() {
            return (
                db.exec(
                    "SELECT id, nome, percentual, is_meritocracia, ativo FROM setores ORDER BY nome COLLATE NOCASE ASC"
                )[0]?.values || []
            );
        },

        criar(nome, percentual) {
            db.run(`INSERT INTO setores (nome, percentual, is_meritocracia) VALUES (?, ?, 0)`, [
                nome,
                percentual
            ]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("setores-atualizados"));
        },

        editar(id, nome, percentual) {
            db.run(`UPDATE setores SET nome = ?, percentual = ? WHERE id = ?`, [
                nome,
                percentual,
                id
            ]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("setores-atualizados"));
        },

        excluir(id) {
            const nome = db.exec(`SELECT nome FROM setores WHERE id = ${id}`)[0]?.values[0][0];

            if (nome === "MERITOCRACIA") {
                throw new Error("O setor MERITOCRACIA não pode ser inativado.");
            }

            db.run(`UPDATE setores SET ativo = 0 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("setores-atualizados"));
        },

        ativar(id) {
            db.run(`UPDATE setores SET ativo = 1 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("setores-atualizados"));
        },

        soma() {
            const result = db.exec("SELECT SUM(percentual) FROM setores WHERE ativo = 1");
            return result[0]?.values[0][0] || 0;
        }
    };
}
