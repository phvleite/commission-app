import { useEffect, useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function useSituacoes() {
    const [tipos, setTipos] = useState([]);
    const [situacoes, setSituacoes] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);

    const [filtroColaborador, setFiltroColaborador] = useState("todos");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroDataInicial, setFiltroDataInicial] = useState("");
    const [filtroDataFinal, setFiltroDataFinal] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAno, setFiltroAno] = useState("");

    const [mostrarTipos, setMostrarTipos] = useState(false);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    const { addToast } = useToast();

    // ---------------------------------------------------------
    // CARREGAMENTO DE DADOS
    // ---------------------------------------------------------

    async function carregarTipos() {
        const data = await window.api.situacoes.listarTipos();
        setTipos(data);
    }

    async function carregarColaboradores() {
        const data = await window.api.colaboradores.listar({
            status: "todos",
            ordem: "nome",
            setor: "todos"
        });
        setColaboradores(data);
    }

    async function carregarSituacoes() {
        let data = await window.api.situacoes.listarSituacoes();

        if (filtroColaborador !== "todos") {
            data = data.filter((s) => s[3] === Number(filtroColaborador));
        }

        if (filtroTipo !== "todos") {
            data = data.filter((s) => s[5] === Number(filtroTipo));
        }

        if (filtroDataInicial) {
            data = data.filter((s) => s[1] >= filtroDataInicial);
        }

        if (filtroDataFinal) {
            data = data.filter((s) => s[2] <= filtroDataFinal);
        }

        if (filtroMes) {
            data = data.filter((s) => s[1].substring(5, 7) === filtroMes);
        }

        if (filtroAno) {
            data = data.filter((s) => s[1].substring(0, 4) === filtroAno);
        }

        setSituacoes(data);
    }

    // ---------------------------------------------------------
    // CRUD TIPO DE SITUAÇÃO
    // ---------------------------------------------------------

    async function criarTipo(descricao) {
        await window.api.situacoes.criarTipo(descricao);
        carregarTipos();
    }

    async function editarTipo(id, descricao) {
        await window.api.situacoes.editarTipo(id, descricao);
        carregarTipos();
    }

    async function ativarTipo(id) {
        await window.api.situacoes.ativarTipo(id);
        carregarTipos();
    }

    async function inativarTipo(id) {
        await window.api.situacoes.inativarTipo(id);
        carregarTipos();
    }

    // ---------------------------------------------------------
    // CRUD SITUAÇÃO
    // ---------------------------------------------------------

    async function criarSituacao(dataInicial, dataFinal, colaboradorId, tipoId) {
        try {
            await window.api.situacoes.criarSituacao(dataInicial, dataFinal, colaboradorId, tipoId);
            carregarSituacoes();
        } catch (err) {
            addToast(err.message, "error");
        }
    }

    async function editarSituacao(id, dataInicial, dataFinal, colaboradorId, tipoId) {
        try {
            await window.api.situacoes.editarSituacao(
                id,
                dataInicial,
                dataFinal,
                colaboradorId,
                tipoId
            );
            carregarSituacoes();
        } catch (err) {
            addToast(err.message, "error");
        }
    }

    async function ativarSituacao(id) {
        await window.api.situacoes.ativarSituacao(id);
        carregarSituacoes();
    }

    async function inativarSituacao(id) {
        await window.api.situacoes.inativarSituacao(id);
        carregarSituacoes();
    }

    // ---------------------------------------------------------
    // USE EFFECTS
    // ---------------------------------------------------------

    useEffect(() => {
        carregarTipos();
        carregarColaboradores();
    }, []);

    useEffect(() => {
        carregarSituacoes();
    }, [
        filtroColaborador,
        filtroTipo,
        filtroDataInicial,
        filtroDataFinal,
        filtroMes,
        filtroAno
    ]);

    return {
        tipos,
        situacoes,
        colaboradores,

        filtroColaborador,
        filtroTipo,
        filtroDataInicial,
        filtroDataFinal,
        filtroMes,
        filtroAno,

        setFiltroColaborador,
        setFiltroTipo,
        setFiltroDataInicial,
        setFiltroDataFinal,
        setFiltroMes,
        setFiltroAno,

        criarTipo,
        editarTipo,
        ativarTipo,
        inativarTipo,

        criarSituacao,
        editarSituacao,
        ativarSituacao,
        inativarSituacao,

        mostrarTipos,
        setMostrarTipos,
        mostrarCadastro,
        setMostrarCadastro
    };
}
