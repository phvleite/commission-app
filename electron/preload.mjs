import { contextBridge } from "electron";
import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";
import { fileURLToPath } from "url";

import { setoresAPI, setoresMigrations } from "./database/setores.js";
import { colaboradoresAPI, colaboradoresMigrations } from "./database/colaboradores.js";
import { situacoesAPI, situacoesMigrations } from "./database/situacoes.js";
import { vendasAPI, vendasMigrations } from "./database/vendas.js";
import { comissoesAPI, comissoesMigrations } from "./database/comissoes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), "database.sqlite");

let db = null;
let SQL = null;

async function init() {
    SQL = await initSqlJs({
        locateFile: (file) => new URL(file, "http://localhost:5173").toString()
    });

    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Rodar TODAS as migrations
    setoresMigrations(db);
    colaboradoresMigrations(db);
    situacoesMigrations(db);
    vendasMigrations(db);
    comissoesMigrations(db);

    saveDatabase();
}

function saveDatabase() {
    setTimeout(() => {
        const data = db.export();
        fs.writeFileSync(dbPath, Buffer.from(data));
    }, 0);
}

// Inicializar banco ANTES de expor API
await init();

// Instanciar APIs
const setores = setoresAPI(db, saveDatabase);
const colaboradores = colaboradoresAPI(db, saveDatabase);
const situacoes = situacoesAPI(db, saveDatabase);
const comissoes = comissoesAPI(db, saveDatabase);

// vendas precisa receber comissoesAPI para recalcular comissões
const vendas = vendasAPI(db, saveDatabase, comissoes);

// Expor API no frontend
contextBridge.exposeInMainWorld("api", {
    setores,
    colaboradores,
    situacoes,
    vendas,
    comissoes,

    manutencao: {
        async dropVendas() {
            db.run("DROP TABLE IF EXISTS vendas");
            vendasMigrations(db);
            saveDatabase();
            return true;
        },

        async dropComissoes() {
            db.run("DROP TABLE IF EXISTS comissoes");
            db.run("DROP TABLE IF EXISTS venda_comissoes_setores");
            comissoesMigrations(db);
            saveDatabase();
            return true;
        },

        async resetBanco() {
            if (fs.existsSync(dbPath)) {
                fs.unlinkSync(dbPath);
            }

            await init();
            saveDatabase();
            return true;
        }
    }
});
