import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">COMMISSION APP</h2>

            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/setores">Setores</NavLink>
                <NavLink to="/colaboradores">Colaboradores</NavLink>
                <NavLink to="/situacoes">Situações</NavLink>
                <NavLink to="/vendas">Vendas</NavLink>
                <NavLink to="/comissoes">Comissões</NavLink>
                <NavLink to="/manutencao">Manutenção</NavLink>
            </nav>
        </div>
    );
}
