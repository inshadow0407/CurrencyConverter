let input = document.querySelector(".source>.input>input");
let result = document.querySelector(".result>.input>input");
let sourceCurrency = document.querySelectorAll(".source>.currency>li");
let resultCurrency = document.querySelectorAll(".result>.currency>li");
let inputCurrency = document.querySelector(".source>.currency>.active").textContent;
let outputCurrency = document.querySelector(".result>.currency>.active").textContent;
let rate=1;
input.value =5000;
result.value =5000;
function setCurrency(event){
    event.target.parentElement.childNodes.forEach((element)=>{
        element.className="";
    })
    event.target.className="active";
    inputCurrency = document.querySelector(".source>.currency>.active").textContent;
    outputCurrency = document.querySelector(".result>.currency>.active").textContent;
    request(inputCurrency,outputCurrency).then((data)=>{
        rate = data.rates[outputCurrency];
        result.value=(+(input.value).replace(/\,/g, '.'))*rate;
        if(event.target.parentElement.parentElement.className=="result"){
        input.nextElementSibling.textContent=`1 ${inputCurrency} = ${(1/rate)} ${outputCurrency}`;
        result.nextElementSibling.textContent=`1 ${outputCurrency} = ${rate} ${inputCurrency}`;
        }
        else {
            input.nextElementSibling.textContent=`1 ${inputCurrency} = ${rate} ${outputCurrency}`;
            result.nextElementSibling.textContent=`1 ${outputCurrency} = ${(1/rate)} ${inputCurrency}`;
        }    
    })
    .catch((err)=>{
        input.nextElementSibling.textContent=err+" попробуйте перезагрузить страницу";
    });
}
async function request(from, to){
        let response = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
        let data =  await response.json();
   
    return data;
}
function convert(event){
    if(event.target.parentElement.parentElement.className=="source"){
        result.value=(+(input.value).replace(/\,/g, '.'))*rate;
        input.nextElementSibling.textContent=`1 ${inputCurrency} = ${rate} ${outputCurrency}`;
        result.nextElementSibling.textContent=`1 ${outputCurrency} = ${(1/rate).toPrecision(4)} ${inputCurrency}`;
    }
    else if(event.target.parentElement.parentElement.className=="result"){
        input.value=(+(result.value.replace(/\,/g, '.')))/rate;
        input.nextElementSibling.textContent=`1 ${inputCurrency} = ${(rate).toPrecision(4)} ${outputCurrency}`;
        result.nextElementSibling.textContent=`1 ${outputCurrency} = ${1/rate} ${inputCurrency}`;
    }
    }
sourceCurrency.forEach((currency)=>{
    currency.addEventListener("click", setCurrency);
})
resultCurrency.forEach((currency)=>{
    currency.addEventListener("click", setCurrency);
})
input.addEventListener("keyup", convert);
result.addEventListener("keyup",convert);
