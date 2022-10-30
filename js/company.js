const urlParams = new URLSearchParams(window.location.search);
const companySymbol = urlParams.get('symbol');
const fetchURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companySymbol}`
const companySummary = document.getElementById("companySummary");
const companyNameContainer = document.getElementById("companyNameContainer");
const stockPriceContainer = document.getElementById("stockPriceContainer");
const companyDescContainer = document.getElementById("companyDescContainer");
const summarySpinner = document.getElementById("summarySpinner");
const chartSpinner = document.getElementById("chartSpinner");
summarySpinner.style.display = "inline-block";
fetch(fetchURL)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const companyInfo = isJson ? await response.json() : response;
            if (isJson) {
                // Company image
                const companyImage = document.createElement("img");
                companyImage.src = companyInfo["profile"]["image"];
                companyImage.classList.add("companyImage");
                companyNameContainer.appendChild(companyImage);
                // Company name
                const companyName = document.createElement("h3");
                companyName.innerText = companyInfo["profile"]["companyName"];
                companyNameContainer.appendChild(companyName);
                // Stock price
                const stockPrice = document.createElement("span");
                stockPrice.innerText = `Stock Price: ${companyInfo["profile"]["price"]}`;
                stockPriceContainer.appendChild(stockPrice);
                const stockPriceChange = document.createElement("span");
                const priceDelta = companyInfo["profile"]["changesPercentage"];
                stockPriceChange.classList.add(priceDelta*1 > 0 ? "priceGain" : "priceLoss");
                stockPriceChange.innerText = ` (${priceDelta*1 > 0 ? "+" : ""}${Math.round(priceDelta*100)/100}%)`;
                stockPriceContainer.appendChild(stockPriceChange);
                // Company description
                const companyDesc = document.createElement("p");
                companyDesc.classList.add("companyDescription");
                companyDesc.innerText = companyInfo["profile"]["description"];
                companyDescContainer.appendChild(companyDesc);
                // Price chart
                chartSpinner.style.display = "inline-block";
                generatePriceChart(companySymbol, priceDelta*1 > 0);
            } else {
                response.text().then(error => {
                    console.log(error);
            });
            }
        }).catch(error => {
            console.log(error)
        });
summarySpinner.style.display = "none";
function generatePriceChart(symbol, gain) {
    const fetchURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`
    fetch(fetchURL)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const priceHistory = isJson ? await response.json() : response;
            if (isJson) {
                const dates = [];
                const closingPrices = [];
                priceHistory["historical"].forEach(element => { 
                    dates.push(element["date"]);
                    closingPrices.push(element["close"]);
                });
                dates.reverse();
                closingPrices.reverse();
                new Chart("priceChart", {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                    label: symbol + ' - Stock Price History',
                    data: closingPrices,
                    borderColor: gain == true ? "#0f884e" : "#b8363f",
                    backgroundColor: gain == true ? "#18a05e" : "#dd434e",
                    fill: "start"
                    }]
                }
                });
            } else {
                response.text().then(error => {
                    console.log(error);
            });
            }
        }).catch(error => {
            console.log(error)
        });
    chartSpinner.style.display = "none";
}