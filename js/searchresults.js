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
                    const stock = new Stock(element);
                    const stockLi = stock.createResultElement();
                    this.resultsElement.appendChild(stockLi);
                });
        });
    }
}
class Stock {
    constructor(resultObject) {
      this.name = resultObject.name;
      this.symbol = resultObject.symbol;
      this.image = resultObject.image;
      this.percentChange = resultObject.percentChange;
    }
    createResultElement() {
      const resultLi = document.createElement("li");
      resultLi.classList.add("list-group-item");
      const resultText = document.createElement("p");
      resultText.innerHTML = `<a href='./company.html?symbol=${this.symbol}'><img src='${this.image}' class='companyImage-small'/>${this.name}</a> (${this.symbol}) ${this.percentChange*1 > 0 ? "<span class='priceGain'>(+" : "<span class='priceLoss'>("}${Math.round(this.percentChange*100)/100}%)</span>`;
      resultLi.appendChild(resultText);
      return resultLi;
    }
}