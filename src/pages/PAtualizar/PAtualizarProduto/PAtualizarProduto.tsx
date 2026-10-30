import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProdutoRequests from '../../../fetch/ProdutoRequests';
import type { ProdutoDTO } from '../../../dto/ProdutoDTO';
import Navegacao from '../../../components/Navegacao/Navegacao';

function PAtualizarProduto() {
    const { id_produto } = useParams<{ id_produto: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nomeProduto: '', preco: '', disponibilidade: '', ingredientes: '', adicionais: '' });
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const produto = await ProdutoRequests.obterProdutoPorId(Number(id_produto)) as ProdutoDTO | undefined;
            if (!produto) setErro('Produto não encontrado.');
            else setFormData({
                nomeProduto: produto.nomeProduto ?? '',
                preco: String(produto.preco ?? ''),
                disponibilidade: produto.disponibilidade ?? '',
                ingredientes: Array.isArray(produto.ingredientes) ? produto.ingredientes.join(', ') : String(produto.ingredientes ?? ''),
                adicionais: Array.isArray(produto.adicionais) ? produto.adicionais.map((item) => `${item.nome}:${item.preco}`).join('; ') : ''
            });
            setCarregando(false);
        };
        void carregar();
    }, [id_produto]);

    const alterar = (event: ChangeEvent<HTMLInputElement>) => setFormData((anterior) => ({ ...anterior, [event.target.name]: event.target.value }));
    const salvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSalvando(true);
        setErro('');
        const adicionais = formData.adicionais.split(';').map((item) => {
            const separador = item.lastIndexOf(':');
            return separador < 0 ? null : { nome: item.slice(0, separador).trim(), preco: Number(item.slice(separador + 1).trim().replace(',', '.')) };
        }).filter((item): item is { nome: string; preco: number } => item !== null && Boolean(item.nome) && Number.isFinite(item.preco) && item.preco >= 0);
        const produto: ProdutoDTO = {
            idProduto: Number(id_produto),
            nomeProduto: formData.nomeProduto.trim(),
            preco: Number(formData.preco.replace(',', '.')),
            disponibilidade: formData.disponibilidade.trim(),
            ingredientes: formData.ingredientes.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean),
            adicionais
        };
        if (!produto.nomeProduto || !Number.isFinite(produto.preco) || produto.preco < 0 || !produto.disponibilidade) { setErro('Preencha todos os campos corretamente.'); setSalvando(false); return; }
        const idProduto = produto.idProduto;
        if (typeof idProduto !== 'number' || !Number.isInteger(idProduto) || idProduto <= 0) { setErro('Produto inválido.'); setSalvando(false); return; }
        const resposta = await ProdutoRequests.atualizarProduto(idProduto, produto);
        if (resposta.sucesso) navigate('/lista/produto');
        else setErro(resposta.mensagem ?? 'Não foi possível atualizar o produto.');
        setSalvando(false);
    };

    return <><Navegacao /><main className="produto-page"><div className="w-full max-w-4xl"><form onSubmit={salvar} className="produto-form"><h1>Atualizar <span>Produto</span></h1>{carregando ? <p className="text-white">Carregando...</p> : <><div className="produto-fields"><div><div><label htmlFor="nomeProduto">Nome do Produto</label><input id="nomeProduto" name="nomeProduto" value={formData.nomeProduto} onChange={alterar} required /></div><div><label htmlFor="preco">Preço</label><input id="preco" name="preco" type="number" min="0" step="0.01" value={formData.preco} onChange={alterar} required /></div></div><div><div><label htmlFor="disponibilidade">Disponibilidade</label><input id="disponibilidade" name="disponibilidade" value={formData.disponibilidade} onChange={alterar} required /></div></div><div className="product-customization-fields"><div><label htmlFor="ingredientes">Ingredientes incluídos</label><textarea id="ingredientes" value={formData.ingredientes} onChange={(event) => setFormData((anterior) => ({ ...anterior, ingredientes: event.target.value }))} placeholder="Pão, hambúrguer, queijo, alface..." rows={3} /><small>Separe os ingredientes por vírgula.</small></div><div><label htmlFor="adicionais">Adicionais e preços</label><textarea id="adicionais" value={formData.adicionais} onChange={(event) => setFormData((anterior) => ({ ...anterior, adicionais: event.target.value }))} placeholder="Bacon extra:3,00; Ovo:2,00" rows={3} /><small>Formato: nome:preço; nome:preço.</small></div></div></div>{erro && <p className="text-red-400 mt-4">{erro}</p>}<div className="produto-actions mt-8"><input type="submit" value={salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} disabled={salvando} /><button type="button" onClick={() => navigate('/lista/produto')}>CANCELAR</button></div></>}</form></div></main></>;
}

export default PAtualizarProduto;
