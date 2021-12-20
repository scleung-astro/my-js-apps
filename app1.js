/* Javascript file for the daily life calculater for app1.html */

const inTemp = document.getElementById("inputTemp");
const outTemp = document.getElementById("outputTemp");
const inUnit = document.getElementById("inputUnit");
const outUnit = document.getElementById("outputUnit");


function convertTemp(){

    console.log("Converting:", inUnit.value, outUnit.value);

    let a1 = 1;
    let a2 = 0;
    switch (inUnit.value){
        case "Celcius":
            if (outUnit.value == "Fahrenheit"){
                a1 = 9.0/5.0;
                a2 = 32.0;
            } else if (outUnit.value === "Kelvin"){
                console.log("Change from C to K");
                a2 = 273.15;
            }
            break;
        case "Fahrenheit":
            if (outUnit.value == "Celcius"){
                a1 = 5.0/9.0;
                a2 = -160.0/9.0;
            } else if (outUnit.value === "Kelvin"){
                a1 = 5.0/9.0;
                a2 = -160.0/9.0+273.15;
            }
            break;
        case "Kelvin":
            if (outUnit.value == "Fahrenheit"){
                a1 = 9.0/5.0;
                a2 = 32.0-273.15*9.0/5.0;
            } else if (outUnit.value === "Celcius"){
                a2 = -273.15;
            }
            break;
        default:
            break;
    }

    outTemp.value = Math.round((a1 * inTemp.value + a2) * 100) / 100;

}

const inputMealPrice = document.getElementById("inputMealPrice");
const inputMealQuality = document.getElementById("inputMealQuality");
const inputMealVAT = document.getElementById("inputVAT");
const outputMealTip = document.getElementById("outputTip");
const outputMealTotal = document.getElementById("outputMealTotal");

function calculateTax(){

    let ratio = 0;
    switch (inputMealQuality){
        case "Good :-D":
            ratio = 0.2;
            break;
        case "OK :-)":
            ratio = 0.15;
            break;
        case "Bad :-(":
            ratio = 0.1;
            break;
        default:
            ratio = 0.15;
            break;
    }

    const tip = parseFloat(inputMealPrice.value) * ratio ;
    const total = parseFloat(inputMealPrice.value) * parseFloat(inputMealVAT.value) / 100 + parseFloat(inputMealPrice.value) + tip;
    console.log("total = ", total);

    outputMealTip.value = Math.round(tip*100)/100.0;
    outputMealTotal.value = Math.round(total*100)/100.0;

}