import CPF from "./cpf";
import Pet from "./pet";
import Produto from "./produto";
import RG from "./rg";
import Servico from "./servico";
import Telefone from "./telefone";

export default class Cliente {
    public nome: string;
    public nomeSocial: string;
    private cpf: CPF;
    private rgs: RG[];
    private dataCadastro: Date;
    private telefones: Telefone[];
    private produtosConsumidos: Produto[];
    private servicosConsumidos: Servico[];
    private pets: Pet[];

    constructor(nome: string, nomeSocial: string, cpf: CPF) {
        this.nome = nome;
        this.nomeSocial = nomeSocial;
        this.cpf = cpf;
        this.rgs = [];
        this.dataCadastro = new Date();
        this.telefones = [];
        this.produtosConsumidos = [];
        this.servicosConsumidos = [];
        this.pets = [];
    }

    public get getCpf(): CPF {
        return this.cpf;
    }

    public get getRgs(): RG[] {
        return this.rgs;
    }

    public get getDataCadastro(): Date {
        return this.dataCadastro;
    }

    public get getTelefones(): Telefone[] {
        return this.telefones;
    }

    public get getProdutosConsumidos(): Produto[] {
        return this.produtosConsumidos;
    }

    public get getServicosConsumidos(): Servico[] {
        return this.servicosConsumidos;
    }

    public get getPets(): Pet[] {
        return this.pets;
    }

    public get getValorTotalGasto(): number {
        return [...this.produtosConsumidos, ...this.servicosConsumidos].reduce((total, item) => total + item.valor, 0);
    }

    public set setCpf(cpf: CPF) {
        this.cpf = cpf;
    }
    
    public set setRgs(rgs: RG[]) {
        this.rgs = rgs;
    }
    
    public set setTelefones(telefones: Telefone[]) {
        this.telefones = telefones;
    }
    
    public addProdutoConsumido(produtoConsumido: Produto): void {
        this.produtosConsumidos.push(produtoConsumido);
    }

    public addServicoConsumido(servicoConsumido: Servico): void {
        this.servicosConsumidos.push(servicoConsumido);
    }

    public adicionaPet(novoPet: Pet): Cliente {
        this.pets.push(novoPet);
        return this;
    }
}
