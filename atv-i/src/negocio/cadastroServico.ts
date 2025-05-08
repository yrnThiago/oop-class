import Entrada from "../io/entrada";
import Servico from "../modelo/servico";

export default class CadastroServico {
    private servicos: Servico[];
    private entrada: Entrada;

    constructor(servicos: Servico[]) {
        this.servicos = servicos;
        this.entrada = new Entrada();
    }

    public cadastraServico(): void {
        console.log(`\nInício do cadastro do serviço`);
        
        const nome = this.entrada.receberTexto(`Por favor informe o nome do serviço: `);
        const valor = this.entrada.receberNumero(`Por favor informe o valor do serviço: `);
        const tipo = this.entrada.receberTexto(`Por favor informe o tipo do serviço: `);
        const raca = this.entrada.receberTexto(`Por favor informe a raça do serviço: `);

        const servico = new Servico(nome, valor, 0, tipo, raca);
        this.servicos.push(servico);
        
        console.log(`\nCadastro de serviço concluído :)\n`);
    }

    public pegaTodosServicos(): void {
        console.log(`\nLista de todos os serviços:`);
        this.servicos.forEach((servico, index) => {
            console.log(`Id: ${index + 1}`);
            console.log(`Nome: ${servico.nome}`);
            console.log(`Valor: R$ ${servico.valor.toFixed(2)}`);
            console.log(`Quantidade Vendidas: ${servico.getQtdVendidas}`);
            console.log(`Tipo: ${servico.tipo}`);
            console.log(`Raça: ${servico.raca}`);
            console.log(`--------------------------------------`);
        });
        console.log(`\n`);
    }

    public pegaServicoPorId(servicoId: number): Servico {
        return this.servicos[servicoId-1];
    }

    public pegaServicosMaisVendidos(): void {
        console.log("\nLista de todos os serviços:");
        let servicosSorted = this.servicos.sort((n1,n2) => {
            if (n1.qtdVendidas > n2.qtdVendidas) {
                return -1;
            }
        
            if (n1.qtdVendidas < n2.qtdVendidas) {
                return 1;
            }
        
            return 0;
        });

        let cont = 1;
        for (let servico of servicosSorted) {
            console.log(`Id: ${cont + 1}`);
            console.log(`Nome: ${servico.nome}`);
            console.log(`Valor: R$ ${servico.valor.toFixed(2)}`);
            console.log(`Quantidade Vendidas: ${servico.getQtdVendidas}`);
            console.log(`Tipo: ${servico.tipo}`);
            console.log(`Raça: ${servico.raca}`);
            console.log(`--------------------------------------`);

            cont += 1;
        };
        console.log("\n");
    }

    public pegaServicosMaisVendidosPorTipoRaca(tipo: string, raca: string): void {
        console.log("\nLista de todos os serviços:");
        let servicosSorted = this.servicos.sort((n1,n2) => {
            if (n1.qtdVendidas > n2.qtdVendidas) {
                return -1;
            }
        
            if (n1.qtdVendidas < n2.qtdVendidas) {
                return 1;
            }
        
            return 0;
        });

        let cont = 1;
        for (let servico of servicosSorted.filter(servico => servico.tipo === tipo && servico.raca === raca)) {
            console.log(`Id: ${cont + 1}`);
            console.log(`Nome: ${servico.nome}`);
            console.log(`Valor: R$ ${servico.valor.toFixed(2)}`);
            console.log(`Quantidade Vendidas: ${servico.getQtdVendidas}`);
            console.log(`Tipo: ${servico.tipo}`);
            console.log(`Raça: ${servico.raca}`);
            console.log(`--------------------------------------`);

            cont += 1;
        };
        console.log("\n");
    }

    public excluiServicoPorId(servicoId: number): void {
        const servicoDeletado = this.servicos.splice(servicoId - 1, 1);
        if (servicoDeletado.length === 0) {
            console.log(`\nServiço não encontrado! Tente novamente...\n`);
        } else {
            console.log(`Serviço Id: ${servicoId} deletado com sucesso!\n`);
        }
    }

    public atualizaServicoPorId(servicoId: number): void {
        const atualServico = this.servicos[servicoId - 1];
        const nome = this.entrada.receberTexto(`Nome atual (${atualServico.nome}) -> `);
        const valor = this.entrada.receberNumero(`Valor atual (R$ ${atualServico.valor.toFixed(2)}) -> `);
        const tipo = this.entrada.receberTexto(`Tipo atual (${atualServico.tipo}) -> `);
        const raca = this.entrada.receberTexto(`Raça atual (${atualServico.raca}) -> `);

        atualServico.nome = nome || atualServico.nome;
        atualServico.valor = valor || atualServico.valor;
        atualServico.tipo = tipo || atualServico.tipo;
        atualServico.raca = raca || atualServico.raca;
    }

    public servicoConsumido(servicoId: number, qtdVendida: number): Servico {
        let servicoConsumido = this.pegaServicoPorId(servicoId)
        servicoConsumido.qtdVendidas += qtdVendida;
        
        return servicoConsumido;
    }
}
