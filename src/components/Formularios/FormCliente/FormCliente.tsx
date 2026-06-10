import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteRequests from '../../../fetch/ClienteRequests';
import Utilitario from '../../../utils/Utilitario';
import type { ClienteDTO } from '../../../dto/ClienteDTO';

function FormCliente() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<any>({
        email: '',
        nome: '',
        endereco: '',
        telefone: '',
        cpf: '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: ClienteDTO) => ({
        ...prev,
        [name]: name === 'telefone' || name === 'cpf'
            ? Number(value)
            : value
    }));
};
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!Utilitario.validarEmail(formData.email)) {
            alert("E-mail inválido");
            return;
        }

        const resposta = await ClienteRequests.enviarFormularioCliente(formData);

        if (resposta) {
            alert("Cliente cadastrado com sucesso");
        } else {
            alert("Erro ao cadastrar cliente");
        }
    };

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-slate-800 mb-8 sm:mb-12">
                        Cadastro de Cliente
                    </h1>

                    <div className="space-y-6 sm:space-y-8">

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    required
                                    minLength={3}
                                    onChange={handleChange}
                                    placeholder="Digite o nome"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex-1">
                                <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    name="telefone"
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    placeholder="(xx) x xxxx-xxxx"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="endereco" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    name="endereco"
                                    id="endereco"
                                    minLength={6}
                                    onChange={handleChange}
                                    placeholder="Rua, número, bairro..."
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex-1">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    placeholder="exemplo@email.com"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="cpf" className="block text-sm font-semibold text-slate-700 mb-2">
                                CPF
                            </label>
                            <input
                                type="number"
                                name="cpf"
                                id="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                    </div>

                    <div className="mt-10 sm:mt-14 space-y-4">

                        <input
                            type="submit"
                            value="CADASTRAR CLIENTE"
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                        />

                        <button
                            type="button"
                            onClick={() => navigate('/lista/clientes')}
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

export default FormCliente;