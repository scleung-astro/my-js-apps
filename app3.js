// load the candle chart plotting library
google.charts.load('current', {'packages':['corechart']});


const Asset = class{

    constructor(name,price,mu,sigma){
        this.name = name;
        this.price = price;
        this.mu = mu;
        this.sigma = sigma;

        // for economics
        this.sentiment = 0;

        // for user to interact
        this.holding = 0;
        this.avgCost = 0;

        // price history for plotting
        this.priceHist = [this.price];
    };

    updatePrice(){

        // use normal distribution to generate a new random number
        // and update the price accordingly
        let newRand = random_normal(this.mu, this.sigma);
        let newPrice = Math.round(this.price * (1.0 + newRand) * 100.0) / 100.0;

        this.price = newPrice;
        this.priceHist.push(newPrice);

        //console.log("Asset", this.name, "new price ", this.price);
    }

    prepareCandleChart(){

        let priceSummary = [[0,this.priceHist[0],this.priceHist[0],this.priceHist[0],this.priceHist[0]]];

        //console.log(this.priceHist);

        let priceOpen = this.priceHist[0];
        let priceClose = this.priceHist[0];
        let priceMax = this.priceHist[0];
        let priceMin = this.priceHist[0];

        for (let i=0; i<this.priceHist.length; i++){

            priceMax = Math.max(this.priceHist[i], priceMax);
            priceMin = Math.min(this.priceHist[i], priceMin);
            
            if (i%21 == 20){
                priceClose = this.priceHist[i];
                priceSummary.push([i, priceMin, priceOpen, priceClose, priceMax])
                priceOpen = this.priceHist[i];
                priceMax = this.priceHist[i];
                priceMin = this.priceHist[i];
            }

        }

        return priceSummary;
    }

    
}

// inspired from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// with my own input
function random_normal(mu, sigma){

    let u=0, v=0;

    // use Box-Muller Theorem to generate normal variable 
    // by two uniform random number
    while(u===0) u = Math.random()
    while(v===0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    // recompute if the random number is greater than 1 or less than 0
    // otherwise do the transformation
    num = num / 10.0 + 0.5;

    if (num > 1 || num < 0){
       num = random_normal(mu, sigma); 
    }
    else{
        // by construction the range above 1 is 3.6 sigma away
        num = num*(7.2*sigma) + mu - 3.6*sigma;
    }

    return num;
}

// Taken from Google https://developers.google.com/chart/interactive/docs/gallery/candlestickchart
// for generating candle stick chart
function drawChart() {

    var data = google.visualization.arrayToDataTable(priceHist, true);

    var options = {
      legend:'none'
    };


    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

const Market = class{

    constructor(){
        this.assets = []
    }

    updateHTML(){

        let row = ""
        for (let i=0; i<this.assets.length; i++){    
            row += "<tr><td>" + i + "</td><td>" + this.assets[i].name + "</td>" + 
                "<td>" + this.assets[i].price + "</td>" + 
                "<td>" + this.assets[i].holding + " (" + this.assets[i].avgCost + ")</td></tr>\n";
        }

        assetPrices.innerHTML = row;        
    }

    updateAssetPrice(){
        for (let i=0; i<this.assets.length; i++){
            this.assets[i].updatePrice();
        }
    }

    getTotalAsset(){

        let total = cash;
        for (let i=0; i<this.assets.length; i++){
            total += this.assets[i].holding * this.assets[i].price;

        }
        return total;
    }

}


//

function showChart(){

    let assetIdx = assetChartChoice.value; 
    priceHist = market.assets[assetIdx].prepareCandleChart();
    google.charts.setOnLoadCallback(drawChart);

}

function updateCash(){

    let total = market.getTotalAsset();
    currentCash.innerHTML = "<p> Cash: " + cash + "</p>" + 
        "<p> Total: " + total + "</p>";
}

function transact(){

    let assetIdx = parseInt(assetTradeChoice.value); 
    let assetAmt = parseInt(assetTradeAmt.value); 

    console.log(assetIdx, assetAmt);

    // check if the transaction is appropriate
    if (assetIdx < 0 || assetIdx > 5){
        alert("Select an asset first!");
        return;
    }

    if (assetAmt < 0 && market.assets[assetIdx].holding + assetAmt < 0){
        alert("Cannot oversell in this app!");
        return;
    } else if (assetAmt > 0 && cash < market.assets[assetIdx].price * assetAmt) {
        alert("Cannot overbuy in this app!");
        return;
    }

    // if all tests are passed, proceed the trade
    if (assetAmt > 0){
        cost = market.assets[assetIdx].price * assetAmt;
        cost = Math.round(cost* 100) / 100.0;
        // pay the trade
        cash -= cost;

        // update the record
        market.assets[assetIdx].avgCost = (market.assets[assetIdx].avgCost * market.assets[assetIdx].holding + cost) / (assetAmt + market.assets[assetIdx].holding);
        market.assets[assetIdx].holding += assetAmt;

        // round up for reresentation
        market.assets[assetIdx].avgCost = Math.round(market.assets[assetIdx].avgCost * 100) / 100.0;

    } else if (assetAmt < 0){
        cost = -market.assets[assetIdx].price * assetAmt;
        cost = Math.round(cost* 100) / 100.0;

        // pay the trade
        cash += cost;

        // update the record
        market.assets[assetIdx].holding += assetAmt;
    }

    updateCash();

}

function pauseGame(){

    if (!appPaused){
        clearInterval(intervalID);
        appPaused = true;
        //console.log("Game paused");
    } else {
        intervalID = setInterval(
            function() {
                market.updateHTML();
                updateCash();
                market.updateAssetPrice();;
          }, updateInterval);
        appPaused = false;
        
        //console.log("Game resumed");
    }

}

const assetPrices = document.getElementById("assetPrices");
const assetChartChoice = document.getElementById("assetChartChoice");
const assetTradeChoice = document.getElementById("assetTradeChoice");
const assetTradeAmt = document.getElementById("assetTradeAmt");
const currentCash = document.getElementById("currentCash");

/* "<td> <input type='number' class='form-control' id='' value=0> </td>" + 
        <td id="oilHold"> </td>
        <td> <input type="number" class="form-control" id="oilTrans" value=0> </td>
        <td> <button type="button" class="btn btn-primary" onclick="oilTrans()"> Buy/Sell</button> </td>*/

let priceHist = null;
let cash = 10000.0;

let updateInterval = 1000;
let appPaused = true;

let intervalID = null;

market = new Market();
market.assets.push(new Asset("Stock", 1.00, 0.0002, 0.05));
market.assets.push(new Asset("Bond", 100.0, 0.0001, 0.005));
market.assets.push(new Asset("Oil", 60.0, 0.0001, 0.02));
market.assets.push(new Asset("Gold", 3000.0, 0.0001, 0.02));
market.assets.push(new Asset("Catcoin", 1000.00, 0.0001, 0.1));
console.log(market.assets);


// set up iniital display
market.updateHTML();
updateCash();

