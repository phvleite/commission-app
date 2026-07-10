import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VendaList from "../../renderer/src/pages/Vendas/VendaList.jsx";

describe("VendaList", () => {
    beforeEach(() => {
        window.api = {
            comissoes: {
                listarSetoresPorDia: jest.fn().mockResolvedValue([]),
            },
        };
    });

    it("renderiza o modal ao clicar em Ver Setores", async () => {
        render(
            <VendaList
                vendas={[
                    {
                        id: 1,
                        data: "10/01/2024",
                        valor: 100,
                        valor_comissao_total: 10,
                    },
                ]}
                onEdit={jest.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /ver setores/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/comissões por setor/i),
            ).toBeInTheDocument();
        });
    });
});
