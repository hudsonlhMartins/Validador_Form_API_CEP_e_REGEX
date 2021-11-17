
export function validar(input){
    console.log(input)
    const tipoInput = input.dataset.tipo
    if (tipoInput =='cpf'){
        validarCpf(input)
    }
    if(validadores[tipoInput]){
        validadores[tipoInput](input)
        // esta pegando o objeto certo e execu a function.
    }

    if(!input.validity.valid){
        input.parentElement.children[2].classList.add('show_error')
        input.parentElement.children[2].innerHTML = showMsgError(tipoInput, input)

    }else{
        input.parentElement.children[2].classList.remove('show_error')
        input.parentElement.children[2].innerHTML =''
    } 

    
}

const tiposErros = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'custonError'
]

const mesagensError = {
    // esse objeto e o data do html para pegar o elemento certo
    nome:{
        valueMissing: 'Campo do nome não pode ser vazio'
    },
    email:{
        valueMissing: 'Campo de emial não pode ser vazio',
        typeMismatch: 'Email digitado não e valido'
    },
    senha: {
        valueMissing: 'Campo de senha não pode ser vazio',
        patternMismatch: 'A senha tem que ter no min 4 carac e no Max 8 e tem que Ter pelos menos 1 letra Mais e 1 letra Minus'
    },
    dataNascimento: {
        valueMissing: 'Campo de data de nacimento não pode esta vazio',
        custonError: 'Vc não e maior'
    },
    cep: {
        valueMissing: 'Cep não pode ser vazio',
        patternMismatch: 'Cep não e valido meu amigo'
    },
    logradouto:{
        valueMissing: 'logradouro não pode ser vazio'
    },
    cidade:{
        valueMissing: 'cidade não pode ser vazio'
    },
    estado:{
        valueMissing: 'Estado não pode ser vazio',
    },
    preco:{
        valueMissing: 'Preco não pode ser vazio'
    }

}

const validadores ={
    dataNascimento: input => ValidadorNascimento(input),
    cep: input => recuperarCep(input)

}

function showMsgError(tipoInput, input){
    let mesagem =''

    tiposErros.forEach(err =>{
        if(input.validity[err]){
            // ele vai ver se no validity vai ter algum item do array, vai pegar so oq estive com true
            mesagem = mesagensError[tipoInput][err]
        // vai pegar o tipoInput que no caso e o data-tipo='', que são os nome estão no objeto 
        // depois vai pegar
        }
    })

    return mesagem
}

function ValidadorNascimento(input){
    console.log(input)
    const dataRecebida = new Date(input.value)
    let message = ''

    if(!Maiorque18(dataRecebida))
        console.log('eu')

    message = 'Voce não e maior que 18 anos.'
    
    console.log(message)
    input.setCustomValidity('')
}

function Maiorque18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear()+ 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function digitoIguais(cpf){

    let validaCpfIguais = true
    let digitoMsm = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    digitoMsm.forEach(digito =>{
        if(digito == cpf)
            validaCpfIguais = false
    })
    return validaCpfIguais
}


function validarCpf(input){
    const cpfFormatado = input.value.replace(/\D/g, '')
    
    if(!checaEstruturaCPF(cpfFormatado) || !digitoIguais(cpfFormatado)){
        return console.log('cpf não e valido')
    }

    console.log('cpf valido')
}


function checaEstruturaCPF(cpf){
    let multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
    // esse multi e de onde começ a multiplicação

}

function checaDigitoVerificador(cpf, multiplicador){
    
    if(multiplicador >=12){
        return true
    }

    let soma = 0
    let multiplicadorInicial = multiplicador
    const cpfSemDigito = cpf.substr(0, multiplicador -1).split('')
    // esse substr e para dividir a string 1° e de onde vai começar, 2° e de aonde
    // -1 pq começa do 10 ai vai para poisição 9, assim vai atras sem os digitos verificador
    // isso vai return um vetor, splite para perar cada item do cpf

    const digitoVerificador = cpf.charAt(multiplicador -1)
    // isso para pegar o digito verificador
    // charAt para pegar a posição

    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
        soma = soma + cpfSemDigito[contador] * multiplicadorInicial
        contador++
    }

    
    if(digitoVerificador == confirmaDigito(soma)){

        return checaDigitoVerificador(cpf, multiplicador + 1)
        // para o multiplicado pegr o segundo digito por isso colocou 1
    }
    
    return false
}

function confirmaDigito(soma){
    return 11 - (soma % 11)
}

function recuperarCep(input){
    const cep = input.value.replace(/\D/g, '')
    console.log(cep)
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            'content-type': 'application/json;charset=utf-8'
        // isso e o vai esperar da reposta
        }
    }
    async function getAPI(){
        let res = await fetch(url, options)
        let data = await res.json()
        return data
    }
    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        getAPI().then(data =>{
            console.log(data)
            if(data.erro){
                console.log('error')
                return
            }
            preecharCampos(data)
            console.log(data)
            return
        })
    }
}

function preecharCampos(data){
    const logradouro = document.querySelector("#logradoura")
    const cidade = document.querySelector('#cidade')
    const estado = document.querySelector('#estado')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}