// Handle the dog picture 

const dogPic = document.getElementById("dogPic");

//let dogPicLink = fetch("https://dog.ceo/api/breeds/image/random")
//    .then(response => response.json())
//    .then(data => addDogPicLink(data["message"]));

// populate the dog pic corner
function addDogPicLink(link){
    dogPic.innerHTML = "<img src='" + link + "' class='image-fluid' alt='Dog Pic Today' width='100px'>";
}

addDogPicLink("https://images.dog.ceo/breeds/dingo/n02115641_2636.jpg");

// Handle Binance data

const crpytoTable = document.getElementById("crpytoTable");

let cryptoData = fetch("https://api2.binance.com/api/v3/ticker/24hr")
    .then(response => response.json())
    .then(data => tabulateCryptoData(data));

function tabulateCryptoData(data){

    selected_rows = [0, 315, 317, 564];
    let row = ""

    for (let i=0; i<selected_rows.length; i++){

        let fontColor = "black";

        selected_row = selected_rows[i]

        const symbol = data[selected_row]["symbol"];
        const lastPrice = parseFloat(data[selected_row]["lastPrice"]);
        const bidPrice = parseFloat(data[selected_row]["bidPrice"]);
        const askPrice = parseFloat(data[selected_row]["askPrice"]);
        const highPrice = parseFloat(data[selected_row]["highPrice"]);
        const lowPrice = parseFloat(data[selected_row]["lowPrice"]);
        const priceChangePC = parseFloat(data[selected_row]["priceChangePercent"]);
        const priceChange = parseFloat(data[selected_row]["priceChange"]);
        const volume = parseFloat(data[selected_row]["volume"]);

        if (priceChange > 0){
            fontColor = "green";
        } else {
            fontColor = "red";
        }

        row += "<tr><th scope='row'>" + symbol + "</th>" + 
            "<td>" + lastPrice + "<span style='color:" + fontColor + "'>(" ;
            
        if (priceChange > 0){
            row += "+";
        }

        row += priceChange + ")<\span></td>" + 
            "<td>" + askPrice + "/" + bidPrice + "</td>" + 
            "<td>" + priceChangePC + "</td>" + 
            "</tr>";

        // second row
        row += "<tr><th scope='row'></th>" + 
            "<td> <b>High:</b> " + highPrice + "</td>" + 
            "<td> <b>Low:</b> " + lowPrice + "</td>" + 
            "<td> <b>Volume:</b> " + volume + "</td>";
    }

    crpytoTable.innerHTML = row;

}
