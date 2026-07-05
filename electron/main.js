const { app, BrowserWindow } = require("electron");
const path = require("path");

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
