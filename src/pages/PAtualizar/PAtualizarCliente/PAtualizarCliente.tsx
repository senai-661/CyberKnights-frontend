import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClienteRequests from '../../../fetch/ClienteRequests';
import type { ClienteDTO } from '../../../dto/ClienteDTO';
import Navegacao from '../../../components/Navegacao/Navegacao';
import Utilitario from '../../../utils/Utilitario';

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
        const cliente: ClienteDTO = { idCliente: Number(id_cliente), nome: formData.nome.trim(), email: formData.email.trim(), endereco: formData.endereco.trim(), telefone: formData.telefone.replace(/\D/g, ''), cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : undefined };
        if (!cliente.nome || cliente.nome.length > 80 || !cliente.endereco || cliente.endereco.length > 100) { setErro('Nome e endereço são obrigatórios e devem respeitar os limites de tamanho.'); setSalvando(false); return; }
        if (!cliente.email.trim() || cliente.email.length > 120 || !Utilitario.validarEmail(cliente.email)) { setErro('Informe um e-mail válido com até 120 caracteres.'); setSalvando(false); return; }
        if (![10, 11].includes(cliente.telefone.length)) { setErro('O telefone deve ter 10 ou 11 dígitos.'); setSalvando(false); return; }
        if (cliente.cpf && cliente.cpf.length !== 11) { setErro('O CPF deve ter 11 dígitos.'); setSalvando(false); return; }
        if (cliente.idCliente === undefined) { setErro('Cliente inválido.'); setSalvando(false); return; }
        const resposta = await ClienteRequests.atualizarCliente(cliente.idCliente, cliente);
        if (resposta.sucesso) navigate('/lista/cliente', { state: { clienteAtualizado: cliente } });
        else setErro(resposta.mensagem ?? 'Não foi possível atualizar o cliente.');
        setSalvando(false);
    };

    return <><Navegacao /><main className="cliente-page"><div className="w-full max-w-4xl"><form onSubmit={salvar} className="cliente-form"><h1>Atualizar <span>Cliente</span></h1>{carregando ? <p className="text-white">Carregando...</p> : <><div className="cliente-fields">{[['nome', 'Nome'], ['email', 'E-mail'], ['endereco', 'Endereço'], ['telefone', 'Telefone'], ['cpf', 'CPF']].map(([name, label]) => <div key={name}><label htmlFor={name}>{label}{name !== 'cpf' && ' *'}</label><input id={name} name={name} type={name === 'email' ? 'email' : 'text'} value={formData[name as keyof typeof formData]} onChange={alterar} required={name !== 'cpf'} maxLength={name === 'nome' ? 80 : name === 'email' ? 120 : name === 'endereco' ? 100 : name === 'telefone' ? 16 : 11} /></div>)}</div>{erro && <p className="text-red-400 mt-4">{erro}</p>}<div className="cliente-actions mt-8"><input type="submit" value={salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} disabled={salvando} /><button type="button" onClick={() => navigate('/lista/cliente')}>CANCELAR</button></div></>}</form></div></main></>;
}

export default PAtualizarCliente;

//jdfhuiehriuywagerti4yegtruykfgaiwyukrfgkisukysgfysgdkfajd//