import { type JSX } from "react";
import { useState, useEffect } from "react";
import ProdutoRequests from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";
import { useNavigate } from "react-router-dom";
import Navegacao from "../../../components/Navegacao/Navegacao";

function ListagemProdutos(): JSX.Element {
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const listaDeProdutos = await ProdutoRequests.obterListaDeProdutos();
                setProdutos(listaDeProdutos);
            } catch (error) {
                console.error(`Erro ao buscar produtos. ${error}`);
                alert("Erro ao criar a listagem de produtos.");
            }
        }

        buscarProdutos();
    }, []);

    // Lógica de Paginação
    const totalPages = Math.ceil(produtos.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentProdutos = produtos.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
    <Navegacao />

    <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden"> {/* overflow-hidden no main para conter o scroll interno */}
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">Produtos</h1>
                <a href="/cadastro/produto" className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-slate-700 rounded-md text-center text-white font-bold flex items-center justify-center hover:cursor-pointer hover:bg-slate-600 transition-all shadow-md hover:shadow-lg active:scale-95">
                    Novo Produto
                </a>
            </div>

            <input type="text" name="busca-produto" id="busca-produto" placeholder="Buscar produto" className="w-full max-w-6xl mx-auto p-3 md:p-2 md:mb-4 border-b-2 border-slate-700 rounded-sm" />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden md:table-cell text-left">ID</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">Nome produto</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden sm:table-cell text-left">Preço</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden lg:table-cell text-left">Disponibilidade</th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentProdutos && currentProdutos.length > 0 ? (
                                currentProdutos.map((produto) => (
                                    <tr className="text-center md:text-left transition-colors hover:bg-slate-50 group" key={produto.idProduto}>
                                        <td className="p-3 md:p-4 hidden md:table-cell text-slate-500">{produto.idProduto}</td>
                                        <td className="p-3 md:p-4 hidden sm:table-cell text-slate-600">{produto.nomeProduto}</td>
                                        <td className="p-3 md:p-4 hidden sm:table-cell text-slate-600">{produto.preco}</td>
                                        <td className="p-3 md:p-4 hidden sm:table-cell text-slate-600">{produto.disponibilidade}</td>

                                        <td className="p-2 md:p-4">
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-2">
                                                <button
                                                    className="w-full sm:w-auto bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-sky-600 hover:text-white transition-all hover:cursor-pointer"
                                                    onClick={() => navigate(`/detalhes/produto/${produto.idProduto}`)}
                                                >
                                                    Detalhes
                                                </button>
                                                <button className="w-full sm:w-auto bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-emerald-600 hover:text-white transition-all">Atualizar</button>
                                                <button className="w-full sm:w-auto bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-red-600 hover:text-white transition-all">Deletar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-10 text-slate-500 italic">
                                        Nenhum produto encontrado
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Próximo
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Mostrando <span className="font-semibold">{indexOfFirstRow + 1}</span> até <span className="font-semibold">{Math.min(indexOfLastRow, produtos.length)}</span> de <span className="font-semibold">{produtos.length}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
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
                                    disabled={currentPage === totalPages}
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

export default ListagemProdutos;
