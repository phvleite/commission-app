import { useEffect, useState } from "react";

export default function VendaSetoresModal({ data, onClose }) {
    const [setores, setSetores] = useState([]);

    useEffect(() => {
        async function carregar() {
            const lista = await window.api.comissoes.listarSetoresPorDia(data);
            setSetores(lista);
        }
        carregar();
    }, [data]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: 20,
                    borderRadius: 8,
                    width: "600px"
                }}
            >
                <h3>Comissões por Setor — {data}</h3>

                <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
                    <thead>
                        <tr>
                            <th>Setor</th>
                            <th>Percentual</th>
                            <th>Valor Total</th>
                            <th>Total Colaboradores</th>
                            <th>Aptos</th>
                        </tr>
                    </thead>

                    <tbody>
                        {setores.map((s) => (
                            <tr key={s.id}>
                                <td>{s.setor}</td>
                                <td>{s.percentual_aplicado}%</td>
                                <td>R$ {s.valor_total_setor.toFixed(2)}</td>
                                <td>{s.qtd_total_colaboradores}</td>
                                <td>{s.qtd_aptos_colaboradores}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />

                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
