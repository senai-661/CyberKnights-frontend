import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemClientes from "../../../components/Listagens/ListagemClientes/ListagemCliente";
import Rodape from "../../../components/Rodape/Rodape";

export default function PListagemCliente() {
  return (
    <div style={styles.page}>
      <Navegacao />

      <div style={styles.content}>
        <h1>Clientes</h1>
        <ListagemClientes />
      </div>

      <Rodape />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000"
  },

  content: {
    padding: "20px"
  }
};