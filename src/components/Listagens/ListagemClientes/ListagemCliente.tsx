import { type JSX } from "react";
import { useState, useEffect } from "react";
import ClienteRequests from "../../../fetch/ClienteRequests";

function ListagemClientes(): JSX.Element {
    const [Clientes, setClientes] = useState([]);

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const listaDeClientes = await ClienteRequests.obterListaDeClientes();
                setClientes(listaDeClientes);
            } catch (error) {
                console.error(`Erro ao buscar clientes. ${error}`);
                alert("Erro ao criar a listagem de clientes.");
            }
        }

        buscarClientes();
    }, []);

    return (
        <main className="bg-gray-200 h-[76vh]"> {/* Web Semântica SEO (Search Engine Optimizer) */}
            <div className="w-8/10 flex m-auto p-12">
                <h1 className="w-9/10 text-3xl text-center">Clientes</h1>
                <a href="#" className="w-1/10 p-3 text-md bg-slate-700 rounded-md text-center text-white font-bold flex items-center justify-center hover:cursor-pointer">
                    Novo Cliente
                </a>
            </div>

            <div className="w-8/10 max-w-[80%] max-h-7/10 overflow-auto overscroll-none m-auto border border-slate-800">
                <table className="table-auto w-full border-collapse text-sm">
                    <thead className="bg-slate-700 sticky top-0 z-10">
                        <tr>
                            <th className="border border-slate-600 text-white">ID</th>
                            <th className="border border-slate-600 text-white">Nome</th>
                            <th className="border border-slate-600 text-white">E-mail</th>
                            <th className="border border-slate-600 text-white">Telefone</th>
                            <th className="border border-slate-600 text-white">Endereço</th>
                            <th className="border border-slate-600 text-white">CPF</th>
                        </tr>
                    </thead>
                    <tbody> {/* Dados fictícios (por enquanto) */}
                        {Clientes.map((cliente) => (
                            <tr className="border-b-2 text-center odd:bg-slate-300 even:bg-slate-100 hover:bg-slate-600 hover:text-white hover:cursor-pointer" key={cliente.id_cliente}>
                                <td>{cliente.id_cliente}</td>
                                <td className="p-3">{cliente.nome}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.telefone}</td>
                                <td>{cliente.endereco}</td>
                                <td>{cliente.cpf}</td>
                                <td>
                                    <a href="#" className="inline-block bg-sky-600 p-2 m-2 w-1/5 rounded-md text-white text-center">Detalhes</a>
                                    <a href="#" className="inline-block bg-emerald-400 p-2 m-2 w-1/5 rounded-md text-white">Atualizar</a>
                                    <a href="#" className="inline-block bg-red-600 p-2 m-2 w-1/5 rounded-md text-white">Deletar</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );

}
export default ListagemClientes;