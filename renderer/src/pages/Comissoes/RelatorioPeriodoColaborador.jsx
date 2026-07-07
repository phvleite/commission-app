import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { gerarTituloPeriodoColaborador } from "../../utils/gerarTituloPeriodoColaborador";
import { formatDateFromDatabase } from "../../utils/formatDate";

export default function RelatorioPeriodoColaborador({ resultado }) {
    const { dados, resumoSetores } = resultado.dados;
    const { dataInicial, dataFinal } = resultado;

    // Nome do colaborador (vem em cada linha)
    const nomeColaborador = dados.length > 0 ? dados[0].colaborador : "Colaborador";

    // Título inteligente
    const titulo = gerarTituloPeriodoColaborador(
        nomeColaborador,
        dataInicial,
        dataFinal
    );

    // Total geral do colaborador
    const totalGeral = dados.reduce((acc, row) => acc + row.valor_colaborador, 0);

    return (
        <div className="list-card" style={{ marginTop: 25 }}>
            <h3>{titulo}</h3>
            <hr />

            <h4>Resumo por Setor</h4>
            <table className="venda-modal-table" style={{ marginBottom: 25 }}>
                <thead>
                    <tr>
                        <th>Setor</th>
                        <th>Valor Total do Setor</th>
                        <th>Valor Total do Colaborador</th>
                    </tr>
                </thead>
                <tbody>
                    {resumoSetores.map((s, idx) => (
                        <tr key={idx}>
                            <td>{s.setor}</td>
                            <td>R$ {formatCurrencyFromDatabase(s.valor_total_setor)}</td>
                            <td>R$ {formatCurrencyFromDatabase(s.valor_total_colaborador)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Detalhamento das Comissões</h4>
            <table className="venda-modal-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Situação</th>
                        <th>Qtde Colab.</th>
                        <th>Qtde Aptos</th>
                        <th>Comissão Setor</th>
                        <th>Comissão Colaborador</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((d, idx) => (
                        <tr key={idx}>
                            <td>{formatDateFromDatabase(d.data)}</td>
                            <td>{d.situacao}</td>
                            <td>{d.qtd_total}</td>
                            <td>{d.qtd_aptos}</td>
                            <td>R$ {formatCurrencyFromDatabase(d.valor_setor)}</td>
                            <td>R$ {formatCurrencyFromDatabase(d.valor_colaborador)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
                Total Geral: R$ {formatCurrencyFromDatabase(totalGeral)}
            </div>

            <div style={{ marginTop: 20 }}>
                <button className="btn-primary" onClick={() => gerarPDF(resultado)}>
                    Gerar PDF
                </button>
            </div>
        </div>
    );
}

function gerarPDF(resultado) {
    (async () => {
        try {
            const filePath = await window.api.pdf.gerarRelatorioPeriodoColaborador(resultado);
            alert("PDF gerado em: " + filePath);
        } catch (err) {
            alert("Erro ao gerar PDF: " + (err && err.message));
        }
    })();
}
