export default function ComissaoList({ comissoes, data }) {
    if (comissoes.length === 0) return null;

    return (
        <div style={{ marginTop: 30 }}>
            <h3>Comissões do dia {data}</h3>

            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Colaborador</th>
                        <th>Setor</th>
                        <th>Situação</th>
                        <th>Valor do Setor</th>
                        <th>Qtd Normais</th>
                        <th>Valor do Colaborador</th>
                    </tr>
                </thead>

                <tbody>
                    {comissoes.map((c) => (
                        <tr key={c.id}>
                            <td>{c.colaborador}</td>
                            <td>{c.setor}</td>
                            <td>{c.situacao}</td>
                            <td>R$ {c.valor_setor.toFixed(2)}</td>
                            <td>{c.qtd_normais}</td>
                            <td>R$ {c.valor_colaborador.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
