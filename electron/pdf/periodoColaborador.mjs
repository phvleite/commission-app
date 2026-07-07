import electron from "electron";
const { BrowserWindow } = electron;

import path from "path";
import fs from "fs";

export async function gerarPeriodoColaborador(resultado) {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            sandbox: false
        }
    });

    await win.loadFile(
        path.join(__dirname, "../pdf-templates/relatorio-periodo-colaborador.html")
    );

    await win.webContents.executeJavaScript(`
        window.renderPDF(${JSON.stringify(resultado)});
    `);

    const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        marginsType: 1
    });

    const filePath = path.join(
        process.env.USERPROFILE || process.env.HOME,
        "Relatorio-Periodo-Colaborador.pdf"
    );

    fs.writeFileSync(filePath, pdfBuffer);

    return filePath;
}
