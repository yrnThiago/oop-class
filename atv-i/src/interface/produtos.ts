import Empresa from "../modelo/empresa";
import Entrada from "../io/entrada";
import CadastroProduto from "../negocio/cadastroProduto";
import Produto from "../modelo/produto";
import CadastroCliente from "../negocio/cadastroCliente";
import Cliente from "../modelo/cliente";

export default function produtosInterface(produtos: Array<Produto>, clientes: Array<Cliente>) {
    let entrada = new Entrada()
    let produtosInterface = true;

    while (produtosInterface){
        let cadastroProdutos = new CadastroProduto(produtos)
        let cadastroClientes = new CadastroCliente(clientes)

        console.log(`Opções:`);
        console.log(`1 - Cadastrar produto`);
        console.log(`2 - Listar produtos`);
        console.log(`3 - Atualizar produto`);
        console.log(`4 - Vender produto`);
        console.log(`5 - Lista Mais Vendidos`);
        console.log(`6 - Lista Mais Vendidos Por Tipo e Raça`);
        console.log(`0 - Sair`);

        let produtoOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)
        let produtoId = null;
            switch(produtoOpcao){
                case 1:
                    cadastroProdutos.cadastraProduto()
                    break;
                case 2:
                    cadastroProdutos.pegaTodosProdutos()
                    break;
                case 3:
                    produtoId = entrada.receberNumero(`Por favor, digite o ID do produto: `)
                    alterarProdutoInterface(cadastroProdutos, produtoId, entrada)
                    break;
                case 4:
                    produtoId = entrada.receberNumero(`Por favor, digite o ID do produto: `)
                    let qtdVendida = entrada.receberNumero(`Por favor, digite a quantidade vendida: `)
                    let produtoConsumido = cadastroProdutos.produtoConsumido(produtoId, qtdVendida)

                    let clienteId = entrada.receberNumero(`Por favor, digite o ID do cliente: `)
                    cadastroClientes.consumiuProduto(clienteId, produtoConsumido)
                case 5:
                    cadastroProdutos.pegaProdutosMaisVendidos();
                    break;
                case 6:
                    cadastroProdutos.pegaProdutosMaisVendidosPorTipoRaca("Higiene", "Cães e Gatos");
                    break;
                case 0:
                    produtosInterface = false;
                break;
            }
    }
}

function alterarProdutoInterface(cadastroProdutos: CadastroProduto, produtoId: number, entrada: Entrada) {
    console.log(`Opções:`);
    console.log(`1 - Atualizar`);
    console.log(`2 - Excluir`);
    console.log(`0 - Sair`);

    let produtoOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

    switch(produtoOpcao){
        case 1:
            cadastroProdutos.atualizaProdutoPorId(produtoId)
            break;
        case 2:
            cadastroProdutos.excluiProdutoPorId(produtoId)
            break;
        case 0:
            break;
    }
}