import Entrada from "../io/entrada";
import Cliente from "../modelo/cliente";
import CPF from "../modelo/cpf";
import Produto from "../modelo/produto";
import atualizaDado from "../utils/atualizaDados";

export default class CadastroCliente {
    private clientes: Cliente[];
    private entrada: Entrada;

    constructor(clientes: Cliente[]) {
        this.clientes = clientes;
        this.entrada = new Entrada();
    }

    public cadastraCliente(): void {
        console.log(`\nInício do cadastro do cliente`);
        
        const nome = this.entrada.receberTexto(`Por favor informe o nome do cliente: `);
        const nomeSocial = this.entrada.receberTexto(`Por favor informe o nome social do cliente: `);
        const valor = this.entrada.receberTexto(`Por favor informe o número do CPF: `);
        const data = this.entrada.receberTexto(`Por favor informe a data de emissão do CPF, no padrão dd/mm/yyyy: `);
        
        const [dia, mes, ano] = data.split('/').map(Number);
        const dataEmissao = new Date(ano, mes - 1, dia); // Meses são indexados de 0 a 11
        const cpf = new CPF(valor, dataEmissao);
        
        const cliente = new Cliente(nome, nomeSocial, cpf);
        this.clientes.push(cliente);
        
        console.log(`\nCadastro concluído :)\n`);
    }

    public pegaTodosClientes(): void {
        console.log(`\nLista de todos os clientes:`);
        this.clientes.forEach((cliente, index) => {
            console.log(`Id: ${index + 1}`);
            console.log(`Nome: ${cliente.nome}`);
            console.log(`Nome social: ${cliente.nomeSocial}`);
            console.log(`CPF: ${cliente.getCpf.getValor}`);
            console.log(`Valor Total Gasto R$: ${cliente.getValorTotalGasto}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public pegaClientesQueMaisCompraramProdutos(): void {
        this.exibeClientesOrdenados((n1, n2) => n2.getProdutosConsumidos.length - n1.getProdutosConsumidos.length, 10);
    }

    public pegaClientesQueMaisCompraramServicos(): void {
        this.exibeClientesOrdenados((n1, n2) => n2.getServicosConsumidos.length - n1.getServicosConsumidos.length, 10);
    }

    public pegaClientesQueMaisGastaram(): void {
        this.exibeClientesOrdenados((n1, n2) => n2.getValorTotalGasto - n1.getValorTotalGasto, 5);
    }

    private exibeClientesOrdenados(comparador: (n1: Cliente, n2: Cliente) => number, limite: number): void {
        console.log(`\nLista de clientes ordenados:`);
        const clientesOrdenados = [...this.clientes].sort(comparador);
        clientesOrdenados.slice(0, limite).forEach((cliente, index) => {
            console.log(`Id: ${index + 1}`);
            console.log(`Nome: ${cliente.nome}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public pegaClientePorId(clienteId: number): Cliente {
        return this.clientes[clienteId - 1];
    }

    public atualizaClientePorId(clienteId: number): void {
        const atualCliente = this.pegaClientePorId(clienteId);
        const nome = this.entrada.receberTexto(`Nome atual (${atualCliente.nome}) -> `);
        const nomeSocial = this.entrada.receberTexto(`Nome social atual (${atualCliente.nomeSocial}) -> `);

        atualCliente.nome = atualizaDado(atualCliente.nome, nome);
        atualCliente.nomeSocial = atualizaDado(atualCliente.nomeSocial, nomeSocial);
    }

    public excluiClientePorId(clienteId: number): void {
        const clienteDeletado = this.clientes.splice(clienteId - 1, 1);
        if (clienteDeletado.length === 0) {
            console.log(`\nCliente não encontrado! Tente novamente...\n`);
        } else {
            console.log(`Cliente Id: ${clienteId} deletado com sucesso!\n`);
        }
    }

    public consumiuProduto(clienteId: number, produtoConsumido: Produto): void {
        const cliente = this.pegaClientePorId(clienteId);
        cliente.addProdutoConsumido(produtoConsumido);
    }
}
