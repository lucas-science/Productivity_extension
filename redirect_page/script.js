const message = document.getElementById('message');

let url = window.location.href;
let domain = new URL(url);

console.log(domain)


message.innerText = domain.search