import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { useComissoes } from "./useComissoes";

export default function RelatorioPeriodoTodos({ resultado }) {
    const { dados, resumoSetores } = resultado.dados;
    const { vendasPeriodo = [], dataInicial, dataFinal } = resultado;

    const {
        gerarTituloPeriodo,
        agruparPorColaborador,
        calcularTotalGeral
    } = useComissoes();

    const titulo = gerarTituloPeriodo(dataInicial, dataFinal);

    // Agrupar por colaborador
    const agrupado = agruparPorColaborador(dados);

    // Total geral (somatório das comissões individuais)
    const totalGeral = calcularTotalGeral(dados);

    // ============================
    // VALORES DO PERÍODO (VENDAS)
    // ============================
    const totalVendas = vendasPeriodo.length > 0
        ? vendasPeriodo.reduce((acc, v) => acc + v.valor, 0)
        : 0;

    const totalComissao = vendasPeriodo.length > 0
        ? vendasPeriodo.reduce((acc, v) => acc + v.valor_comissao_total, 0)
        : 0;

    // ============================
    // SOMA DOS SETORES (inclui meritocracia)
    // ============================
    const somaSetores = resumoSetores.reduce(
        (acc, s) => acc + s.valor_total_setor,
        0
    );

    // ============================
    // SOMA DOS SETORES SEM MERITOCRACIA
    // ============================
    const somaSemMeritocracia = resumoSetores
        .filter(s => s.setor.toUpperCase() !== "MERITOCRACIA")
        .reduce((acc, s) => acc + s.valor_total_setor, 0);

    return (
        <div className="list-card" style={{ marginTop: 25 }}>
            <h3>{titulo}</h3>
            <hr />

            {/* VALORES DO PERÍODO */}
            <div className="info-line">
                <strong>Valor total das vendas:</strong>
                R$ {formatCurrencyFromDatabase(totalVendas)}
            </div>

            <div className="info-line">
                <strong>Comissão total do período:</strong>
                R$ {formatCurrencyFromDatabase(totalComissao)}
            </div>

            <hr />

            {/* RESUMO POR SETOR */}
            <h4>Resumo por Setor</h4>
            <table className="venda-modal-table" style={{ marginBottom: 25 }}>
                <thead>
                    <tr>
                        <th>Setor</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    {resumoSetores.map((s, idx) => (
                        <tr key={idx}>
                            <td>{s.setor}</td>
                            <td>R$ {formatCurrencyFromDatabase(s.valor_total_setor)}</td>
                        </tr>
                    ))}

                    {/* TOTAL DOS SETORES */}
                    <tr>
                        <td><strong>Total dos Setores</strong></td>
                        <td><strong>R$ {formatCurrencyFromDatabase(somaSetores)}</strong></td>
                    </tr>

                    {/* TOTAL SEM MERITOCRACIA */}
                    <tr>
                        <td><strong>Total dos Setores (sem meritocracia)</strong></td>
                        <td><strong>R$ {formatCurrencyFromDatabase(somaSemMeritocracia)}</strong></td>
                    </tr>
                </tbody>
            </table>

            {/* TABELA POR COLABORADOR */}
            <h4>Comissões por Colaborador</h4>
            <table className="venda-modal-table">
                <thead>
                    <tr>
                        <th>Colaborador</th>
                        <th>Setor</th>
                        <th>Total no Período</th>
                    </tr>
                </thead>
                <tbody>
                    {agrupado.map((c, idx) => (
                        <tr key={idx}>
                            <td>{c.colaborador}</td>
                            <td>{c.setor}</td>
                            <td>R$ {formatCurrencyFromDatabase(c.totalComissao)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTAL GERAL */}
            <div style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
                Total Geral: R$ {formatCurrencyFromDatabase(totalGeral)}
            </div>

            {/* BOTÃO PDF */}
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
            const filePath = await window.api.pdf.gerarRelatorioPeriodoTodos(resultado);
            alert("PDF gerado em: " + filePath);
        } catch (err) {
            alert("Erro ao gerar PDF: " + (err && err.message));
        }
    })();
}
