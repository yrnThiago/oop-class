import clienteInterface from "../interface/cliente";
import produtosInterface from "../interface/produtos";
import servicosInterface from "../interface/servicos";
import Entrada from "../io/entrada";
import Empresa from "../modelo/empresa";

console.log(`Bem-vindo ao melhor sistema de gerenciamento de pet shops e clínicas veterinarias`)
let empresa = new Empresa()
let execucao = true

while (execucao) {
    console.log(`Opções:`);
    console.log(`1 - Clientes`);
    console.log(`2 - Produtos`);
    console.log(`3 - Serviços`);
    console.log(`0 - Sair`);


    let entrada = new Entrada()
    let opcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

    switch (opcao) {
        case 1:
            clienteInterface(empresa.getClientes)
            break;
        case 2:
            produtosInterface(empresa.getProdutos, empresa.getClientes)
            break;
        case 3:
            servicosInterface(empresa.getServicos, empresa.getClientes)
            break;
        case 0:
            execucao = false
            console.log(`Até mais`)
            break;
        default:
            console.log(`Operação não entendida :(`)
    }
}