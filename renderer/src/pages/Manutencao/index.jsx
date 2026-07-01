import { useState } from "react";

export default function ManutencaoPage() {
    const [mensagem, setMensagem] = useState("");

    async function dropVendas() {
        await window.api.manutencao.dropVendas();
        setMensagem("Tabela VENDAS foi recriada com sucesso.");
    }

    async function dropComissoes() {
        await window.api.manutencao.dropComissoes();
        setMensagem("Tabela COMISSOES foi recriada com sucesso.");
    }

    async function resetBanco() {
        await window.api.manutencao.resetBanco();
        setMensagem("Banco de dados foi resetado completamente.");
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Manutenção do Sistema</h2>

            <p>Use estas opções apenas durante testes.</p>

            <button onClick={dropVendas} style={{ marginRight: 10 }}>
                Recriar tabela Vendas
            </button>

            <button onClick={dropComissoes} style={{ marginRight: 10 }}>
                Recriar tabela Comissões
            </button>

            <button onClick={resetBanco} style={{ background: "red", color: "#fff" }}>
                Resetar banco inteiro
            </button>

            {mensagem && (
                <div style={{ marginTop: 20, color: "green" }}>
                    <strong>{mensagem}</strong>
                </div>
            )}
        </div>
    );
}
