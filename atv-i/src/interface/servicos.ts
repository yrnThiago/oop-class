import Empresa from "../modelo/empresa";
import Entrada from "../io/entrada";
import CadastroServico from "../negocio/cadastroServico";
import Servico from "../modelo/servico";
import CadastroCliente from "../negocio/cadastroCliente";
import Cliente from "../modelo/cliente";

export default function servicosInterface(servicos: Array<Servico>, clientes: Array<Cliente>) {
    let entrada = new Entrada()
    let servicosInterface = true;

    while (servicosInterface){
        let cadastroservicos = new CadastroServico(servicos)
        let cadastroClientes = new CadastroCliente(clientes)

        console.log(`Opções:`);
        console.log(`1 - Cadastrar serviço`);
        console.log(`2 - Listar serviços`);
        console.log(`3 - Atualizar serviço`);
        console.log(`4 - Vender Serviço`);
        console.log(`5 - Lista Mais Vendidos`);
        console.log(`6 - Lista Mais Vendidos Por Tipo e Raça`);
        console.log(`0 - Sair`);

        let ServicoOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)
        let servicoId = null;

            switch(ServicoOpcao){
                case 1:
                    cadastroservicos.cadastraServico()
                    break;
                case 2:
                    cadastroservicos.pegaTodosServicos()
                    break;
                case 3:
                    servicoId = entrada.receberNumero(`Por favor, digite o ID do serviço: `)
                    alterarServicoInterface(cadastroservicos, servicoId, entrada)
                    break;
                case 4:
                    servicoId = entrada.receberNumero(`Por favor, digite o ID do produto: `)
                    let qtdVendida = entrada.receberNumero(`Por favor, digite a quantidade vendida: `)
                    let produtoConsumido = cadastroservicos.servicoConsumido(servicoId, qtdVendida)

                    let clienteId = entrada.receberNumero(`Por favor, digite o ID do cliente: `)
                    cadastroClientes.consumiuProduto(clienteId, produtoConsumido)
                case 5:
                    cadastroservicos.pegaTodosServicos();
                    break;
                case 6:
                    cadastroservicos.pegaServicosMaisVendidosPorTipoRaca("Higiene", "Cães e Gatos");
                    break;
                case 0:
                    servicosInterface = false;
                    break;
            }
    }
}

function alterarServicoInterface(cadastroservicos: CadastroServico, ServicoId: number, entrada: Entrada) {
    console.log(`Opções:`);
    console.log(`1 - Atualizar`);
    console.log(`2 - Excluir`);
    console.log(`0 - Sair`);

    let ServicoOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

    switch(ServicoOpcao){
        case 1:
            cadastroservicos.atualizaServicoPorId(ServicoId)
            break;
        case 2:
            cadastroservicos.excluiServicoPorId(ServicoId)
            break;
        case 0:
            break;
    }
}