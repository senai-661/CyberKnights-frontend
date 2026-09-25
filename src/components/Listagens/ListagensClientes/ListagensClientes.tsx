import { type JSX } from "react";
import { useState, useEffect } from "react";
import ClienteRequests from "../../../fetch/ClienteRequests";
import type { ClienteDTO } from "../../../dto/ClienteDTO";
import { useLocation, useNavigate } from "react-router-dom";
import Navegacao from "../../../components/Navegacao/Navegacao";
import Feedback from "../../../components/Feedback/Feedback";

function ListagemClientes(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
    const location = useLocation();
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const listaDeClientes = await ClienteRequests.obterListaDeClientes();
                const clienteAtualizado = (location.state as { clienteAtualizado?: ClienteDTO } | null)?.clienteAtualizado;
                if (clienteAtualizado) {
                    const clienteExiste = listaDeClientes.some((cliente) => cliente.idCliente === clienteAtualizado.idCliente);
                    setClientes(clienteExiste
                        ? listaDeClientes.map((cliente) => cliente.idCliente === clienteAtualizado.idCliente ? { ...cliente, ...clienteAtualizado } : cliente)
                        : [...listaDeClientes, clienteAtualizado]);
                } else {
                    setClientes(listaDeClientes);
                }
            } catch (error) {
                console.error(`Erro ao buscar clientes. ${error}`);
                setErro(error instanceof Error ? error.message : "Erro ao carregar clientes.");
            }
        }

        buscarClientes();
    }, [location.state]);

    const clientesFiltrados = clientes.filter((cliente) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return true;
        return [cliente.nome, cliente.email, cliente.endereco, cliente.telefone, cliente.cpf]
            .some((valor) => valor?.toLowerCase().includes(termo));
    });

    // Lógica de paginação
    const totalPages = Math.ceil(clientesFiltrados.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentClientes = clientesFiltrados.slice(indexOfFirstRow, indexOfLastRow);
    const inicioExibicao = clientesFiltrados.length === 0 ? 0 : indexOfFirstRow + 1;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleDelete = async (idCliente: number) => {
        if (!window.confirm('Deseja realmente excluir este cliente?')) return;
        const resultado = await ClienteRequests.deletarCliente(idCliente);
        if (!resultado.sucesso) {
            setErro(resultado.mensagem ?? 'Não foi possível excluir o cliente.');
            return;
        }
        setClientes((listaAtual) => listaAtual.filter((cliente) => cliente.idCliente !== idCliente));
    };

    return (
    <>
        <Navegacao />

        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">Clientes</h1>
                <button type="button" onClick={() => navigate('/cadastro/cliente')} className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-slate-700 rounded-md text-center text-white font-bold flex items-center justify-center hover:cursor-pointer hover:bg-slate-600 transition-all shadow-md hover:shadow-lg active:scale-95">
                    Novo Cliente
                </button>
            </div>
            {erro && <div className="w-full max-w-7xl mx-auto"><Feedback tipo="erro">{erro}</Feedback></div>}

            <input type="search" name="busca-cliente" id="busca-cliente" value={busca} onChange={(event) => { setBusca(event.target.value); setCurrentPage(1); }} placeholder="Buscar por nome, e-mail, endereço ou telefone" className="w-full max-w-6xl mx-auto p-3 md:p-2 md:mb-4 border-b-2 border-slate-700 rounded-sm" />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">ID</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Nome</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">E-mail</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Endereço</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Telefone</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">CPF</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                        {currentClientes && currentClientes.length > 0 ? (
                            currentClientes.map((cliente) => (
                                <tr className="text-center md:text-left transition-colors hover:bg-slate-50 group" key={cliente.idCliente}>
                                    <td className="p-3 md:p-4 text-slate-500">{cliente.idCliente}</td>
                                    <td className="p-3 md:p-4 text-slate-600">{cliente.nome}</td>
                                    <td className="p-3 md:p-4 text-slate-600">{cliente.email || 'Não informado'}</td>
                                    <td className="p-3 md:p-4 text-slate-600">{cliente.endereco}</td>
                                    <td className="p-3 md:p-4 text-slate-600">{cliente.telefone}</td>
                                    <td className="p-3 md:p-4 text-slate-600">{cliente.cpf ?? '-'}</td>
                                    <td className="p-2 md:p-4">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-2">
                                            <button className="w-full sm:w-auto bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-sky-600 hover:text-white transition-all" onClick={() => navigate(`/detalhes/cliente/${cliente.idCliente}`)}>Detalhes</button>
                                            <button className="w-full sm:w-auto bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-emerald-600 hover:text-white transition-all" onClick={() => navigate(`/atualizar/cliente/${cliente.idCliente}`)}>Atualizar</button>
                                            <button className="w-full sm:w-auto bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-red-600 hover:text-white transition-all" onClick={() => handleDelete(cliente.idCliente!)}>Deletar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center p-10 text-slate-500 italic">Nenhum cliente cadastrado</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Mostrando <span className="font-semibold">{inicioExibicao}</span> até <span className="font-semibold">{Math.min(indexOfLastRow, clientesFiltrados.length)}</span> de <span className="font-semibold">{clientesFiltrados.length}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={totalPages === 0 || currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    <i className="pi pi-chevron-left"></i>
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-slate-700 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={totalPages === 0 || currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Próximo</span>
                                    <i className="pi pi-chevron-right"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}

export default ListagemClientes;