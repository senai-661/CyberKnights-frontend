import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClienteRequests from '../../../fetch/ClienteRequests';
import type { ClienteDTO } from '../../../dto/ClienteDTO';
import Navegacao from '../../../components/Navegacao/Navegacao';

function PAtualizarCliente() {
    const { id_cliente } = useParams<{ id_cliente: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nome: '', email: '', endereco: '', telefone: '', cpf: '' });
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const cliente = await ClienteRequests.obterClientePorId(Number(id_cliente)) as ClienteDTO | undefined;
            if (!cliente) setErro('Cliente não encontrado.');
            else setFormData({ nome: cliente.nome ?? '', email: cliente.email ?? '', endereco: cliente.endereco ?? '', telefone: String(cliente.telefone ?? ''), cpf: String(cliente.cpf ?? '') });
            setCarregando(false);
        };
        void carregar();
    }, [id_cliente]);

    const alterar = (event: ChangeEvent<HTMLInputElement>) => setFormData((anterior) => ({ ...anterior, [event.target.name]: event.target.value }));

    const salvar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSalvando(true);
        setErro('');
        const cliente: ClienteDTO = { idCliente: Number(id_cliente), nome: formData.nome.trim(), email: formData.email.trim(), endereco: formData.endereco.trim(), telefone: Number(formData.telefone.replace(/\D/g, '')), cpf: formData.cpf ? Number(formData.cpf.replace(/\D/g, '')) : undefined };
        if (!cliente.nome || !cliente.email || !cliente.endereco || !cliente.telefone) { setErro('Preencha todos os campos obrigatórios.'); setSalvando(false); return; }
        const resposta = await ClienteRequests.atualizarCliente(cliente.idCliente, cliente);
        if (resposta.sucesso) navigate('/lista/cliente');
        else setErro(resposta.mensagem ?? 'Não foi possível atualizar o cliente.');
        setSalvando(false);
    };

    return <><Navegacao /><main className="cliente-page"><div className="w-full max-w-4xl"><form onSubmit={salvar} className="cliente-form"><h1>Atualizar <span>Cliente</span></h1>{carregando ? <p className="text-white">Carregando...</p> : <><div className="cliente-fields">{[['nome', 'Nome'], ['email', 'E-mail'], ['endereco', 'Endereço'], ['telefone', 'Telefone'], ['cpf', 'CPF']].map(([name, label]) => <div key={name}><label htmlFor={name}>{label}{name !== 'cpf' && ' *'}</label><input id={name} name={name} type={name === 'email' ? 'email' : 'text'} value={formData[name as keyof typeof formData]} onChange={alterar} required={name !== 'cpf'} /></div>)}</div>{erro && <p className="text-red-400 mt-4">{erro}</p>}<div className="cliente-actions mt-8"><input type="submit" value={salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} disabled={salvando} /><button type="button" onClick={() => navigate('/lista/cliente')}>CANCELAR</button></div></>}</form></div></main></>;
}

export default PAtualizarCliente;
