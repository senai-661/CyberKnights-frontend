import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';

function FormPedido() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idCliente: '',
        idProduto: '',
        dataPedido: '',
        valorTotal: '',
        statusPedido: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
<<<<<<< HEAD

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
=======
        setFormData((prev: Record<string, string>) => ({ ...prev, [name]: value }));
>>>>>>> a684f86 (nova funcionalidade atualizar)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dadosPedido = {
            idCliente: Number(formData.idCliente),
            idProduto: Number(formData.idProduto),
            dataPedido: new Date(formData.dataPedido),
            valorTotal: Number(formData.valorTotal),
            statusPedido: formData.statusPedido
        };

        const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

        if (resposta) {
            alert("Pedido cadastrado com sucesso");
        } else {
            alert("Erro ao cadastrar pedido");
        }
    };

    return (
        <main className="pedido-page bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className="pedido-form bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-slate-800 mb-8 sm:mb-12">
                        <i className="pi pi-shopping-bag"></i> Cadastro de <span>Pedido</span>
                    </h1>

                    <div className="pedido-fields space-y-6 sm:space-y-8">

                        <div className="flex flex-col sm:flex-row gap-6">

                            <div className="flex-1">
                                <label
                                    htmlFor="idCliente"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    ID do Cliente
                                </label>

                                <input
                                    type="number"
                                    name="idCliente"
                                    id="idCliente"
                                    required
                                    min="1"
                                    onChange={handleChange}
                                    placeholder="Digite o ID do cliente"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="idProduto"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    ID do Produto
                                </label>

                                <input
                                    type="number"
                                    name="idProduto"
                                    id="idProduto"
                                    required
                                    min="1"
                                    onChange={handleChange}
                                    placeholder="Digite o ID do produto"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">

                            <div className="flex-1">
                                <label
                                    htmlFor="dataPedido"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Data do Pedido
                                </label>

                                <input
                                    type="date"
                                    name="dataPedido"
                                    id="dataPedido"
                                    required
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">

                            <div className="flex-1">
                                <label
                                    htmlFor="valorTotal"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Valor Total
                                </label>

                                <input
                                    type="number"
                                    name="valorTotal"
                                    id="valorTotal"
                                    required
                                    min="0"
                                    step="0.01"
                                    onChange={handleChange}
                                    placeholder="R$ 0,00"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">

                            <div className="flex-1">
                                <label
                                    htmlFor="statusPedido"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Status do Pedido
                                </label>

                                <input
                                    type="text"
                                    name="statusPedido"
                                    id="statusPedido"
                                    required
                                    minLength={3}
                                    onChange={handleChange}
                                    placeholder="Em andamento, Concluído, Cancelado..."
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                        </div>

                    </div>

                    <div className="pedido-actions mt-10 sm:mt-14 space-y-4">

                        <input
                            type="submit"
                            value="CADASTRAR PEDIDO"
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                        />

                        <button
                            type="button"
                            onClick={() => navigate('/lista/pedido')}
                            className="w-full bg-white border-2 border-slate-300 text-slate-600 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-[0.98]"
                        >
                            VOLTAR PARA LISTAGEM
                        </button>

                    </div>

                </form>

            </div>
        </main>
    );
}

export default FormPedido;
