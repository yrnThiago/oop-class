import Empresa from "../modelo/empresa";
import CadastroCliente from "../negocio/cadastroCliente";
import Entrada from "../io/entrada";
import Pet from "../modelo/pet";
import CadastroPet from './../negocio/cadastroPet';
import Cliente from './../modelo/cliente';

export default function petInterface(cliente: Cliente, pets: Array<Pet>) {
    let entrada = new Entrada()
    let petsInterface = true;
        while (petsInterface){
            let cadastroPets = new CadastroPet(cliente, pets)
        
            console.log(`Opções:`);
            console.log(`1 - Cadastrar pet`);
            console.log(`2 - Listar pets`);
            console.log(`3 - Atualizar pet`);
            console.log(`0 - Sair`);
            let clienteOpcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

            switch(clienteOpcao){
                case 1:
                    cadastroPets.cadastraPet()
                    break;
                case 2:
                    cadastroPets.pegaTodosPets()
                    break;
                case 3:
                    let petId = entrada.receberNumero(`Por favor, digite o ID do pet: `)
                    alterarPetInterface(cadastroPets, petId, entrada)
                    break;
                case 0:
                    petsInterface = false;
                    break;
            }
        }
}

function alterarPetInterface(cadastroPet: CadastroPet, petId: number, entrada: Entrada) {
    console.log(`Opções:`);
    console.log(`1 - Atualizar`);
    console.log(`2 - Excluir`);
    console.log(`0 - Sair`);

    let clienteOopcao = entrada.receberNumero(`Por favor, escolha uma opção: `)

    switch(clienteOopcao){
        case 1:
            cadastroPet.atualizaPetPorId(petId)
            break;
        case 2:
            cadastroPet.excluiPetPorId(petId)
            break;
        case 0:
            break;
    }
}