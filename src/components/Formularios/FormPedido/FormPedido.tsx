import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';
import ClienteRequests from '../../../fetch/ClienteRequests';
import ProdutoRequests from '../../../fetch/ProdutoRequests';
import type { ClienteDTO } from '../../../dto/ClienteDTO';
import type { ProdutoDTO } from '../../../dto/ProdutoDTO';
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
        quantidade: '1',
        dataPedido: '',
        valorTotal: '',
        formaPagamento: '',
        pago: false,
    });
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
    const produtoSelecionado = produtos.find((produto) => String(produto.idProduto) === formData.idProduto);

    const atualizarQuantidade = (quantidade: string) => {
        const valorQuantidade = Number(quantidade);
        setFormData((prev) => ({
            ...prev,
            quantidade,
            valorTotal: produtoSelecionado && Number.isInteger(valorQuantidade) && valorQuantidade > 0
                ? (produtoSelecionado.preco * valorQuantidade).toFixed(2).replace('.', ',')
                : ''
        }));
    };

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [listaClientes, listaProdutos] = await Promise.all([
                    ClienteRequests.obterListaDeClientes(),
                    ProdutoRequests.obterListaDeProdutos()
                ]);

                setClientes(listaClientes.filter((cliente) => cliente.idCliente));
                setProdutos(listaProdutos.filter((produto) => {
                    const disponibilidade = produto.disponibilidade.trim().toLowerCase();
                    return produto.idProduto && (disponibilidade === 'disponível' || disponibilidade === 'disponivel');
                }));
            } catch (error) {
                setMensagemErro(error instanceof Error ? error.message : 'Não foi possível carregar clientes e produtos.');
            } finally {
                setCarregandoOpcoes(false);
            }
        };

        void carregarOpcoes();
    }, []);

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
            setMensagemErro('Selecione um cliente.');
            setEnviando(false);
            return;
        }

        if (!Number.isInteger(Number(formData.idProduto)) || Number(formData.idProduto) <= 0) {
            setMensagemErro('Selecione um produto disponível.');
            setEnviando(false);
            return;
        }

        if (!Number.isInteger(Number(formData.quantidade)) || Number(formData.quantidade) <= 0) {
            setMensagemErro('Informe uma quantidade válida.');
            setEnviando(false);
            return;
        }

        if (Number.isNaN(dataPedido.getTime())) {
            setMensagemErro('Informe uma data de pedido válida.');
            setEnviando(false);
            return;
        }

        if (!Number.isFinite(valorTotal) || valorTotal < 0 || valorTotal > 99999999.99
            || Math.abs(valorTotal - Math.round(valorTotal * 100) / 100) > 1e-8) {
            setMensagemErro('Informe um valor total válido, entre R$0,00 e R$99.999.999,99, com até duas casas decimais.');
            setEnviando(false);
            return;
        }

        if (!['dinheiro', 'cartao', 'pix'].includes(formData.formaPagamento)) {
            setMensagemErro('Selecione uma forma de pagamento.');
            setEnviando(false);
            return;
        }

        if (valorTotal < 15) {
            setMensagemErro('Pedido não finalizado. O valor mínimo para pedidos é de R$15,00.');
            setEnviando(false);
            return;
        }

        const dadosPedido = {
            idCliente: Number(formData.idCliente),
            idProduto: Number(formData.idProduto),
            quantidade: Number(formData.quantidade),
            dataPedido,
            valorTotal,
            statusPedido: formData.pago ? 'Em preparo' : 'Aguardando pagamento',
            formaPagamento: formData.formaPagamento as 'dinheiro' | 'cartao' | 'pix',
            pago: formData.pago
        };

        try {
            const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

            if (resposta.sucesso) {
                setMensagem(resposta.mensagem ?? 'Pedido cadastrado com sucesso.');
                setFormData({ idCliente: '', idProduto: '', quantidade: '1', dataPedido: '', valorTotal: '', formaPagamento: '', pago: false });
                navigate('/lista/pedido');
            } else {
                setMensagemErro(resposta.mensagem ?? 'Não foi possível cadastrar o pedido. Confira os dados e tente novamente.');
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
                        <small>Escolha o cliente, o produto, a quantidade e o pagamento</small>
                    </div>

                    <div className="pedido-fields">
                        <div>
                            <div>
                                <label htmlFor="idCliente">Cliente</label>
                                <select name="idCliente" id="idCliente" required disabled={carregandoOpcoes || clientes.length === 0} value={formData.idCliente} onChange={(event) => setFormData(prev => ({ ...prev, idCliente: event.target.value }))}>
                                    <option value="" disabled>{carregandoOpcoes ? 'Carregando clientes...' : 'Selecione o cliente'}</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.idCliente} value={cliente.idCliente}>{cliente.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="idProduto">Produto</label>
                                <select name="idProduto" id="idProduto" required disabled={carregandoOpcoes || produtos.length === 0} value={formData.idProduto} onChange={(event) => {
                                    const produto = produtos.find((item) => String(item.idProduto) === event.target.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        idProduto: event.target.value,
                                        valorTotal: produto
                                            ? (produto.preco * Number(prev.quantidade || '1')).toFixed(2).replace('.', ',')
                                            : prev.valorTotal
                                    }));
                                }}>
                                    <option value="" disabled>{carregandoOpcoes ? 'Carregando produtos...' : 'Selecione o produto disponível'}</option>
                                    {produtos.map((produto) => (
                                        <option key={produto.idProduto} value={produto.idProduto}>{produto.nomeProduto}</option>
                                    ))}
                                </select>
                                {produtoSelecionado && (
                                    <small className="pedido-field-hint">
                                        Preço unitário: {produtoSelecionado.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="dataPedido">Data do Pedido</label>
                                <input type="date" name="dataPedido" id="dataPedido" required value={formData.dataPedido} onChange={handleChange} />
                            </div>

                            <div>
                                <label htmlFor="quantidade">Quantidade</label>
                                <input type="number" name="quantidade" id="quantidade" required min="1" max="2147483647" step="1" value={formData.quantidade} onChange={(event) => atualizarQuantidade(event.target.value)} />
                            </div>

                            <div>
                                <label htmlFor="valorTotal">Valor Total</label>
                                <div className="pedido-money-field">
                                    <span>R$</span>
                                    <input type="text" name="valorTotal" id="valorTotal" required readOnly inputMode="decimal" value={formData.valorTotal} placeholder="0,00" aria-describedby="valorTotal-ajuda" />
                                </div>
                                <small id="valorTotal-ajuda" className="pedido-field-hint">Calculado pelo preço unitário e pela quantidade</small>
                            </div>
                        </div>

                        <div className="pedido-status-row">
                            <div>
                                <label htmlFor="formaPagamento">Forma de pagamento</label>
                                <select name="formaPagamento" id="formaPagamento" required value={formData.formaPagamento} onChange={(event) => setFormData(prev => ({ ...prev, formaPagamento: event.target.value }))}>
                                    <option value="" disabled>Selecione uma forma</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="pix">PIX</option>
                                </select>
                                <label className="mt-3 flex items-center gap-2" htmlFor="pago">
                                    <input type="checkbox" id="pago" checked={formData.pago} onChange={(event) => setFormData(prev => ({ ...prev, pago: event.target.checked }))} />
                                    Pagamento realizado
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pedido-actions">
                        <input type="submit" value={enviando ? "CADASTRANDO..." : "CADASTRAR PEDIDO"} disabled={enviando || carregandoOpcoes || clientes.length === 0 || produtos.length === 0} />
                        <button type="button" onClick={() => navigate('/lista/pedido')} disabled={enviando}>VOLTAR PARA LISTAGEM</button>
                    </div>

                </form>

            </div>
        </main>
    );
}

export default FormPedido;