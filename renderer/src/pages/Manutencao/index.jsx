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

    async function dropVendasComissoesSetores() {
        await window.api.manutencao.dropVendasComissoesSetores();
        setMensagem("Tabela VENDA_COMISSOES_SETORES foi recriada com sucesso.");
    }

    async function resetBanco() {
        await window.api.manutencao.resetBanco();
        setMensagem("Banco de dados foi resetado completamente.");
    }

    return (
        <div style={
                {
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start"
                }
            }>
            <h2>Manutenção do Sistema</h2>

            <p>Use estas opções apenas durante testes.</p>

            <button onClick={dropVendas} style={{ margin: 10, width: 300 }}>
                Recriar tabela Vendas
            </button>

            <button onClick={dropComissoes} style={{ margin: 10, width: 300 }}>
                Recriar tabela Comissões
            </button>

            <button onClick={dropVendasComissoesSetores} style={{ margin: 10, width: 300 }}>
                Recriar tabela Venda Comissões Setores
            </button>

            <button onClick={resetBanco} style={{ margin: 10, width: 300, background: "red", color: "#fff" }}>
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
