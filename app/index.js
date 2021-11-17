import { validar } from "./services/validadorForm.js";


let AllInputs = document.querySelectorAll('input')

AllInputs.forEach(input =>{

    if(input.dataset.tipo === 'preco'){
        SimpleMaskMoney.setMask(input, {
            allowNegative: false,
            negativeSignAfter: false,
            prefix: 'R$',
            suffix: '',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
        })
    }

    input.addEventListener('blur', e => validar(e.target))
})