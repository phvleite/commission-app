import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MainLayout() {
    const [soma, setSoma] = useState(0);
    const location = useLocation();

    useEffect(() => {
        async function carregarSoma() {
            const total = await window.api.setores.soma();
            setSoma(total);
        }

        carregarSoma(); // Atualiza ao trocar de rota

        // ⭐ CORREÇÃO: força Chromium a recuperar foco após re-render
        setTimeout(() => {
            window.focus();
        }, 50);

        function atualizar() {
            carregarSoma();
        }

        // Atualiza quando setores mudam
        window.addEventListener("setores-atualizados", atualizar);

        return () => {
            window.removeEventListener("setores-atualizados", atualizar);
        };
    }, [location]);

    const setoresOk = soma === 100;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <aside
                style={{
                    width: 220,
                    background: "#222",
                    color: "#fff",
                    padding: 20
                }}
            >
                <h2>Commission App</h2>

                <nav style={{ marginTop: 20 }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li>
                            <Link to="/" style={{ color: "#fff" }}>
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link to="/setores" style={{ color: "#fff" }}>
                                Setores
                            </Link>
                        </li>

                        <li
                            style={{
                                opacity: setoresOk ? 1 : 0.4,
                                pointerEvents: setoresOk ? "auto" : "none"
                            }}
                        >
                            <Link to="/colaboradores" style={{ color: "#fff" }}>
                                Colaboradores
                            </Link>
                        </li>

                        <li
                            style={{
                                opacity: setoresOk ? 1 : 0.4,
                                pointerEvents: setoresOk ? "auto" : "none"
                            }}
                        >
                            <Link to="/situacoes" style={{ color: "#fff" }}>
                                Situações
                            </Link>
                        </li>
                        <li
                            style={{
                                opacity: setoresOk ? 1 : 0.4,
                                pointerEvents: setoresOk ? "auto" : "none"
                            }}
                        >
                            <Link to="/vendas" style={{ color: "#fff" }}>
                                Vendas
                            </Link>
                        </li>
                        <li
                            style={{
                                opacity: setoresOk ? 1 : 0.4,
                                pointerEvents: setoresOk ? "auto" : "none"
                            }}
                        >
                            <Link to="/comissoes" style={{ color: "#fff" }}>
                                Comissões
                            </Link>
                        </li>
                        <li>
                            <Link to="/manutencao" style={{ color: "#fff" }}>
                                Manutenção
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 20, fontSize: 14 }}>
                    Soma atual:{" "}
                    <span style={{ color: setoresOk ? "lightgreen" : "red" }}>{soma}%</span>
                </div>
            </aside>

            <main style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </main>
        </div>
    );
}
