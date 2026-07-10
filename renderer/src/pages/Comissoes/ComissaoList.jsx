import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { formatDateFromDatabase } from "../../utils/formatDate";

export default function ComissaoList({ comissoes, setores, venda, data }) {
    if (comissoes.length === 0) return null;

    return (
        <div style={{ marginTop: 30 }}>
            <h3>Comissões do dia {formatDateFromDatabase(data)}</h3>

            {/* RESUMO FINANCEIRO */}
            {venda && (
                <div style={{ marginBottom: 20 }}>
                    <p><strong>Valor da Venda:</strong> R$ {formatCurrencyFromDatabase(venda.valor)}</p>
                    <p><strong>Comissão Total:</strong> R$ {formatCurrencyFromDatabase(venda.valor_comissao_total)}</p>
                </div>
            )}

            {/* TABELA POR SETOR */}
            <h4>Resumo por Setor</h4>
            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginBottom: 30 }}>
                <thead>
                    <tr>
                        <th>Setor</th>
                        <th>Comissão do Setor</th>
                        <th>Qtd Colab.</th>
                        <th>Qtd Aptos</th>
                    </tr>
                </thead>

                <tbody>
                    {setores.map((s) => (
                        <tr key={s.id}>
                            <td>{s.setor}</td>
                            <td>R$ {formatCurrencyFromDatabase(s.valor_total_setor)}</td>
                            <td>{s.qtd_total_colaboradores}</td>
                            <td>{s.qtd_aptos_colaboradores}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TABELA POR COLABORADOR */}
            <h4>Comissões por Colaborador</h4>
            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Colaborador</th>
                        <th>Setor</th>
                        <th>Situação</th>
                        <th>Valor do Colaborador</th>
                    </tr>
                </thead>

                <tbody>
                    {comissoes.map((c) => (
                        <tr key={c.id}>
                            <td>{c.colaborador}</td>
                            <td>{c.setor}</td>
                            <td>{c.situacao}</td>
                            <td>R$ {formatCurrencyFromDatabase(c.valor_colaborador)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
