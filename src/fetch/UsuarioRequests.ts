class UsuarioRequests {
  private serverURL: string;
  private endpointUsuario: string;

  constructor() {
    this.serverURL = `http://localhost:3333`;
    this.endpointUsuario = `/api/usuarios`;
  }

  async listarUsuarios() {
    try {
      const token = localStorage.getItem('token');

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointUsuario}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': `${token}`,
          },
        }
      );

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      } else {
        throw new Error('Não foi possível listar os usuários.');
      }
    } catch (error) {
      console.error(`Erro ao buscar usuários. ${error}`);
      return;
    }
  }
}

export default new UsuarioRequests();