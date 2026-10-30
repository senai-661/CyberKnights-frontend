import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';
import ClienteRequests from '../../../fetch/ClienteRequests';
import ProdutoRequests from '../../../fetch/ProdutoRequests';
import type { ClienteDTO } from '../../../dto/ClienteDTO';
import type { ProdutoDTO } from '../../../dto/ProdutoDTO';
import { agruparTamanhosMilkshake, identificarTamanhoMilkshake, nomeMilkshake, SABORES_MILKSHAKE } from '../../../utils/Milkshake';
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
        saborMilkshake: '',
        dataPedido: '',
        valorTotal: '',
        statusPedido: '',
    });
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [listaAberta, setListaAberta] = useState<'cliente' | 'produto' | null>(null);
    const [carregandoLista, setCarregandoLista] = useState(false);
    const [listasCarregadas, setListasCarregadas] = useState({ clientes: false, produtos: false });
    const [buscaCliente, setBuscaCliente] = useState('');
    const [buscaProduto, setBuscaProduto] = useState('');
    const [ingredientesRemovidos, setIngredientesRemovidos] = useState<string[]>([]);
    const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([]);

    const alternarLista = async (tipo: 'cliente' | 'produto') => {
        if (listaAberta === tipo) {
            setListaAberta(null);
            return;
        }

        setListaAberta(tipo);
        const chave = tipo === 'cliente' ? 'clientes' : 'produtos';
        if (listasCarregadas[chave]) return;

        setCarregandoLista(true);
        try {
            if (tipo === 'cliente') {
                setClientes(await ClienteRequests.obterListaDeClientes());
            } else {
                setProdutos(await ProdutoRequests.obterListaDeProdutos());
            }
            setListasCarregadas((anteriores) => ({ ...anteriores, [chave]: true }));
        } finally {
            setCarregandoLista(false);
        }
    };

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(buscaCliente.trim().toLowerCase())
    );
    const tamanhosMilkshake = agruparTamanhosMilkshake(produtos);
    const produtoSelecionado = produtos.find((produto) => String(produto.idProduto) === formData.idProduto);
    const tamanhoMilkshakeSelecionado = tamanhosMilkshake.find((tamanho) => tamanho.produto.idProduto === produtoSelecionado?.idProduto);
    const tamanhoSelecionado = produtoSelecionado ? identificarTamanhoMilkshake(produtoSelecionado.nomeProduto) : null;
    const milkshakeSelecionado = tamanhoSelecionado !== null;
    const ingredientesProduto = produtoSelecionado?.ingredientes ?? [];
    const adicionaisProduto = produtoSelecionado?.adicionais ?? [];
    const precoBasePedido = milkshakeSelecionado
        ? tamanhoMilkshakeSelecionado?.preco ?? 0
        : Number(produtoSelecionado?.preco ?? 0);
    const precoAdicionais = adicionaisProduto
        .filter((adicional) => adicionaisSelecionados.includes(adicional.nome))
        .reduce((total, adicional) => total + adicional.preco, 0);
    const valorPedidoCalculado = precoBasePedido + precoAdicionais;
    const produtosFiltrados = produtos.filter((produto) =>
        identificarTamanhoMilkshake(produto.nomeProduto) === null &&
        produto.nomeProduto.toLowerCase().includes(buscaProduto.trim().toLowerCase())
    );

    const selecionarProduto = (produto: ProdutoDTO) => {
        const tamanho = identificarTamanhoMilkshake(produto.nomeProduto);
        const tamanhoMilkshake = tamanhosMilkshake.find((item) => item.produto.idProduto === produto.idProduto);
        setFormData((anterior) => ({
            ...anterior,
            idProduto: String(produto.idProduto ?? ''),
            saborMilkshake: tamanho ? anterior.saborMilkshake : '',
            valorTotal: tamanhoMilkshake?.preco.toFixed(2) ?? Number(produto.preco).toFixed(2)
        }));
        setIngredientesRemovidos([]);
        setAdicionaisSelecionados([]);
        setListaAberta(null);
    };

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

        if (milkshakeSelecionado && !formData.saborMilkshake) {
            setMensagemErro('Selecione o sabor do milkshake.');
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
            ...(milkshakeSelecionado ? { saborMilkshake: formData.saborMilkshake } : {}),
            ...(ingredientesRemovidos.length ? { ingredientesRemovidos } : {}),
            ...(adicionaisSelecionados.length ? { adicionaisSelecionados } : {}),
            dataPedido,
            valorTotal: valorPedidoCalculado || valorTotal,
            statusPedido: formData.statusPedido.trim()
        };

        try {
            const resposta = await PedidoRequests.enviarFormularioPedido(dadosPedido);

            if (resposta) {
                setMensagem('Pedido cadastrado com sucesso.');
                setFormData({ idCliente: '', idProduto: '', saborMilkshake: '', dataPedido: '', valorTotal: '', statusPedido: '' });
                setIngredientesRemovidos([]);
                setAdicionaisSelecionados([]);
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
                                <label htmlFor="buscaCliente">Cliente</label>
                                <div className="pedido-selector-control">
                                    <input id="buscaCliente" type="text" value={clientes.find((cliente) => String(cliente.idCliente) === formData.idCliente)?.nome ?? ''} readOnly placeholder="Selecione um cliente" />
                                    <button type="button" className="pedido-list-toggle" onClick={() => void alternarLista('cliente')} aria-expanded={listaAberta === 'cliente'}>
                                        {listaAberta === 'cliente' ? 'Fechar lista' : 'Ver clientes'}
                                    </button>
                                </div>
                                <small className="pedido-field-hint">Escolha pelo nome do cliente</small>
                                {listaAberta === 'cliente' && <div className="pedido-options-panel">
                                    <input type="search" value={buscaCliente} onChange={(event) => setBuscaCliente(event.target.value)} placeholder="Filtrar clientes pelo nome" aria-label="Filtrar clientes pelo nome" />
                                    {carregandoLista ? <p>Carregando clientes...</p> : clientesFiltrados.length ? clientesFiltrados.map((cliente) => <button type="button" key={cliente.idCliente} onClick={() => { setFormData((anterior) => ({ ...anterior, idCliente: String(cliente.idCliente ?? '') })); setListaAberta(null); }}>
                                        <span>{cliente.nome}</span><small>ID {cliente.idCliente}</small>
                                    </button>) : <p>Nenhum cliente encontrado.</p>}
                                </div>}
                            </div>

                            <div>
                                <label htmlFor="buscaProduto">Produto</label>
                                <div className="pedido-selector-control">
                                    <input id="buscaProduto" type="text" value={produtoSelecionado ? (tamanhoMilkshakeSelecionado ? `${nomeMilkshake(tamanhoMilkshakeSelecionado)}${formData.saborMilkshake ? ` - ${formData.saborMilkshake}` : ''}` : produtoSelecionado.nomeProduto) : ''} readOnly placeholder="Selecione um produto" />
                                    <button type="button" className="pedido-list-toggle" onClick={() => void alternarLista('produto')} aria-expanded={listaAberta === 'produto'}>
                                        {listaAberta === 'produto' ? 'Fechar lista' : 'Ver produtos'}
                                    </button>
                                </div>
                                <small className="pedido-field-hint">Escolha pelo nome do produto</small>
                                {listaAberta === 'produto' && <div className="pedido-options-panel">
                                    <input type="search" value={buscaProduto} onChange={(event) => setBuscaProduto(event.target.value)} placeholder="Filtrar produtos pelo nome" aria-label="Filtrar produtos pelo nome" />
                                    {carregandoLista ? <p>Carregando produtos...</p> : <>
                                        {tamanhosMilkshake.filter((tamanho) => !buscaProduto.trim() || `milkshake ${tamanho.nome} ${tamanho.mililitros}ml`.includes(buscaProduto.trim().toLowerCase())).map((tamanho) => <button type="button" key={`milkshake-${tamanho.chave}`} onClick={() => selecionarProduto(tamanho.produto)}>
                                            <span className="pedido-option-copy"><strong>{nomeMilkshake(tamanho)}</strong><small>{tamanho.produto.ingredientes?.join(', ') || 'Ingredientes ainda não cadastrados'}</small></span><small>{tamanho.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</small>
                                        </button>)}
                                        {produtosFiltrados.map((produto) => <button type="button" key={produto.idProduto} onClick={() => selecionarProduto(produto)}>
                                        <span className="pedido-option-copy"><strong>{produto.nomeProduto}</strong><small>{produto.ingredientes?.join(', ') || 'Ingredientes ainda não cadastrados'}</small></span><small>{Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</small>
                                        </button>)}
                                        {!produtosFiltrados.length && !tamanhosMilkshake.length && <p>Nenhum produto encontrado.</p>}
                                    </>}
                                </div>}
                                {milkshakeSelecionado && <div className="pedido-flavor-field">
                                    <label htmlFor="saborMilkshake">Sabor do milkshake</label>
                                    <select id="saborMilkshake" value={formData.saborMilkshake} onChange={(event) => setFormData((anterior) => ({ ...anterior, saborMilkshake: event.target.value }))} required>
                                        <option value="" disabled>Selecione um sabor</option>
                                        {SABORES_MILKSHAKE.map((sabor) => <option key={sabor} value={sabor}>{sabor}</option>)}
                                    </select>
                                    <small className="pedido-field-hint">O sabor não altera o preço do tamanho selecionado.</small>
                                </div>}
                                {produtoSelecionado && <div className="pedido-customizations">
                                    <section>
                                        <h3>Ingredientes incluídos</h3>
                                        {ingredientesProduto.length ? ingredientesProduto.map((ingrediente) => <label className="pedido-customization-option" key={ingrediente}>
                                            <input type="checkbox" checked={ingredientesRemovidos.includes(ingrediente)} onChange={() => setIngredientesRemovidos((anteriores) => anteriores.includes(ingrediente) ? anteriores.filter((item) => item !== ingrediente) : [...anteriores, ingrediente])} />
                                            <span>Retirar {ingrediente}</span>
                                        </label>) : <p>Os ingredientes deste produto ainda não foram cadastrados.</p>}
                                    </section>
                                    {adicionaisProduto.length > 0 && <section>
                                        <h3>Adicionais</h3>
                                        {adicionaisProduto.map((adicional) => <label className="pedido-customization-option" key={adicional.nome}>
                                            <input type="checkbox" checked={adicionaisSelecionados.includes(adicional.nome)} onChange={() => setAdicionaisSelecionados((anteriores) => anteriores.includes(adicional.nome) ? anteriores.filter((item) => item !== adicional.nome) : [...anteriores, adicional.nome])} />
                                            <span>{adicional.nome}</span><strong>+ {adicional.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                        </label>)}
                                    </section>}
                                </div>}
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
                                    <input type="text" name="valorTotal" id="valorTotal" required readOnly={Boolean(produtoSelecionado)} inputMode="decimal" pattern="[0-9]+([,.][0-9]{1,2})?" value={produtoSelecionado ? valorPedidoCalculado.toFixed(2) : formData.valorTotal} onChange={handleChange} placeholder="0,00" aria-describedby="valorTotal-ajuda" />
                                </div>
                                <small id="valorTotal-ajuda" className="pedido-field-hint">{produtoSelecionado ? 'Total do produto mais os adicionais selecionados' : 'Use vírgula ou ponto para os centavos'}</small>
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