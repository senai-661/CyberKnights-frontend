import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemPedidos from "../../../components/Listagens/ListagemPedido/ListagemPedido";
import Rodape from "../../../components/Rodape/Rodape";

export default function PListagemPedido() {
  return (
    <div style={styles.page}>
      <Navegacao />

      <div style={styles.content}>
        <h1>Pedidos</h1>
        <ListagemPedidos />
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