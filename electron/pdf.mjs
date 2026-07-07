import { ipcRenderer } from "electron";

export function pdfAPI() {
    return {
        gerarRelatorioPeriodoTodos: (resultado) => ipcRenderer.invoke("pdf:gerarPeriodoTodos", resultado)
    };
}
