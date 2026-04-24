import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemProdutos from "../../../components/Listagens/ListagemProduto/ListagemProduto";
import Rodape from "../../../components/Rodape/Rodape";

export default function PListagemProduto() {
  return (
    <div style={styles.page}>
      <Navegacao />

      <div style={styles.content}>
        <h1>Produtos</h1>
        <ListagemProdutos />
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