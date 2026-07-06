import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ComissoesPage from "../../renderer/src/pages/Comissoes/index.jsx";
import { ToastProvider } from "../../renderer/src/components/ToastContext.jsx";

describe("ComissoesPage", () => {
    beforeEach(() => {
        window.api = {
            colaboradores: {
                listar: jest
                    .fn()
                    .mockResolvedValue([
                        [1, "Ana Silva", 1, "Vendas", "2024-01-01", null, 1],
                    ]),
            },
            comissoes: {
                listarMensalColaborador: jest.fn(),
                listarMensalTodos: jest.fn(),
                listarPorPeriodoColaborador: jest.fn(),
                listarPorPeriodo: jest.fn(),
            },
        };
    });

    it("carrega os colaboradores e os exibe no select", async () => {
        render(
            <ToastProvider>
                <ComissoesPage />
            </ToastProvider>,
        );

        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "Ana Silva" }),
            ).toBeInTheDocument();
        });
    });
});
