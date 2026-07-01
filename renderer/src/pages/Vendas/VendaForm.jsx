import { useState } from "react";
import { useToast } from "../../components/ToastContext.jsx";
import { formatCurrency, currencyToNumber } from "../../utils/formatCurrency"; // ⭐ IMPORTAR AQUI

export default function VendaForm({ onSave }) {
    const [data, setData] = useState("");
    const [valor, setValor] = useState("");
    const { addToast } = useToast();

    function handleValorChange(e) {
        const texto = e.target.value;
        const formatado = formatCurrency(texto); // ⭐ FORMATA EM TEMPO REAL
        setValor(formatado);
    }

    async function salvar() {
        if (!data || !valor) {
            addToast("Informe a data e o valor.", "error");
            return;
        }

        const valorConvertido = currencyToNumber(valor); // ⭐ CONVERTE PARA NÚMERO REAL

        if (isNaN(valorConvertido) || valorConvertido <= 0) {
            addToast("Valor inválido. Informe um valor maior que zero.", "error");
            return;
        }

        const vendaExistente = await window.api.vendas.buscarPorData(data);
        if (vendaExistente) {
            addToast("Já existe uma venda registrada para esta data.", "error");
            return;
        }

        await window.api.vendas.salvar(data, valorConvertido);
        await window.api.comissoes.gerar(data);

        onSave();

        setData("");
        setValor("");

        addToast("Venda registrada e comissões geradas.", "success");
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Lançar Venda</h3>

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
                onChange={handleValorChange} // ⭐ MÁSCARA EM TEMPO REAL
            />

            <br /><br />

            <button onClick={salvar}>Salvar</button>
        </div>
    );
}
