import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PedidoRequests from '../../../fetch/PedidoRequests';
import type { PedidoDTO } from '../../../dto/PedidoDTO';
import Navegacao from '../../../components/Navegacao/Navegacao';

function dataInput(data: Date | string | undefined) {
    if (!data) return '';
    const dataConvertida = new Date(data);
    return Number.isNaN(dataConvertida.getTime()) ? '' : dataConvertida.toISOString().slice(0, 10);
}

function PAtualizarPedido() {
    const { id_pedido } = useParams<{ id_pedido: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ idCliente: '', idProduto: '', quantidade: '1', dataPedido: '', valorTotal: '', statusPedido: '' });
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const pedido = await PedidoRequests.obterPedidoPorId(Number(id_pedido)) as PedidoDTO | undefined;
            if (!pedido) setErro('Pedido não encontrado.');
            else setFormData({ idCliente: String(pedido.idCliente ?? ''), idProduto: String(pedido.idProduto ?? ''), quantidade: String(pedido.quantidade ?? 1), dataPedido: dataInput(pedido.dataPedido), valorTotal: String(pedido.valorTotal ?? ''), statusPedido: pedido.statusPedido ?? '' });
            setCarregando(false);
        };
        void carregar();
    }, [id_pedido]);

    const alterar = (event: ChangeEvent<HTMLInputElement>) => setFormData((anterior) => ({ ...anterior, [event.target.name]: event.target.value }));
    const salvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSalvando(true);
        setErro('');
        const pedido: PedidoDTO = { idPedido: Number(id_pedido), idCliente: Number(formData.idCliente), idProduto: Number(formData.idProduto), quantidade: Number(formData.quantidade), dataPedido: new Date(`${formData.dataPedido}T00:00:00`), valorTotal: Number(formData.valorTotal.replace(',', '.')), statusPedido: formData.statusPedido.trim() };
        if (!Number.isInteger(pedido.idCliente) || pedido.idCliente <= 0 || !Number.isInteger(pedido.idProduto) || pedido.idProduto <= 0 || !Number.isInteger(pedido.quantidade) || pedido.quantidade <= 0 || pedido.quantidade > 2147483647 || Number.isNaN(pedido.dataPedido.getTime()) || !Number.isFinite(pedido.valorTotal) || pedido.valorTotal < 15 || pedido.valorTotal > 99999999.99 || Math.abs(pedido.valorTotal - Math.round(pedido.valorTotal * 100) / 100) > 1e-8 || !pedido.statusPedido || pedido.statusPedido.length > 30) { setErro('Preencha todos os campos corretamente e respeite os limites permitidos.'); setSalvando(false); return; }
        const idPedido = pedido.idPedido;
        if (typeof idPedido !== 'number' || !Number.isInteger(idPedido) || idPedido <= 0) { setErro('Pedido inválido.'); setSalvando(false); return; }
        const resposta = await PedidoRequests.atualizarPedido(idPedido, pedido);
        if (resposta.sucesso) navigate('/lista/pedido');
        else setErro(resposta.mensagem ?? 'Não foi possível atualizar o pedido.');
        setSalvando(false);
    };

    return <><Navegacao /><main className="pedido-page"><div className="w-full max-w-4xl"><form onSubmit={salvar} className="pedido-form"><h1>Atualizar <span>Pedido</span></h1>{carregando ? <p className="text-white">Carregando...</p> : <><div className="pedido-fields"><div><div><label htmlFor="idCliente">ID do Cliente</label><input id="idCliente" name="idCliente" type="number" min="1" max="2147483647" step="1" value={formData.idCliente} onChange={alterar} required /></div><div><label htmlFor="idProduto">ID do Produto</label><input id="idProduto" name="idProduto" type="number" min="1" max="2147483647" step="1" value={formData.idProduto} onChange={alterar} required /></div></div><div><div><label htmlFor="dataPedido">Data do Pedido</label><input id="dataPedido" name="dataPedido" type="date" value={formData.dataPedido} onChange={alterar} required /></div></div><div><div><label htmlFor="quantidade">Quantidade</label><input id="quantidade" name="quantidade" type="number" min="1" max="2147483647" step="1" value={formData.quantidade} onChange={alterar} required /></div></div><div><div><label htmlFor="valorTotal">Valor Total</label><input id="valorTotal" name="valorTotal" type="number" min="15" max="99999999.99" step="0.01" value={formData.valorTotal} onChange={alterar} required /></div></div><div><div><label htmlFor="statusPedido">Status do Pedido</label><input id="statusPedido" name="statusPedido" maxLength={30} value={formData.statusPedido} onChange={alterar} required /></div></div></div>{erro && <p className="text-red-400 mt-4">{erro}</p>}<div className="pedido-actions mt-8"><input type="submit" value={salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} disabled={salvando} /><button type="button" onClick={() => navigate('/lista/pedido')}>CANCELAR</button></div></>}</form></div></main></>;
}

export default PAtualizarPedido;
