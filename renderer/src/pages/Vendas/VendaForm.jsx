import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastContext.jsx";
import { normalizeDateForInput } from "../../utils/formatDate";
import { formatCurrencyInput, formatCurrencyFromDatabase, currencyToNumber } from "../../utils/formatCurrency";

export default function VendaForm({ onSave, onCancel, vendaId }) {
    const [data, setData] = useState("");
    const [valor, setValor] = useState("");
    const { addToast } = useToast();

    const editMode = !!vendaId;

    useEffect(() => {
        if (!editMode) {
            setData("");
            setValor("");
            return;
        }

        async function carregar() {
            const venda = await window.api.vendas.buscarPorId(vendaId);
            if (venda) {
                setData(normalizeDateForInput(venda.data));
                setValor(formatCurrencyFromDatabase(venda.valor));
            }
        }

        carregar();
    }, [vendaId]);

    function handleValorChange(e) {
        const texto = e.target.value;
        const formatado = formatCurrencyInput(texto);
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
            const vendaExistente = await window.api.vendas.buscarPorData(data);
            if (vendaExistente) {
                addToast("Já existe uma venda registrada para esta data.", "error");
                return;
            }

            await window.api.vendas.salvar(data, valorConvertido);
            addToast("Venda registrada e comissões geradas.", "success");
            setValor("");
        } else {
            const resultado = await window.api.vendas.alterar(vendaId, data, valorConvertido);

            if (!resultado.ok) {
                addToast(resultado.erro, "error");
                return;
            }

            addToast("Venda alterada e comissões recalculadas.", "success");
        }

        onSave();
    }

    function cancelar() {
        setData("");
        setValor("");
        onCancel();
    }

    return (
        <div className="venda-form-card">

            <h3>{editMode ? "Alterar Venda" : "Lançar Venda"}</h3>

            <div className="venda-form-grid">
                <div className="venda-form-group">
                    <label>Data:</label>
                    <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
                </div>

                <div className="venda-form-group">
                    <label>Valor:</label>
                    <input type="text" value={valor} onChange={handleValorChange} />
                </div>
            </div>

            <div className="venda-form-actions">
                <button className="btn-primary" onClick={salvar}>
                    {editMode ? "Salvar Alterações" : "Salvar"}
                </button>

                <button className="btn-secondary" onClick={cancelar}>
                    Cancelar
                </button>
            </div>

        </div>
    );
}
