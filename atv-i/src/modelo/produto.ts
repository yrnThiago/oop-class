export default class Produto {
    public nome: string;
    public valor: number;
    public qtdVendidas: number;
    public tipo: string;
    public raca: string;

    constructor(nome: string, valor: number, qtdVendidas: number, tipo: string, raca: string) {
        this.nome = nome;
        this.valor = valor;
        this.qtdVendidas = qtdVendidas;
        this.tipo = tipo;
        this.raca = raca;
    }

    public registraVenda(qtd: number): void {
        if (qtd <= 0) {
            throw new Error("Quantidade vendida deve ser maior que zero.");
        }
        this.qtdVendidas += qtd;
    }

    public get getQtdVendidas(): number {
        return this.qtdVendidas;
    }
}
