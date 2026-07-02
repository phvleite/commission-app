export function colaboradoresMigrations(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS colaboradores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            setor_id INTEGER NOT NULL,
            data_admissao TEXT NOT NULL,
            data_demissao TEXT,
            ativo INTEGER DEFAULT 1,
            FOREIGN KEY (setor_id) REFERENCES setores(id)
        );
    `);
}

export function colaboradoresAPI(db, saveDatabase) {
    return {
        listar({ status = "ativo", ordem = "nome", setor = "todos" } = {}) {
            let where = "";

            if (status === "ativo") where = "WHERE c.ativo = 1";
            else if (status === "inativo") where = "WHERE c.ativo = 0";

            if (setor !== "todos") {
                where += (where ? " AND " : "WHERE ") + `c.setor_id = ${setor}`;
            }

            let orderBy = "";
            if (ordem === "nome") {
                orderBy = "ORDER BY c.nome COLLATE NOCASE ASC";
            } else if (ordem === "setor") {
                orderBy = "ORDER BY s.nome COLLATE NOCASE ASC, c.nome COLLATE NOCASE ASC";
            }

            const query = `
                SELECT 
                    c.id,
                    c.nome,
                    c.setor_id,
                    s.nome AS setor_nome,
                    c.data_admissao,
                    c.data_demissao,
                    c.ativo
                FROM colaboradores c
                JOIN setores s ON s.id = c.setor_id
                ${where}
                ${orderBy}
            `;

            const result = db.exec(query);
            return result[0]?.values || [];
        },

        criar({ nome, setorId, dataAdmissao, dataDemissao }) {
            db.run(
                `INSERT INTO colaboradores (nome, setor_id, data_admissao, data_demissao, ativo)
                 VALUES (?, ?, ?, ?, ?)`,
                [nome, setorId, dataAdmissao, dataDemissao, dataDemissao ? 0 : 1]
            );
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("colaboradores-atualizados"));
        },

        editar(id, { nome, setorId, dataAdmissao, dataDemissao }) {
            db.run(
                `UPDATE colaboradores
                 SET nome = ?, setor_id = ?, data_admissao = ?, data_demissao = ?, ativo = ?
                 WHERE id = ?`,
                [
                    nome,
                    setorId,
                    dataAdmissao,
                    dataDemissao,
                    dataDemissao ? 0 : 1,
                    id
                ]
            );
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("colaboradores-atualizados"));
        },

        ativar(id) {
            db.run(`UPDATE colaboradores SET ativo = 1 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("colaboradores-atualizados"));
        },

        inativar(id) {
            db.run(`UPDATE colaboradores SET ativo = 0 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("colaboradores-atualizados"));
        }
    };
}
