export function situacoesMigrations(db) {
    // Tabela de tipos de situação
    db.run(`
    CREATE TABLE IF NOT EXISTS tipo_situacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      ativo INTEGER DEFAULT 1
    );
  `);

    // Tabela de situações
    db.run(`
    CREATE TABLE IF NOT EXISTS situacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_inicial TEXT NOT NULL,
      data_final TEXT NOT NULL,
      colaborador_id INTEGER NOT NULL,
      tipo_id INTEGER NOT NULL,
      ativo INTEGER DEFAULT 1,
      FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id),
      FOREIGN KEY (tipo_id) REFERENCES tipo_situacoes(id)
    );
  `);
}

export function situacoesAPI(db, saveDatabase) {
    return {
        // -----------------------------
        // TIPO DE SITUAÇÃO
        // -----------------------------
        listarTipos() {
            const result = db.exec(`
        SELECT id, descricao, ativo
        FROM tipo_situacoes
        ORDER BY descricao COLLATE NOCASE ASC
      `);
            return result[0]?.values || [];
        },

        criarTipo(descricao) {
            db.run(`INSERT INTO tipo_situacoes (descricao) VALUES (?)`, [descricao]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("tipo-situacoes-atualizados"));
        },

        editarTipo(id, descricao) {
            db.run(`UPDATE tipo_situacoes SET descricao = ? WHERE id = ?`, [descricao, id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("tipo-situacoes-atualizados"));
        },

        ativarTipo(id) {
            db.run(`UPDATE tipo_situacoes SET ativo = 1 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("tipo-situacoes-atualizados"));
        },

        inativarTipo(id) {
            db.run(`UPDATE tipo_situacoes SET ativo = 0 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("tipo-situacoes-atualizados"));
        },

        // -----------------------------
        // SITUAÇÕES
        // -----------------------------
        listarSituacoes() {
            const result = db.exec(`
        SELECT 
          s.id,
          s.data_inicial,
          s.data_final,
          c.id AS colaborador_id,
          c.nome AS colaborador_nome,
          t.id AS tipo_id,
          t.descricao AS tipo_descricao,
          s.ativo
        FROM situacoes s
        JOIN colaboradores c ON c.id = s.colaborador_id
        JOIN tipo_situacoes t ON t.id = s.tipo_id
        ORDER BY s.data_inicial DESC
      `);
            return result[0]?.values || [];
        },

        criarSituacao(data_inicial, data_final, colaborador_id, tipo_id) {
            const tiposAtivos =
                db.exec(`
        SELECT id FROM tipo_situacoes WHERE ativo = 1
    `)[0]?.values || [];

            if (tiposAtivos.length === 0) {
                throw new Error(
                    "Não é possível cadastrar uma situação sem tipos de situação ativos."
                );
            }

            // Verificar sobreposição de datas para o mesmo colaborador
            const conflitos =
                db.exec(`
    SELECT id FROM situacoes
    WHERE colaborador_id = ${colaborador_id}
        AND ativo = 1
        AND (
        (data_inicial <= '${data_final}' AND data_final >= '${data_inicial}')
        )
    `)[0]?.values || [];

            if (conflitos.length > 0) {
                throw new Error(
                    "Já existe uma situação cadastrada para este colaborador neste período."
                );
            }

            db.run(
                `INSERT INTO situacoes (data_inicial, data_final, colaborador_id, tipo_id)
        VALUES (?, ?, ?, ?)`,
                [data_inicial, data_final, colaborador_id, tipo_id]
            );

            saveDatabase(db);
            globalThis.dispatchEvent(new Event("situacoes-atualizados"));
        },

        editarSituacao(id, data_inicial, data_final, colaborador_id, tipo_id) {
            db.run(
                `UPDATE situacoes 
         SET data_inicial = ?, data_final = ?, colaborador_id = ?, tipo_id = ?
         WHERE id = ?`,
                [data_inicial, data_final, colaborador_id, tipo_id, id]
            );
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("situacoes-atualizados"));
        },

        ativarSituacao(id) {
            db.run(`UPDATE situacoes SET ativo = 1 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("situacoes-atualizados"));
        },

        inativarSituacao(id) {
            db.run(`UPDATE situacoes SET ativo = 0 WHERE id = ?`, [id]);
            saveDatabase(db);
            globalThis.dispatchEvent(new Event("situacoes-atualizados"));
        }
    };
}
