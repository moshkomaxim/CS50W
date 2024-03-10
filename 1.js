function getCurrency() {
    currency = document.querySelector("#currency").value.toUpperCase();
    fetch('https://open.er-api.com/v6/latest/USD')
    
    .then(response => response.json())
    .then(data => {
        const rate = data.rates[currency];
        if (rate) {
            document.querySelector("p").innerHTML = rate;
        }
        else {
            document.querySelector("p").innerHTML = "Invalid currency"
        };
        
    })

    .catch(error => {
        console.log("Error: ", error);
    })

    return false;
};



document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").onsubmit = getCurrency;
});
