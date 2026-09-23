import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';

function converterValor(valor: string): number {
    return Number(valor.trim().replace(',', '.'));
}

function FormPedido() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idCliente: '',
        idProduto: '',
        dataPedido: '',
        valorTotal: '',
        statusPedido: '',
    });
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensagem('');
        setMensagemErro('');
        setEnviando(true);

        const dadosPedido = {
            idCliente: Number(formData.idCliente),
            idProduto: Number(formData.idProduto),
            dataPedido: new Date(formData.dataPedido),
            valorTotal: Number(formData.valorTotal),
            statusPedido: formData.statusPedido
        };

        const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

        if (!Number.isFinite(valorTotal) || valorTotal < 0) {
            setMensagemErro('Informe um valor total válido, por exemplo: 49,90.');
            setEnviando(false);
            return;
        }

        const dadosPedido = {
            idCliente: Number(formData.idCliente),
            idProduto: Number(formData.idProduto),
            dataPedido: new Date(formData.dataPedido),
            valorTotal,
            statusPedido: formData.statusPedido
        };

        try {
            const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

            if (resposta) {
                setMensagem('Pedido cadastrado com sucesso.');
                setFormData({ idCliente: '', idProduto: '', dataPedido: '', valorTotal: '', statusPedido: '' });
            } else {
                setMensagemErro('Não foi possível cadastrar o pedido. Confira os dados e tente novamente.');
            }
        } catch {
            setMensagemErro('Não foi possível conectar ao servidor.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="pedido-page">
            <div>

                <form
                    onSubmit={handleSubmit}
                    className="pedido-form"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-slate-800 mb-8 sm:mb-12">
                        Cadastro de Pedido
                    </h1>

                    <div className="space-y-6 sm:space-y-8">

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

                    {mensagem && <div className="pedido-feedback pedido-feedback-success" role="status">{mensagem}</div>}
                    {mensagemErro && <div className="pedido-feedback pedido-feedback-error" role="alert">{mensagemErro}</div>}

                    <div className="pedido-section-label">
                        <span>Informações principais</span>
                        <small>Todos os campos são obrigatórios</small>
                    </div>

                    <div className="pedido-fields">
                        <div>
                            <div>
                                <label htmlFor="idCliente">ID do Cliente</label>
                                <input type="number" name="idCliente" id="idCliente" required min="1" value={formData.idCliente} onChange={handleChange} placeholder="Ex.: 12" />
                                <small className="pedido-field-hint">Código do cliente cadastrado</small>
                            </div>

                            <div>
                                <label htmlFor="idProduto">ID do Produto</label>
                                <input type="number" name="idProduto" id="idProduto" required min="1" value={formData.idProduto} onChange={handleChange} placeholder="Ex.: 08" />
                                <small className="pedido-field-hint">Código do produto escolhido</small>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="dataPedido">Data do Pedido</label>
                                <input type="date" name="dataPedido" id="dataPedido" required value={formData.dataPedido} onChange={handleChange} />
                            </div>

                            <div>
                                <label htmlFor="valorTotal">Valor Total</label>
                                <div className="pedido-money-field">
                                    <span>R$</span>
                                    <input type="text" name="valorTotal" id="valorTotal" required inputMode="decimal" pattern="[0-9]+([,.][0-9]{1,2})?" value={formData.valorTotal} onChange={handleChange} placeholder="0,00" aria-describedby="valorTotal-ajuda" />
                                </div>
                                <small id="valorTotal-ajuda" className="pedido-field-hint">Use vírgula ou ponto para os centavos</small>
                            </div>
                        </div>

                        <div className="pedido-status-row">
                            <div>
                                <label htmlFor="statusPedido">Status do Pedido</label>
                                <select name="statusPedido" id="statusPedido" required value={formData.statusPedido} onChange={(event) => setFormData(prev => ({ ...prev, statusPedido: event.target.value }))}>
                                    <option value="" disabled>Selecione um status</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Preparando">Preparando</option>
                                    <option value="Entregue">Entregue</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pedido-actions">
                        <input type="submit" value={enviando ? "CADASTRANDO..." : "CADASTRAR PEDIDO"} disabled={enviando} />
                        <button type="button" onClick={() => navigate('/lista/pedido')} disabled={enviando}>VOLTAR PARA LISTAGEM</button>
                    </div>

                </form>

            </div>
        </main>
    );
}

export default FormPedido;