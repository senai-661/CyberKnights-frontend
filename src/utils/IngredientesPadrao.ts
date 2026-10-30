function normalizarNome(nome: string): string {
    return nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

const RECEITAS_PADRAO: Array<{ termos: string[]; ingredientes: string[] }> = [
    {
        termos: ['hot dog', 'hotdog'],
        ingredientes: ['Pão de hot dog', 'Salsicha', 'Molho de tomate', 'Maionese', 'Ketchup', 'Mostarda', 'Batata palha', 'Milho', 'Vinagrete']
    },
    {
        termos: ['x bacon', 'xbacon'],
        ingredientes: ['Pão de hambúrguer', 'Hambúrguer tradicional', 'Queijo derretido', 'Bacon crocante', 'Maionese']
    },
    {
        termos: ['x frango', 'xfrango'],
        ingredientes: ['Pão de hambúrguer', 'Filé de frango grelhado ou frango desfiado', 'Queijo derretido', 'Alface', 'Tomate', 'Maionese']
    },
    {
        termos: ['x tudo tradicional', 'x tudo', 'xtudo'],
        ingredientes: ['Pão de hambúrguer', 'Hambúrguer tradicional', 'Queijo', 'Bacon', 'Ovo frito', 'Presunto', 'Alface', 'Tomate', 'Milho', 'Maionese']
    },
    {
        termos: ['x hamburguer tradicional', 'x hamburguer', 'hamburguer simples'],
        ingredientes: ['Pão de hambúrguer', 'Hambúrguer tradicional', 'Queijo derretido', 'Maionese']
    },
    {
        termos: ['x salada', 'xsalada'],
        ingredientes: ['Pão de hambúrguer', 'Hambúrguer tradicional', 'Queijo derretido', 'Alface', 'Tomate', 'Maionese']
    }
];

export function obterIngredientesPadrao(nomeProduto: string): string[] {
    const nomeNormalizado = normalizarNome(nomeProduto);
    const receita = RECEITAS_PADRAO.find(({ termos }) =>
        termos.some((termo) => nomeNormalizado === normalizarNome(termo) || nomeNormalizado.includes(normalizarNome(termo)))
    );
    return receita ? [...receita.ingredientes] : [];
}
