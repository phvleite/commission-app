import electron from "electron";
const { BrowserWindow } = electron;

import path from "path";
import fs from "fs";

export async function gerarPeriodoTodos(resultado) {
    // Janela oculta
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            sandbox: false
        }
    });

    // Carrega o template HTML
    await win.loadFile(
        path.join(__dirname, "../pdf-templates/periodo-todos.html")
    );

    // Injeta os dados no HTML
    await win.webContents.executeJavaScript(`
        window.renderPDF(${JSON.stringify(resultado)});
    `);

    // Gera o PDF
    const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        marginsType: 1
    });

    // Caminho do arquivo final
    const filePath = path.join(
        process.env.USERPROFILE || process.env.HOME,
        "Relatorio-Periodo-Todos.pdf"
    );

    // Salva o PDF
    fs.writeFileSync(filePath, pdfBuffer);

    return filePath;
}
