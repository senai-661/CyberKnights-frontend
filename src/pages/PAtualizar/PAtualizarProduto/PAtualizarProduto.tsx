import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProdutoRequests from '../../../fetch/ProdutoRequests';
import type { ProdutoDTO } from '../../../dto/ProdutoDTO';
import Navegacao from '../../../components/Navegacao/Navegacao';

function PAtualizarProduto() {
    const { id_produto } = useParams<{ id_produto: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nomeProduto: '', preco: '', disponibilidade: '' });
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const produto = await ProdutoRequests.obterProdutoPorId(Number(id_produto)) as ProdutoDTO | undefined;
            if (!produto) setErro('Produto não encontrado.');
            else setFormData({ nomeProduto: produto.nomeProduto ?? '', preco: String(produto.preco ?? ''), disponibilidade: produto.disponibilidade ?? '' });
            setCarregando(false);
        };
        void carregar();
    }, [id_produto]);

    const alterar = (event: ChangeEvent<HTMLInputElement>) => setFormData((anterior) => ({ ...anterior, [event.target.name]: event.target.value }));
    const salvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSalvando(true);
        setErro('');
        const produto: ProdutoDTO = { idProduto: Number(id_produto), nomeProduto: formData.nomeProduto.trim(), preco: Number(formData.preco.replace(',', '.')), disponibilidade: formData.disponibilidade.trim() };
        if (!produto.nomeProduto || produto.nomeProduto.length > 80 || !Number.isFinite(produto.preco) || produto.preco < 0 || produto.preco > 99999999.99 || Math.abs(produto.preco - Math.round(produto.preco * 100) / 100) > 1e-8 || !['Disponível', 'Indisponível'].includes(produto.disponibilidade)) { setErro('Informe nome, preço e disponibilidade válidos, respeitando os limites permitidos.'); setSalvando(false); return; }
        const idProduto = produto.idProduto;
        if (typeof idProduto !== 'number' || !Number.isInteger(idProduto) || idProduto <= 0) { setErro('Produto inválido.'); setSalvando(false); return; }
        const resposta = await ProdutoRequests.atualizarProduto(idProduto, produto);
        if (resposta.sucesso) navigate('/lista/produto');
        else setErro(resposta.mensagem ?? 'Não foi possível atualizar o produto.');
        setSalvando(false);
    };

    return <><Navegacao /><main className="produto-page"><div className="w-full max-w-4xl"><form onSubmit={salvar} className="produto-form"><h1>Atualizar <span>Produto</span></h1>{carregando ? <p className="text-white">Carregando...</p> : <><div className="produto-fields"><div><div><label htmlFor="nomeProduto">Nome do Produto</label><input id="nomeProduto" name="nomeProduto" value={formData.nomeProduto} onChange={alterar} required maxLength={80} /></div><div><label htmlFor="preco">Preço</label><input id="preco" name="preco" type="number" min="0" max="99999999.99" step="0.01" value={formData.preco} onChange={alterar} required /></div></div><div><div><label htmlFor="disponibilidade">Disponibilidade</label><select id="disponibilidade" name="disponibilidade" value={formData.disponibilidade} onChange={(event) => setFormData((previous) => ({ ...previous, disponibilidade: event.target.value }))} required><option value="" disabled>Selecione uma opção</option><option value="Disponível">Disponível</option><option value="Indisponível">Indisponível</option></select></div></div></div>{erro && <p className="text-red-400 mt-4">{erro}</p>}<div className="produto-actions mt-8"><input type="submit" value={salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} disabled={salvando} /><button type="button" onClick={() => navigate('/lista/produto')}>CANCELAR</button></div></>}</form></div></main></>;
}

export default PAtualizarProduto;
