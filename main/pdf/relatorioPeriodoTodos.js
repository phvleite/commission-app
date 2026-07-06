export function gerarRelatorioPeriodoTodos(resultado) {
    const { dados, resumoSetores } = resultado.dados;
    const { dataInicial, dataFinal } = resultado;

    const titulo =
        dataInicial === dataFinal
            ? `COMISSÕES DE ${dataInicial}`
            : `COMISSÕES DE ${dataInicial} À ${dataFinal}`;

    let html = `
        <h2>${titulo}</h2>
        <hr />

        <h3>Resumo por Setor</h3>
        <table border="1" cellspacing="0" cellpadding="6" width="100%">
            <tr>
                <th>Setor</th>
                <th>Valor Total</th>
                <th>Total Colaboradores</th>
                <th>Aptos</th>
            </tr>
    `;

    resumoSetores.forEach(s => {
        html += `
            <tr>
                <td>${s.setor}</td>
                <td>R$ ${s.valor_total_setor}</td>
                <td>${s.qtd_total_colaboradores}</td>
                <td>${s.qtd_aptos_colaboradores}</td>
            </tr>
        `;
    });

    html += `
        </table>

        <h3>Comissões por Colaborador</h3>
        <table border="1" cellspacing="0" cellpadding="6" width="100%">
            <tr>
                <th>Colaborador</th>
                <th>Setor</th>
                <th>Total no Período</th>
            </tr>
    `;

    const mapa = new Map();
    dados.forEach(row => {
        const chave = row.colaborador;
        const atual = mapa.get(chave) || { setor: row.setor, total: 0 };
        atual.total += row.valor_colaborador;
        mapa.set(chave, atual);
    });

    mapa.forEach((v, nome) => {
        html += `
            <tr>
                <td>${nome}</td>
                <td>${v.setor}</td>
                <td>R$ ${v.total}</td>
            </tr>
        `;
    });

    html += `</table>`;

    window.api.pdf.gerar(html);
}
