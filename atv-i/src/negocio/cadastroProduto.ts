import Entrada from "../io/entrada";
import Produto from "../modelo/produto";

export default class CadastroProduto {
    private produtos: Produto[];
    private entrada: Entrada;

    constructor(produtos: Produto[]) {
        this.produtos = produtos;
        this.entrada = new Entrada();
    }

    public cadastraProduto(): void {
        console.log(`\nInício do cadastro do produto`);
        
        const nome = this.entrada.receberTexto(`Por favor informe o nome do produto: `);
        const valor = this.entrada.receberNumero(`Por favor informe o valor do produto: `);
        const tipo = this.entrada.receberTexto(`Por favor informe o tipo do produto: `);
        const raca = this.entrada.receberTexto(`Por favor informe a raça do produto: `);

        const produto = new Produto(nome, valor, 0, tipo, raca);
        this.produtos.push(produto);
        
        console.log(`\nCadastro de produto concluído :)\n`);
    }

    public pegaTodosProdutos(): void {
        console.log(`\nLista de todos os produtos:`);
        this.produtos.forEach((produto, index) => {
            console.log(`Id: ${index + 1}`);
            console.log(`Nome: ${produto.nome}`);
            console.log(`Valor: R$ ${produto.valor.toFixed(2)}`);
            console.log(`Quantidade Vendidas: ${produto.getQtdVendidas}`);
            console.log(`Tipo: ${produto.tipo}`);
            console.log(`Raça: ${produto.raca}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public pegaProdutoPorId(produtoId: number): Produto {
        return this.produtos[produtoId-1];
    }

    public pegaProdutosMaisVendidos(): void {
        console.log("\nLista de todos os produtos:");
        let produtosSorted = this.produtos.sort((n1,n2) => {
            if (n1.qtdVendidas > n2.qtdVendidas) {
                return -1;
            }
        
            if (n1.qtdVendidas < n2.qtdVendidas) {
                return 1;
            }
        
            return 0;
        });

        let cont = 1;
        for (let produto of produtosSorted) {
            console.log("Id:"  + cont)
            console.log("Nome:"  + produto.nome);
            console.log("Tipo:"  + produto.tipo);
            console.log("Raça:"  + produto.raca);
            console.log("Valor R$:"  + produto.valor);
            console.log("Qtd Vendidas:"  + produto.qtdVendidas);
            console.log("--------------------------------------");

            cont += 1;
        };
        console.log("\n");
    }

    public pegaProdutosMaisVendidosPorTipoRaca(tipo: string, raca: string): void {
        console.log("\nLista de todos os produtos:");
        let produtosSorted = this.produtos.sort((n1,n2) => {
            if (n1.qtdVendidas > n2.qtdVendidas) {
                return -1;
            }
        
            if (n1.qtdVendidas < n2.qtdVendidas) {
                return 1;
            }
        
            return 0;
        });

        let cont = 1;
        for (let produto of produtosSorted.filter(produto => produto.tipo === tipo && produto.raca === raca)) {
            console.log("Id:"  + cont)
            console.log("Nome:"  + produto.nome);
            console.log("Tipo:"  + produto.tipo);
            console.log("Raça:"  + produto.raca);
            console.log("Valor R$:"  + produto.valor);
            console.log("Qtd Vendidas:"  + produto.qtdVendidas);
            console.log("--------------------------------------");

            cont += 1;
        };
        console.log("\n");
    }

    public excluiProdutoPorId(produtoId: number): void {
        const produtoDeletado = this.produtos.splice(produtoId - 1, 1);
        if (produtoDeletado.length === 0) {
            console.log(`\nProduto não encontrado! Tente novamente...\n`);
        } else {
            console.log(`Produto Id: ${produtoId} deletado com sucesso!\n`);
        }
    }

    public atualizaProdutoPorId(produtoId: number): void {
        const atualProduto = this.produtos[produtoId - 1];
        const nome = this.entrada.receberTexto(`Nome atual (${atualProduto.nome}) -> `);
        const valor = this.entrada.receberNumero(`Valor atual (R$ ${atualProduto.valor.toFixed(2)}) -> `);
        const tipo = this.entrada.receberTexto(`Tipo atual (${atualProduto.tipo}) -> `);
        const raca = this.entrada.receberTexto(`Raça atual (${atualProduto.raca}) -> `);

        atualProduto.nome = nome || atualProduto.nome;
        atualProduto.valor = valor || atualProduto.valor;
        atualProduto.tipo = tipo || atualProduto.tipo;
        atualProduto.raca = raca || atualProduto.raca;
    }

    public produtoConsumido(produtoId: number, qtdVendida: number): Produto {
        let produtoConsumido = this.pegaProdutoPorId(produtoId)
        produtoConsumido.qtdVendidas += qtdVendida;
        
        return produtoConsumido;
    }
}
