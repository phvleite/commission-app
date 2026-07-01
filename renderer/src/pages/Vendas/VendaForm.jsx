import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastContext.jsx";
import { formatCurrency, currencyToNumber } from "../../utils/formatCurrency";

export default function VendaForm({ onSave, vendaId }) {
    const [data, setData] = useState("");
    const [valor, setValor] = useState("");
    const { addToast } = useToast();

    const editMode = !!vendaId;

    // Carregar venda para edição
    useEffect(() => {
        async function carregar() {
            if (!editMode) return;

            const venda = await window.api.vendas.buscarPorId(vendaId);
            if (venda) {
                setData(venda.data);
                setValor(formatCurrency(venda.valor.toString()));
            }
        }
        carregar();
    }, [vendaId]);

    function handleValorChange(e) {
        const texto = e.target.value;
        const formatado = formatCurrency(texto);
        setValor(formatado);
    }

    async function salvar() {
        if (!data || !valor) {
            addToast("Informe a data e o valor.", "error");
            return;
        }

        const valorConvertido = currencyToNumber(valor);

        if (isNaN(valorConvertido) || valorConvertido <= 0) {
            addToast("Valor inválido. Informe um valor maior que zero.", "error");
            return;
        }

        if (!editMode) {
            // Criar nova venda
            const vendaExistente = await window.api.vendas.buscarPorData(data);
            if (vendaExistente) {
                addToast("Já existe uma venda registrada para esta data.", "error");
                return;
            }

            await window.api.vendas.salvar(data, valorConvertido);
            addToast("Venda registrada e comissões geradas.", "success");
        } else {
            // Editar venda existente
            await window.api.vendas.alterar(vendaId, data, valorConvertido);
            addToast("Venda alterada e comissões recalculadas.", "success");
        }

        onSave();
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>{editMode ? "Alterar Venda" : "Lançar Venda"}</h3>

            <label>Data:</label>
            <br />
            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />

            <br /><br />

            <label>Valor:</label>
            <br />
            <input
                type="text"
                value={valor}
                placeholder="Digite o valor"
                onChange={handleValorChange}
            />

            <br /><br />

            <button onClick={salvar}>
                {editMode ? "Salvar Alterações" : "Salvar"}
            </button>
        </div>
    );
}
