export class SearchResults {
    constructor(element) {
        this.resultsElement = element;
    }
    renderResults(stockResults) {
        this.resultsElement.innerHTML = '';
        stockResults.forEach(element => { 
            const companyInfoURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${element.symbol}`;
            fetch(companyInfoURL)
                .then(async response => {
                    const companyInfo = await response.json();
                    return companyInfo;
                })
                .then(async data => {
                    element.image = await data["profile"]["image"];
                    element.percentChange = await data["profile"]["changesPercentage"];
                    return element;
                })
                .then(element => {
                    element.query = document.getElementById('searchQuery').value;
                    const stock = new Stock(element, element.query);
                    const stockLi = stock.createResultElement();
                    this.resultsElement.appendChild(stockLi);
                });
        });
    }
}
class Stock {
    constructor(resultObject, query) {
      this.name = resultObject.name;
      this.symbol = resultObject.symbol;
      this.image = resultObject.image;
      this.percentChange = resultObject.percentChange;
      this.query = resultObject.query;
    }
    createResultElement() {
        const resultLi = document.createElement("li");
        resultLi.classList.add("list-group-item");
        const resultText = document.createElement("p");
        const highlightedSymbol = highlightSearchTerm(this.symbol, this.query);
        const highlightedName = highlightSearchTerm(this.name, this.query);
        resultText.innerHTML = `<a href='./company.html?symbol=${this.symbol}'><img src='${this.image}' class='companyImage-small'/>${highlightedName}</a> (${highlightedSymbol}) ${this.percentChange*1 > 0 ? "<span class='priceGain'>(+" : "<span class='priceLoss'>("}${(this.percentChange*1).toFixed(2)}%)</span>`;
        resultLi.appendChild(resultText);
        return resultLi;
    }
}
function highlightSearchTerm(stringVal, query) {
    let highlightedText = stringVal;
    const searchTermIndex = stringVal.toLowerCase().indexOf(query.toLowerCase());
    if(searchTermIndex >= 0) {
        highlightedText = stringVal.substring(0,searchTermIndex) + "<span class='highlight'>" + stringVal.substring(searchTermIndex,searchTermIndex+query.length) + "</span>" + stringVal.substring(searchTermIndex + query.length);
    }
    return highlightedText;
}