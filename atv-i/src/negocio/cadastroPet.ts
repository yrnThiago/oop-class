import Entrada from "../io/entrada"
import Cliente from "../modelo/cliente"
import Pet from "../modelo/pet"
import atualizaDado from "../utils/atualizaDados"

export default class CadastroPet {
    private cliente: Cliente
    private pets: Array<Pet>
    private entrada: Entrada
    constructor(cliente: Cliente, pets: Array<Pet>) {
        this.cliente = cliente
        this.pets = pets
        this.entrada = new Entrada()
    }

    public cadastraPet(): void {
        console.log(`\nInício do cadastro do pet de ${this.cliente.nome}: `);
        let nome = this.entrada.receberTexto(`Por favor informe o nome do pet: `)
        let raca = this.entrada.receberTexto(`Por favor informe a raça do pet: `)
        let genero = this.entrada.receberTexto(`Por favor informe o gênero do pet: `);
        let tipo = this.entrada.receberTexto(`Por favor informe o tipo do pet: `);
        
        const novoPet = new Pet(nome, raca, genero, tipo);
        this.cliente.adicionaPet(novoPet);
        console.log(`\nCadastro concluído :)\n`);
    }

    public pegaTodosPets(): void {
        console.log(`\nLista de todos os pets:`);
        let cont = 1;
        this.pets.forEach(pet => {
            console.log(`Id: ` + cont)
            console.log(`Nome: ` + pet.getNome);
            console.log(`Raça: ` + pet.getRaca);
            console.log(`Gênero: ` + pet.getGenero);
            console.log(`Tipo: ` + pet.getTipo);
            console.log(`--------------------------------------`);

            cont += 1;
        });
        console.log(`\n`);
    }

    public pegaPetPorId(petId: number): Pet {
        return this.pets[petId-1];
    }

    public atualizaPetPorId(petId: number): void {
        let atualPet = this.pegaPetPorId(petId);
        let nome = this.entrada.receberTexto(`Nome atual (${atualPet.getNome}) -> `);
        let raca = this.entrada.receberTexto(`Raça atual (${atualPet.getRaca}) -> `);
        let genero = this.entrada.receberTexto(`Gênero atual (${atualPet.getGenero}) -> `);
        let tipo = this.entrada.receberTexto(`Tipo atual (${atualPet.getTipo}) -> `);

        atualPet.setNome = atualizaDado(atualPet.getNome, nome);
        atualPet.setRaca = atualizaDado(atualPet.getRaca, raca);
        atualPet.setGenero = atualizaDado(atualPet.getGenero, genero);
        atualPet.setTipo = atualizaDado(atualPet.getTipo, tipo);

        console.log(`Pet ${petId} atualizado com sucesso!`);

    }

    public excluiPetPorId(petId: number): void {
        let petDeletado = this.pets.splice(petId, 1);
        if (!petDeletado[0]) {
            console.log(`\nPet não encontrado! Tente novamente...\n`);
        }else{
            console.log(`Pet Id: ${petId} deletado com sucesso!\n`);
        }
    }

}