// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT

let url = window.location.href;
let domain = new URL(url);

console.log(domain.origin)

if (domain.origin == "https://www.yhgjkhoutube.com") {
    setInterval(() => {
        window.location.replace("http://www.w3schools.com");
    }, 10000)
}