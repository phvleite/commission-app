import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastContext";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Setores from "./pages/Setores";
import Colaboradores from "./pages/Colaboradores";
import SituacoesPage from "./pages/Situacoes";
import VendasPage from "./pages/Vendas";
import ComissoesPage from "./pages/Comissoes";
import ManutencaoPage from "./pages/Manutencao";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ToastProvider>
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="setores" element={<Setores />} />
                    <Route path="colaboradores" element={<Colaboradores />} />
                    <Route path="situacoes" element={<SituacoesPage />} />
                    <Route path="vendas" element={<VendasPage />} />
                    <Route path="comissoes" element={<ComissoesPage />} />
                    <Route path="manutencao" element={<ManutencaoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    </ToastProvider>
);
