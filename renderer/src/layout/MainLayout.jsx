import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    const location = useLocation();
    const [soma, setSoma] = useState(0);

    useEffect(() => {
        async function carregarSoma() {
            const total = await window.api.setores.soma();
            setSoma(total);
        }

        carregarSoma();

        // Chromium foco
        setTimeout(() => {
            window.focus();
        }, 50);

        function atualizar() {
            carregarSoma();
        }

        window.addEventListener("setores-atualizados", atualizar);

        return () => {
            window.removeEventListener("setores-atualizados", atualizar);
        };
    }, [location]);

    return (
        <>
            <Sidebar soma={soma} />

            <div className="main-content">
                <div className={`page ${location.pathname === "/situacoes" ? "situacoes-page" : ""}`}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
