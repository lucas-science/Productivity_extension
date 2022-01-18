/*const message = document.getElementById('message');
const gif = document.getElementById('gif')
const domain_text = document.getElementById('domain')

let url = window.location.search;
let domain = new URL(url);

let paramRaw = domain.pathname
let param = paramRaw.substring(1, paramRaw.length)


domain_text.innerHTML = param*/
const listGIPH = [
    "https://giphy.com/embed/M95p3ePQqqpQsuu73m",
    "https://giphy.com/embed/BppJuhtpnIdeCtR4VB",
    "https://giphy.com/embed/xT8qBq71uHPGIR9S2A",
    "https://giphy.com/embed/W3Ch3vjHi5FGefDT0G",
    "https://giphy.com/embed/l0ErOSwfdlTJEaUq4",
    "https://giphy.com/embed/FxUoa5gjdfgi8rDcUM",
    "https://giphy.com/embed/ZaQQ2n0qNXYdPRYeEB",
    "https://giphy.com/embed/xT0GqCtCwNS3xx07pC",
    "https://giphy.com/embed/xUA7bcSEjwMe1q1WJW",
    "https://giphy.com/embed/WodEqZ5Lg2l3cZX4aH",
    "https://giphy.com/embed/pVl9AZ4Xywb2o",
    "https://giphy.com/embed/DKP4M5OqHGH12Swc1a",
]

let randomIndex = Math.floor((Math.random() * 11))
res = listGIPH[randomIndex]
console.log(res)
gif.attributes[0].nodeValue = res