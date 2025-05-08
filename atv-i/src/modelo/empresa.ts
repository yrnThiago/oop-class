import Cliente from "./cliente";
import Produto from "./produto";
import Servico from "./servico";
import Pet from "./pet";
import CPF from "./cpf";

export default class Empresa {
    private clientes: Array<Cliente>;
    private produtos: Array<Produto>;
    private servicos: Array<Servico>;

    constructor() {
        this.clientes = [];
        this.produtos = [];
        this.servicos = [];
        this.inicializaDados();
    }

    public get getClientes() {
        return this.clientes;
    }

    public get getProdutos() {
        return this.produtos;
    }

    public get getServicos() {
        return this.servicos;
    }

    private inicializaDados(): void {
        this.criaClientes();
        this.criaProdutos();
        this.criaServicos();
    }

    private criaClientes(): void {
        const cliente1 = new Cliente("João Silva", "joao.silva@email.com", new CPF("123.456.789-00", new Date("2022-01-01")));
    cliente1.adicionaPet(new Pet("Rex", "Labrador", "Macho", "Cachorro"));
    this.clientes.push(cliente1);
    
    const cliente2 = new Cliente("Maria Oliveira", "maria.oliveira@email.com", new CPF("987.654.321-00", new Date("2022-02-01")));
    cliente2.adicionaPet(new Pet("Mia", "Siamês", "Fêmea", "Gato"));
    this.clientes.push(cliente2);
    
    const cliente3 = new Cliente("Carlos Pereira", "carlos.pereira@email.com", new CPF("456.789.123-00", new Date("2022-03-01")));
    cliente3.adicionaPet(new Pet("Bingo", "Bulldog", "Macho", "Cachorro"));
    this.clientes.push(cliente3);
    
    const cliente4 = new Cliente("Ana Santos", "ana.santos@email.com", new CPF("321.654.987-00", new Date("2022-04-01")));
    cliente4.adicionaPet(new Pet("Nina", "Poodle", "Fêmea", "Cachorro"));
    this.clientes.push(cliente4);
    
    const cliente5 = new Cliente("Fernanda Almeida", "fernanda.almeida@email.com", new CPF("654.321.098-00", new Date("2022-05-01")));
    cliente5.adicionaPet(new Pet("Tommy", "Beagle", "Macho", "Cachorro"));
    this.clientes.push(cliente5);
    
    const cliente6 = new Cliente("Roberto Costa", "roberto.costa@email.com", new CPF("789.123.456-00", new Date("2022-06-01")));
    cliente6.adicionaPet(new Pet("Luna", "Persa", "Fêmea", "Gato"));
    this.clientes.push(cliente6);
    
    const cliente7 = new Cliente("Patrícia Lima", "patricia.lima@email.com", new CPF("159.753.486-00", new Date("2022-07-01")));
    cliente7.adicionaPet(new Pet("Max", "Husky", "Macho", "Cachorro"));
    this.clientes.push(cliente7);
    
    const cliente8 = new Cliente("Juliana Martins", "juliana.martins@email.com", new CPF("753.159.486-00", new Date("2022-08-01")));
    cliente8.adicionaPet(new Pet("Zeca", "Schnauzer", "Macho", "Cachorro"));
    this.clientes.push(cliente8);
    
    const cliente9 = new Cliente("Ricardo Gomes", "ricardo.gomes@email.com", new CPF("852.963.741-00", new Date("2022-09-01")));
    cliente9.adicionaPet(new Pet("Lili", "Rottweiler", "Fêmea", "Cachorro"));
    this.clientes.push(cliente9);
    
    const cliente10 = new Cliente("Luiz Fernando", "luiz.fernando@email.com", new CPF("741.258.963-00", new Date("2022-10-01")));
    cliente10.adicionaPet(new Pet("Duda", "Vira-Lata", "Macho", "Cachorro"));
    this.clientes.push(cliente10);
}

    private criaProdutos(): void {
        this.produtos.push(new Produto("Ração Premium", 120.00, 50, "Alimentação", "Cães"));
        this.produtos.push(new Produto("Areia para Gato", 30.00, 30, "Higiene", "Gatos"));
        this.produtos.push(new Produto("Brinquedo para Cães", 25.00, 100, "Brinquedos", "Cães"));
        this.produtos.push(new Produto("Cama Confortável", 150.00, 20, "Conforto", "Cães e Gatos"));
        this.produtos.push(new Produto("Tosa", 80.00, 10, "Higiene", "Cães e Gatos"));
        this.produtos.push(new Produto("Coleira Anti-pulgas", 45.00, 70, "Saúde", "Cães e Gatos"));
        this.produtos.push(new Produto("Vacina Antirrábica", 90.00, 25, "Saúde", "Cães e Gatos"));
        this.produtos.push(new Produto("Xampu Antialérgico", 40.00, 50, "Higiene", "Cães e Gatos"));
        this.produtos.push(new Produto("Petisco para Cães", 20.00, 200, "Alimentação", "Cães"));
        this.produtos.push(new Produto("Brinquedo Interativo", 35.00, 80, "Brinquedos", "Gatos"));
    }

    private criaServicos(): void {
        this.servicos.push(new Servico("Banho e Tosa", 100.00, 50, "Higiene", "Cães e Gatos"));
        this.servicos.push(new Servico("Consulta Veterinária", 200.00, 30, "Saúde", "Cães e Gatos"));
        this.servicos.push(new Servico("Hospedagem", 300.00, 15, "Conforto", "Cães e Gatos"));
        this.servicos.push(new Servico("Adestramento", 400.00, 10, "Treinamento", "Cães"));
        this.servicos.push(new Servico("Transporte", 50.00, 20, "Serviço", "Cães e Gatos"));
        this.servicos.push(new Servico("Clínica de Reabilitação", 350.00, 5, "Saúde", "Cães"));
        this.servicos.push(new Servico("Acompanhamento Veterinário", 150.00, 25, "Saúde", "Cães e Gatos"));
        this.servicos.push(new Servico("Tosa Higiênica", 80.00, 40, "Higiene", "Cães e Gatos"));
        this.servicos.push(new Servico("Exame de Sangue", 120.00, 30, "Saúde", "Cães e Gatos"));
        this.servicos.push(new Servico("Consulta de Nutrição", 150.00, 20, "Saúde", "Cães e Gatos"));
    }
}
