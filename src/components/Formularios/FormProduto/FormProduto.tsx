import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProdutoRequests from '../../../fetch/ProdutoRequests';
import Feedback from '../../Feedback/Feedback';

function FormProduto() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nomeProduto: '',
        preco: '',
        disponibilidade: '',
        ingredientes: '',
    });
    const [adicionais, setAdicionais] = useState([{ nome: '', preco: '' }]);
    const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);

        const dadosProduto = {
            nomeProduto: formData.nomeProduto.trim(),
            preco: Number(formData.preco),
            disponibilidade: formData.disponibilidade.trim(),
            ingredientes: formData.ingredientes.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean),
            adicionais: adicionais.filter((item) => item.nome.trim()).map((item) => ({ nome: item.nome.trim(), preco: Number(item.preco) }))
        };

        if (adicionais.some((item) => item.nome.trim() && (!item.preco || !Number.isFinite(Number(item.preco)) || Number(item.preco) < 0))) {
            setFeedback({ tipo: 'erro', texto: 'Informe um preço válido para cada adicional.' });
            return;
        }

        const produtos = await ProdutoRequests.obterListaDeProdutos();
        const produtoDuplicado = produtos.some((produto) =>
            produto.nomeProduto.trim().toLocaleLowerCase() === dadosProduto.nomeProduto.toLocaleLowerCase()
            && Number(produto.preco) === dadosProduto.preco
            && produto.disponibilidade.trim().toLocaleLowerCase() === dadosProduto.disponibilidade.toLocaleLowerCase()
        );

        if (produtoDuplicado) {
            setFeedback({ tipo: 'erro', texto: 'Este produto já está cadastrado com os mesmos dados.' });
            return;
        }

        setEnviando(true);
        const resposta = await ProdutoRequests.enviarFormularioProduto(dadosProduto);
        setEnviando(false);

        if (resposta.sucesso) {
            setFeedback({ tipo: 'sucesso', texto: 'Produto cadastrado com sucesso.' });
        } else {
            setFeedback({ tipo: 'erro', texto: resposta.mensagem ?? 'Não foi possível cadastrar o produto.' });
        }
    };

    return (
        <main className="produto-page bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className="produto-form bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    {feedback && <Feedback tipo={feedback.tipo}>{feedback.texto}</Feedback>}
                    <h1 className="entity-heading text-3xl sm:text-4xl md:text-5xl text-center font-bold text-slate-800 mb-8 sm:mb-12">
                        <i className="pi pi-box"></i> Cadastro de <span>Produto</span>
                    </h1>

                    <div className="produto-fields space-y-6 sm:space-y-8">

                        <div className="flex flex-col sm:flex-row gap-6">

                            <div className="flex-1">
                                <label
                                    htmlFor="nomeProduto"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Nome do Produto
                                </label>

                                <input
                                    type="text"
                                    name="nomeProduto"
                                    id="nomeProduto"
                                    required
                                    minLength={3}
                                    onChange={handleChange}
                                    placeholder="Digite o nome"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="preco"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Preço
                                </label>

                                <input
                                    type="number"
                                    name="preco"
                                    id="preco"
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
                                    htmlFor="disponibilidade"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Disponibilidade
                                </label>

                                <input
                                    type="text"
                                    name="disponibilidade"
                                    id="disponibilidade"
                                    required
                                    minLength={6}
                                    onChange={handleChange}
                                    placeholder="Disponível, Indisponível"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                        </div>

                        <div className="product-customization-fields">
                            <div>
                                <label htmlFor="ingredientesProduto">Ingredientes incluídos</label>
                                <textarea id="ingredientesProduto" value={formData.ingredientes} onChange={(event) => setFormData((anterior) => ({ ...anterior, ingredientes: event.target.value }))} placeholder="Ex.: pão, hambúrguer, queijo, alface, tomate" rows={3} />
                                <small>Separe os ingredientes por vírgula. O cliente poderá pedir para retirar algum.</small>
                            </div>

                            <div className="product-extras-editor">
                                <div className="product-extras-heading"><div><label>Adicionais disponíveis</label><small>Cadastre cada extra e seu preço.</small></div>
                                    <button type="button" onClick={() => setAdicionais((anteriores) => [...anteriores, { nome: '', preco: '' }])}>+ Adicionar opção</button>
                                </div>
                                {adicionais.map((adicional, index) => <div className="product-extra-edit-row" key={index}>
                                    <input aria-label={`Nome do adicional ${index + 1}`} value={adicional.nome} onChange={(event) => setAdicionais((anteriores) => anteriores.map((item, itemIndex) => itemIndex === index ? { ...item, nome: event.target.value } : item))} placeholder="Ex.: bacon extra" />
                                    <div className="product-extra-price"><span>R$</span><input aria-label={`Preço do adicional ${index + 1}`} type="number" min="0" step="0.01" value={adicional.preco} onChange={(event) => setAdicionais((anteriores) => anteriores.map((item, itemIndex) => itemIndex === index ? { ...item, preco: event.target.value } : item))} placeholder="0,00" required={Boolean(adicional.nome.trim())} /></div>
                                    {adicionais.length > 1 && <button type="button" aria-label={`Remover adicional ${index + 1}`} onClick={() => setAdicionais((anteriores) => anteriores.filter((_, itemIndex) => itemIndex !== index))}>×</button>}
                                </div>)}
                            </div>
                        </div>

                    </div>

                    <div className="produto-actions mt-10 sm:mt-14 space-y-4">

                        <input
                            type="submit"
                            value={enviando ? 'CADASTRANDO...' : 'CADASTRAR PRODUTO'}
                            disabled={enviando}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                        />

                        <button
                            type="button"
                            onClick={() => navigate('/lista/produto')}
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

export default FormProduto;