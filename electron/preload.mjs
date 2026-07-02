import { contextBridge } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

let initSqlJs = null;

import { setoresAPI, setoresMigrations } from "./database/setores.mjs";
import { colaboradoresAPI, colaboradoresMigrations } from "./database/colaboradores.mjs";
import { situacoesAPI, situacoesMigrations } from "./database/situacoes.mjs";
import { vendasAPI, vendasMigrations } from "./database/vendas.mjs";
import { comissoesAPI, comissoesMigrations } from "./database/comissoes.mjs";

// ------------------------------------------------------------
// CONFIGURAÇÕES BÁSICAS
// ------------------------------------------------------------
process.env.NODE_ENV = "development"; // força DEV no modo dev

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recebe o caminho do AppData enviado pelo main.js
const userDataPath = process.argv
    .find((arg) => arg.startsWith("--userDataPath="))
    ?.replace("--userDataPath=", "");

// Caminho do banco (DEV vs PRODUÇÃO)
const isDev = process.env.NODE_ENV === "development";

const dbPath = isDev
    ? path.join(__dirname, "database.sqlite") // DEV → electron/database.sqlite
    : path.join(userDataPath, "database.sqlite"); // PRODUÇÃO → %APPDATA%/commission-app/database.sqlite

let db = null;
let SQL = null;

// ------------------------------------------------------------
// INICIALIZAÇÃO DO BANCO + SQL.js
// ------------------------------------------------------------
async function init() {
    // carrega o módulo `sql.js` dinamicamente — em produção usamos o arquivo copiado em `resources`
    if (!initSqlJs) {
        if (isDev) {
            const mod = await import("sql.js");
            initSqlJs = mod.default || mod.initSqlJs || mod;
        } else {
            const sqlJsPath = path.join(process.resourcesPath, "sql.js");
            const mod = await import(pathToFileURL(sqlJsPath).href);
            initSqlJs = mod.default || mod.initSqlJs || mod;
        }
    }

    SQL = await initSqlJs({
        locateFile: (file) => {
            if (isDev) {
                return path.join(__dirname, file); // DEV → electron/sql-wasm.wasm
            }
            return path.join(process.resourcesPath, file); // PRODUÇÃO → resources/sql-wasm.wasm
        }
    });

    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    setoresMigrations(db);
    colaboradoresMigrations(db);
    situacoesMigrations(db);
    vendasMigrations(db);
    comissoesMigrations(db);

    saveDatabase();
}

// ------------------------------------------------------------
// SALVAR BANCO
// ------------------------------------------------------------
function saveDatabase() {
    setTimeout(() => {
        const data = db.export();
        fs.writeFileSync(dbPath, Buffer.from(data));
    }, 0);
}

await init();

// ------------------------------------------------------------
// API EXPOSTA PARA O FRONT-END
// ------------------------------------------------------------
const setores = setoresAPI(db, saveDatabase);
const colaboradores = colaboradoresAPI(db, saveDatabase);
const situacoes = situacoesAPI(db, saveDatabase);
const comissoes = comissoesAPI(db, saveDatabase);
const vendas = vendasAPI(db, saveDatabase, comissoes);

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
