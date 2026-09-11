import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteRequests from '../../../fetch/ClienteRequests';
import Utilitario from '../../../utils/Utilitario';

function FormCliente() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        endereco: '',
        telefone: '',
        cpf: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'telefone') {
            const telefoneFormatado = Utilitario.formatarTelefone(value);

            setFormData((prev: any) => ({
                ...prev,
                [name]: telefoneFormatado
            }));

            return;
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!Utilitario.validarEmail(formData.email)) {
            alert('E-mail inválido');
            return;
        }

        const dadosCliente = {
            ...formData,
            telefone: Number(formData.telefone.replace(/\D/g, '')),
            cpf: formData.cpf ? Number(formData.cpf) : undefined
        };

        const resposta = await ClienteRequests.enviarFormularioCliente(dadosCliente);

        if (resposta) {
            alert('Cliente cadastrado com sucesso');
            navigate('/lista/cliente');
        } else {
            alert('Erro ao cadastrar cliente');
        }
    };

    return (
        <main className="cliente-page min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 py-12 md:px-8">

            <div className="w-full max-w-6xl">

                <form
                    onSubmit={handleSubmit}
                    className="cliente-form
                        bg-[#1F2937]
                        rounded-2xl
                        p-7
                        md:p-12
                        shadow-2xl
                        border-2
                        border-orange-500
                    "
                >

                    <h1
                        className="
                            text-4xl
                            md:text-6xl
                            font-extrabold
                            text-left
                            text-white
                            mb-8
                            pb-5
                            border-b-2
                            border-orange-500
                        "
                    >
                        <i className="pi pi-user mr-4 text-orange-500"></i>
                        Cadastro de <span className="text-orange-500">Cliente</span>
                    </h1>

                    <div className="cliente-fields grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Nome */}
                        <div>
                            <label
                                htmlFor="nome"
                                className="block text-white text-lg font-bold mb-2"
                            >
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
                                className="
                                    w-full
                                    px-4
                                    py-4
                                    text-lg
                                    bg-[#111827]
                                    border-2
                                    border-gray-700
                                    text-white
                                    rounded-xl
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:border-orange-500
                                    focus:ring-2
                                    focus:ring-orange-400
                                "
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label
                                htmlFor="telefone"
                                className="block text-white text-lg font-bold mb-2"
                            >
                                Telefone
                            </label>

                            <input
                                type="tel"
                                name="telefone"
                                id="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder="(99) 99999-9999"
                                className="
                                    w-full
                                    px-4
                                    py-4
                                    text-lg
                                    bg-[#111827]
                                    border-2
                                    border-gray-700
                                    text-white
                                    rounded-xl
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:border-orange-500
                                    focus:ring-2
                                    focus:ring-orange-400
                                "
                            />
                        </div>

                        {/* Endereço */}
                        <div>
                            <label
                                htmlFor="endereco"
                                className="block text-white text-lg font-bold mb-2"
                            >
                                Endereço
                            </label>

                            <input
                                type="text"
                                name="endereco"
                                id="endereco"
                                minLength={6}
                                onChange={handleChange}
                                placeholder="Rua, número, bairro..."
                                className="
                                    w-full
                                    px-4
                                    py-4
                                    text-lg
                                    bg-[#111827]
                                    border-2
                                    border-gray-700
                                    text-white
                                    rounded-xl
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:border-orange-500
                                    focus:ring-2
                                    focus:ring-orange-400
                                "
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-white text-lg font-bold mb-2"
                            >
                                E-mail
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleChange}
                                placeholder="exemplo@email.com"
                                className="
                                    w-full
                                    px-4
                                    py-4
                                    text-lg
                                    bg-[#111827]
                                    border-2
                                    border-gray-700
                                    text-white
                                    rounded-xl
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:border-orange-500
                                    focus:ring-2
                                    focus:ring-orange-400
                                "
                            />
                        </div>

                    </div>

                    {/* CPF */}
                    <div className="cliente-cpf mt-6">
                        <label
                            htmlFor="cpf"
                            className="block text-white text-lg font-bold mb-2"
                        >
                            CPF
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            name="cpf"
                            id="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            className="
                                w-full
                                px-4
                                py-4
                                text-lg
                                bg-[#111827]
                                border-2
                                border-gray-700
                                text-white
                                rounded-xl
                                placeholder:text-gray-500
                                focus:outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-400
                            "
                        />
                    </div>

                    {/* Botões */}
                    <div className="cliente-actions mt-10 flex flex-col sm:flex-row gap-4">

                        <input
                            type="submit"
                            value="CADASTRAR CLIENTE"
                            className="
                                w-full
                                bg-orange-500
                                hover:bg-orange-600
                                text-white
                                py-4
                                px-6
                                rounded-xl
                                font-bold
                                text-lg
                                cursor-pointer
                                transition-all
                                shadow-lg
                            "
                        />

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/lista/cliente')
                            }
                            className="
                                w-full
                                border-2
                                border-orange-500
                                text-orange-500
                                py-4
                                px-6
                                rounded-xl
                                font-bold
                                text-lg
                                transition-all
                                hover:bg-orange-500
                                hover:text-white
                            "
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