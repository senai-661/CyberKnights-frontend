import { useEffect, useState, type FormEvent } from 'react';
import Navegacao from '../../components/Navegacao/Navegacao';
import Feedback from '../../components/Feedback/Feedback';
import ProdutoRequests from '../../fetch/ProdutoRequests';
import type { ProdutoDTO } from '../../dto/ProdutoDTO';

const PREFIXO_COMBO = 'Combo: ';
const CHAVE_COMPOSICAO_COMBOS = 'combosComposicao';

type ComposicaoCombo = Record<string, string[]>;

function lerComposicaoCombos(): ComposicaoCombo {
    try {
        const salva = localStorage.getItem(CHAVE_COMPOSICAO_COMBOS);
        return salva ? JSON.parse(salva) as ComposicaoCombo : {};
    } catch {
        return {};
    }
}

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function PCombos() {
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [nomeCombo, setNomeCombo] = useState('');
    const [precoCombo, setPrecoCombo] = useState('');
    const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
    const [composicaoCombos, setComposicaoCombos] = useState<ComposicaoCombo>(lerComposicaoCombos);

    useEffect(() => {
        let ativo = true;
        ProdutoRequests.obterListaDeProdutos().then((lista) => {
            if (ativo) setProdutos(Array.isArray(lista) ? lista : []);
        }).finally(() => {
            if (ativo) setCarregando(false);
        });
        return () => { ativo = false; };
    }, []);

    const produtosBase = produtos.filter((produto) => !produto.nomeProduto.startsWith(PREFIXO_COMBO));
    const combos = produtos.filter((produto) => produto.nomeProduto.startsWith(PREFIXO_COMBO));
    const selecionados = produtosBase.filter((produto) =>
        produto.idProduto !== undefined && produtosSelecionados.includes(produto.idProduto)
    );
    const precoOriginal = selecionados.reduce((total, produto) => total + Number(produto.preco || 0), 0);
    const economia = Math.max(0, precoOriginal - Number(precoCombo.replace(',', '.')));

    const alternarProduto = (idProduto: number) => {
        setProdutosSelecionados((atuais) => atuais.includes(idProduto)
            ? atuais.filter((id) => id !== idProduto)
            : [...atuais, idProduto]
        );
    };

    const criarCombo = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);

        const preco = Number(precoCombo.replace(',', '.'));
        if (selecionados.length < 2) {
            setFeedback({ tipo: 'erro', texto: 'Selecione pelo menos dois produtos para montar um combo.' });
            return;
        }
        if (!Number.isFinite(preco) || preco < 0) {
            setFeedback({ tipo: 'erro', texto: 'Informe um preço válido para o combo.' });
            return;
        }

        const nomeProduto = `${PREFIXO_COMBO}${nomeCombo.trim()}`;
        if (produtos.some((produto) => produto.nomeProduto.trim().toLocaleLowerCase() === nomeProduto.toLocaleLowerCase())) {
            setFeedback({ tipo: 'erro', texto: 'Já existe um combo com esse nome. Escolha outro nome.' });
            return;
        }

        setSalvando(true);
        const produtoCombo: ProdutoDTO = {
            // Mantém o nome curto para respeitar o limite do campo de produto na API.
            nomeProduto,
            preco,
            disponibilidade: 'Disponível'
        };

        const resposta = await ProdutoRequests.enviarFormularioProduto(produtoCombo);
        if (resposta.sucesso) {
            setFeedback({ tipo: 'sucesso', texto: 'Combo criado e adicionado ao catálogo de produtos.' });
            setNomeCombo('');
            setPrecoCombo('');
            setProdutosSelecionados([]);
            setCarregando(true);
            const listaAtualizada = await ProdutoRequests.obterListaDeProdutos();
            const listaSegura = Array.isArray(listaAtualizada) ? listaAtualizada : [];
            setProdutos(listaSegura);
            const comboSalvo = listaSegura.find((produto) => produto.nomeProduto === nomeProduto);
            if (comboSalvo?.idProduto !== undefined) {
                const composicaoAtualizada = {
                    ...composicaoCombos,
                    [comboSalvo.idProduto]: selecionados.map((produto) => produto.nomeProduto)
                };
                setComposicaoCombos(composicaoAtualizada);
                localStorage.setItem(CHAVE_COMPOSICAO_COMBOS, JSON.stringify(composicaoAtualizada));
            }
            setCarregando(false);
        } else {
            setFeedback({ tipo: 'erro', texto: resposta.mensagem ?? 'Não foi possível criar o combo.' });
        }
        setSalvando(false);
    };

    return (
        <>
            <Navegacao />
            <main className="combos-page">
                <header className="combos-header">
                    <div>
                        <span className="combos-eyebrow">Promoções da casa</span>
                        <h1>Monte seus <span>combos</span></h1>
                        <p>Combine produtos do catálogo, defina um preço promocional e disponibilize o combo para pedidos.</p>
                    </div>
                    <div className="combos-header-icon" aria-hidden="true"><i className="pi pi-tags" /></div>
                </header>

                {feedback && <Feedback tipo={feedback.tipo}>{feedback.texto}</Feedback>}

                <div className="combos-layout">
                    <form className="combo-builder" onSubmit={criarCombo}>
                        <div className="combo-card-heading">
                            <span className="combo-step">01</span>
                            <div><h2>Crie uma promoção</h2><p>Escolha dois ou mais produtos para formar o combo.</p></div>
                        </div>

                        <label htmlFor="nomeCombo">Nome do combo</label>
                        <input id="nomeCombo" value={nomeCombo} onChange={(event) => setNomeCombo(event.target.value)} placeholder="Ex.: Combo Família" required maxLength={40} />

                        <div className="combo-products-heading">
                            <label>Produtos do combo <span>({selecionados.length} selecionados)</span></label>
                            <small>Marque pelo menos dois itens</small>
                        </div>

                        <div className="combo-product-list">
                            {carregando ? <p className="combo-empty">Carregando catálogo...</p> : produtosBase.length ? produtosBase.map((produto) => (
                                <label className={`combo-product-option ${produto.idProduto !== undefined && produtosSelecionados.includes(produto.idProduto) ? 'is-selected' : ''}`} key={produto.idProduto ?? produto.nomeProduto}>
                                    <input type="checkbox" checked={produto.idProduto !== undefined && produtosSelecionados.includes(produto.idProduto)} disabled={produto.idProduto === undefined} onChange={() => produto.idProduto !== undefined && alternarProduto(produto.idProduto)} />
                                    <span className="combo-product-copy"><strong>{produto.nomeProduto}</strong><small>{produto.disponibilidade || 'Disponibilidade não informada'}</small></span>
                                    <span className="combo-product-price">{formatarMoeda(Number(produto.preco || 0))}</span>
                                </label>
                            )) : <p className="combo-empty">Nenhum produto encontrado no catálogo. Cadastre produtos antes de criar um combo.</p>}
                        </div>

                        <div className="combo-pricing">
                            <div><span>Preço separado</span><strong>{formatarMoeda(precoOriginal)}</strong></div>
                            <label htmlFor="precoCombo">Preço do combo
                                <div className="combo-price-input"><span>R$</span><input id="precoCombo" type="number" min="0" step="0.01" value={precoCombo} onChange={(event) => setPrecoCombo(event.target.value)} placeholder="0,00" required /></div>
                            </label>
                            {economia > 0 && <div className="combo-savings"><span>Cliente economiza</span><strong>{formatarMoeda(economia)}</strong></div>}
                        </div>

                        <button className="combo-submit" type="submit" disabled={salvando || carregando || produtosBase.length < 2}>
                            <i className="pi pi-plus" aria-hidden="true" />{salvando ? 'CRIANDO COMBO...' : 'CRIAR COMBO'}
                        </button>
                        <p className="combo-api-note">O combo será salvo no catálogo como um produto e poderá ser selecionado ao cadastrar um pedido.</p>
                    </form>

                    <section className="combo-catalog" aria-labelledby="combos-cadastrados">
                        <div className="combo-card-heading">
                            <span className="combo-step combo-step-muted">02</span>
                            <div><h2 id="combos-cadastrados">Combos cadastrados</h2><p>{combos.length} {combos.length === 1 ? 'combo disponível' : 'combos disponíveis'}</p></div>
                        </div>

                        {carregando ? <p className="combo-empty">Carregando combos...</p> : combos.length ? <div className="combo-saved-list">{combos.map((combo) => {
                            const nomeComboSalvo = combo.nomeProduto.slice(PREFIXO_COMBO.length);
                            const itensCombo = combo.idProduto === undefined ? [] : composicaoCombos[combo.idProduto] ?? [];
                            return <article className="combo-saved-card" key={combo.idProduto ?? combo.nomeProduto}>
                                <div className="combo-saved-icon"><i className="pi pi-gift" aria-hidden="true" /></div>
                                <div className="combo-saved-content"><span className="combo-badge">COMBO</span><h3>{nomeComboSalvo}</h3><p>{itensCombo.length ? itensCombo.join(' + ') : 'Itens do combo não informados'}</p></div>
                                <strong className="combo-saved-price">{formatarMoeda(Number(combo.preco || 0))}</strong>
                            </article>;
                        })}</div> : <div className="combo-empty-state"><i className="pi pi-box" aria-hidden="true" /><strong>Nenhum combo por enquanto</strong><span>Use o formulário para criar sua primeira oferta.</span></div>}
                    </section>
                </div>
            </main>
        </>
    );
}

export default PCombos;