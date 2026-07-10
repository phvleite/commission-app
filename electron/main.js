const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

Menu.setApplicationMenu(null);

ipcMain.handle("pdf:gerarPeriodoTodos", async (event, resultado) => {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            sandbox: false
        }
    });

    // caminho do template (relativo à pasta electron)
    const templatePath = path.join(__dirname, "pdf-templates", "relatorio-periodo-todos.html");

    await win.loadFile(templatePath);

    await win.webContents.executeJavaScript(`window.renderPDF(${JSON.stringify(resultado)});`);

    const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        marginsType: 1
    });

    const filePath = path.join(
        process.env.USERPROFILE || process.env.HOME,
        "Relatorio-Periodo-Todos.pdf"
    );

    fs.writeFileSync(filePath, pdfBuffer);

    // fecha a janela criada
    try {
        win.close();
    } catch (e) {}

    // tenta abrir o PDF automaticamente
    try {
        await shell.openPath(filePath);
    } catch (e) {}

    return filePath;
});

ipcMain.handle("pdf:gerarPeriodoColaborador", async (event, resultado) => {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            sandbox: false
        }
    });

    const templatePath = path.join(
        __dirname,
        "pdf-templates",
        "relatorio-periodo-colaborador.html"
    );

    await win.loadFile(templatePath);

    await win.webContents.executeJavaScript(`window.renderPDF(${JSON.stringify(resultado)});`);

    const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        marginsType: 1
    });

    const filePath = path.join(
        process.env.USERPROFILE || process.env.HOME,
        "Relatorio-Periodo-Colaborador.pdf"
    );

    fs.writeFileSync(filePath, pdfBuffer);

    try {
        win.close();
    } catch (e) {}

    try {
        await shell.openPath(filePath);
    } catch (e) {}

    return filePath;
});

function createWindow() {
    const userDataPath = app.getPath("userData");

    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            contextIsolation: true,
            sandbox: false,
            nodeIntegration: false,
            webSecurity: true,
            additionalArguments: [`--userDataPath=${userDataPath}`]
        }
    });

    if (!app.isPackaged) {
        win.loadURL("http://localhost:5173");
    } else {
        win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
    }
}

app.whenReady().then(createWindow);
