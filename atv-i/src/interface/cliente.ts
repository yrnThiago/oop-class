import CadastroCliente from "../negocio/cadastroCliente";
import Entrada from "../io/entrada";
import Cliente from "../modelo/cliente";
import petInterface from "./pet";
import CadastroProduto from '../negocio/cadastroProduto';

export default function clienteInterface(clientes: Array<Cliente>) {
    let entrada = new Entrada()
    let clienteInterface = true;
        while (clienteInterface){
            let cadastroClientes = new CadastroCliente(clientes)
        
            console.log(`Opções:`);
            console.log(`1 - Cadastrar cliente`);
            console.log(`2 - Listar clientes`);
            console.log(`3 - Atualizar cliente`);
            console.log(`4 - Lista 10 Cliente (Produtos)`);
            console.log(`5 - Lista 10 Cliente (Serviços)`);
            console.log(`6 - Lista 5 Cliente (Valor)`);
            console.log(`0 - Sair`);
            let clienteOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

            switch(clienteOpcao){
                case 1:
                    cadastroClientes.cadastraCliente()
                    break;
                case 2:
                    cadastroClientes.pegaTodosClientes()
                    break;
                case 3:
                    let clienteId = entrada.receberNumero(`Por favor, digite o ID do cliente: `)
                    alterarClienteInterface(cadastroClientes, clienteId, entrada)
                    break;
                case 4:
                    cadastroClientes.pegaClientesQueMaisCompraramProdutos();
                    break;
                case 5:
                    cadastroClientes.pegaClientesQueMaisCompraramServicos();
                    break;
                case 6:
                    cadastroClientes.pegaClientesQueMaisGastaram();
                    break;
                case 0:
                    clienteInterface = false;
                    break;
            }
        }
}

function alterarClienteInterface(cadastroClientes: CadastroCliente, clienteId: number, entrada: Entrada) {
    console.log(`Opções:`);
    console.log(`1 - Produto`);
    console.log(`2 - Serviço`);
    console.log(`3 - Pets`);
    console.log(`4 - Atualizar`);
    console.log(`5 - Excluir`);
    console.log(`0 - Sair`);

    let clienteOopcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

    switch(clienteOopcao){
        case 1:
            // consumir produto
            break;
        case 2:
            // Consumir serviço
            break;
        case 3:
            let clienteEscolhido = cadastroClientes.pegaClientePorId(clienteId);
            petInterface(clienteEscolhido, clienteEscolhido.getPets)
            break;
        case 4:
            cadastroClientes.atualizaClientePorId(clienteId)
            break;
        case 5:
            cadastroClientes.excluiClientePorId(clienteId)
            break;
        case 0:
            break;
    }
}