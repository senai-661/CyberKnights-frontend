import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';
import Feedback from '../../Feedback/Feedback';

function converterValor(valor: string): number {
    return Number(valor.trim().replace(',', '.'));
}

function converterData(valor: string): Date {
    return new Date(`${valor}T00:00:00`);
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

        const valorTotal = converterValor(formData.valorTotal);
        const dataPedido = converterData(formData.dataPedido);

        if (!Number.isInteger(Number(formData.idCliente)) || Number(formData.idCliente) <= 0) {
            setMensagemErro('Informe um ID de cliente válido.');
            setEnviando(false);
            return;
        }

        if (!Number.isInteger(Number(formData.idProduto)) || Number(formData.idProduto) <= 0) {
            setMensagemErro('Informe um ID de produto válido.');
            setEnviando(false);
            return;
        }

        if (Number.isNaN(dataPedido.getTime())) {
            setMensagemErro('Informe uma data de pedido válida.');
            setEnviando(false);
            return;
        }

        if (!Number.isFinite(valorTotal) || valorTotal < 0) {
            setMensagemErro('Informe um valor total válido, por exemplo: 49,90.');
            setEnviando(false);
            return;
        }

        if (!formData.statusPedido) {
            setMensagemErro('Selecione o status do pedido.');
            setEnviando(false);
            return;
        }

        const dadosPedido = {
            idCliente: Number(formData.idCliente),
            idProduto: Number(formData.idProduto),
            dataPedido,
            valorTotal,
            statusPedido: formData.statusPedido.trim()
        };

        try {
            const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

            if (resposta) {
                setMensagem('Pedido cadastrado com sucesso.');
                setFormData({ idCliente: '', idProduto: '', dataPedido: '', valorTotal: '', statusPedido: '' });
            } else {
                setMensagemErro('Não foi possível cadastrar o pedido. Confira os dados e tente novamente.');
            }
        } catch (error) {
            setMensagemErro(error instanceof Error ? error.message : 'Não foi possível conectar ao servidor.');
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
                    <div className="pedido-heading">
                        <div className="pedido-heading-icon" aria-hidden="true"><i className="pi pi-shopping-bag" /></div>
                        <div>
                            <p className="pedido-eyebrow">Operação de vendas</p>
                            <h1>Cadastro de <span>Pedido</span></h1>
                            <p className="pedido-subtitle">Registre uma nova venda com os dados do cliente, produto e entrega.</p>
                        </div>
                    </div>

                    {mensagem && <Feedback tipo="sucesso">{mensagem}</Feedback>}
                    {mensagemErro && <Feedback tipo="erro">{mensagemErro}</Feedback>}

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