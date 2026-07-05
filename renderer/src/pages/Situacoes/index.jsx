import useSituacoes from "./useSituacoes";
import TipoSituacaoForm from "./TipoSituacaoForm";
import TipoSituacaoList from "./TipoSituacaoList";
import SituacaoForm from "./SituacaoForm";
import SituacaoList from "./SituacaoList";

export default function SituacoesPage() {
    const {
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
    } = useSituacoes();

    return (
        <div>
            <h1>Situações</h1>

            <hr />

            <div className="filters-row">
                <button className="btn-primary" onClick={() => setMostrarTipos(!mostrarTipos)}>
                    Tipo de Situação
                </button>

                <button className="btn-primary" onClick={() => setMostrarCadastro(!mostrarCadastro)}>
                    Cadastro de Situação
                </button>
            </div>

            {/* ---------------------------------------------------------
                TIPOS DE SITUAÇÃO
            --------------------------------------------------------- */}
            {mostrarTipos && (
                <section className="tipos-container">
                    <div className="tipos-form">
                        <TipoSituacaoForm onSubmit={criarTipo} />
                    </div>

                    <div className="tipos-list">
                        <TipoSituacaoList
                            tipos={tipos}
                            onEditar={editarTipo}
                            onAtivar={ativarTipo}
                            onInativar={inativarTipo}
                        />
                    </div>
                </section>
            )}

            <hr />

            {/* ---------------------------------------------------------
                SITUAÇÕES
            --------------------------------------------------------- */}
            {mostrarCadastro && (
                <section>
                    <h2>Cadastro de Situação</h2>

                    {tipos.filter((t) => t[2] === 1).length === 0 ? (
                        <div className="situ-warning">
                            ⚠ Não é possível cadastrar uma Situação porque não existe nenhum Tipo de Situação ativo.
                            <br />
                            Cadastre um Tipo de Situação acima.
                        </div>
                    ) : (
                        <SituacaoForm
                            colaboradores={colaboradores}
                            tipos={tipos.filter((t) => t[2] === 1)}
                            onSubmit={criarSituacao}
                        />
                    )}

               </section>
            )}

            {/* Filtros */}
            <div className="situ-filters">

                <div className="situ-filter-group">
                    <label>Colaborador:</label>
                    <select value={filtroColaborador} onChange={(e) => setFiltroColaborador(e.target.value)}>
                        <option value="todos">Todos</option>
                        {colaboradores.map(([id, nome]) => (
                            <option key={id} value={id}>{nome}</option>
                        ))}
                    </select>
                </div>

                <div className="situ-filter-group">
                    <label>Tipo:</label>
                    <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                        <option value="todos">Todos</option>
                        {tipos.map(([id, descricao]) => (
                            <option key={id} value={id}>{descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="situ-filter-group">
                    <label>Data inicial:</label>
                    <input
                        type="date"
                        value={filtroDataInicial}
                        onChange={(e) => setFiltroDataInicial(e.target.value)}
                    />
                </div>

                <div className="situ-filter-group">
                    <label>Data final:</label>
                    <input
                        type="date"
                        value={filtroDataFinal}
                        onChange={(e) => setFiltroDataFinal(e.target.value)}
                    />
                </div>

                <div className="situ-filter-group">
                    <label>Mês:</label>
                    <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="01">Janeiro</option>
                        <option value="02">Fevereiro</option>
                        <option value="03">Março</option>
                        <option value="04">Abril</option>
                        <option value="05">Maio</option>
                        <option value="06">Junho</option>
                        <option value="07">Julho</option>
                        <option value="08">Agosto</option>
                        <option value="09">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>

                <div className="situ-filter-group">
                    <label>Ano:</label>
                    <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>

            </div>

            <hr />

            <SituacaoList
                situacoes={situacoes}
                colaboradores={colaboradores}
                tipos={tipos}
                onEditar={editarSituacao}
                onAtivar={ativarSituacao}
                onInativar={inativarSituacao}
            />
        </div>
    );
}
