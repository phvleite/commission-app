import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ soma }) {

    const setoresOk = soma === 100;

    return (
        <aside className="sidebar">

            <h2>Commission App</h2>

            <nav>
                <ul>

                    <li>
                        <NavLink to="/" className="sidebar-link">
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/setores" className="sidebar-link">
                            Setores
                        </NavLink>
                    </li>

                    <li className={!setoresOk ? "disabled-link" : ""}>
                        <NavLink to="/colaboradores" className="sidebar-link">
                            Colaboradores
                        </NavLink>
                    </li>

                    <li className={!setoresOk ? "disabled-link" : ""}>
                        <NavLink to="/situacoes" className="sidebar-link">
                            Situações
                        </NavLink>
                    </li>

                    <li className={!setoresOk ? "disabled-link" : ""}>
                        <NavLink to="/vendas" className="sidebar-link">
                            Vendas
                        </NavLink>
                    </li>

                    <li className={!setoresOk ? "disabled-link" : ""}>
                        <NavLink to="/comissoes" className="sidebar-link">
                            Comissões
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/manutencao" className="sidebar-link">
                            Manutenção
                        </NavLink>
                    </li>

                </ul>
            </nav>

        </aside>
    );
}
