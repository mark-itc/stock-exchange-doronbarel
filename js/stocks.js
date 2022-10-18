const searchQuery = document.getElementById("searchQuery");
const searchButton = document.getElementById("searchButton");
const searchForm = document.getElementById("searchForm");
const searchSpinner = document.getElementById("searchSpinner");
const resultsContainer = document.getElementById("searchResultsBox");
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fetchURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery.value}&limit=10&exchange=NASDAQ`
    resultsContainer.innerHTML = '';
    searchSpinner.style.display = "inline-block";
    fetch(fetchURL)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const stockResults = isJson ? await response.json() : response;
            if (isJson) {
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
                            resultsContainer.appendChild(stockLi);
                        });
                });
            } else {
                response.text().then(error => {
                    console.log(error);
            });
            }
        }).catch(error => {
            console.log(error)
        });
    searchSpinner.style.display = "none";
});
searchForm.addEventListener('input', (event) => {
    resultsContainer.innerHTML = '';
});
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