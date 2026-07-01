export default function VendaList({ vendas }) {
    return (
        <div>
            <h3>Histórico de Vendas</h3>

            <ul>
                {vendas.map((v) => (
                    <li key={v.id}>
                        {v.data} — R$ {v.valor.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
