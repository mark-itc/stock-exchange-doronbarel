const searchQuery = document.getElementById("searchQuery");
const searchButton = document.getElementById("searchButton");
const searchForm = document.getElementById("searchForm");
const searchSpinner = document.getElementById("searchSpinner");

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fetchURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchQuery.value}&limit=10&exchange=NASDAQ`
    const resultsContainer = document.getElementById("searchResultsBox");
    resultsContainer.innerHTML = '';
    searchSpinner.style.display = "inline-block";
    fetch(fetchURL)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const stockResults = isJson ? await response.json() : response;
            if (isJson) {
                stockResults.forEach(element => { 
                    const stock = new Stock(element);
                    const stockLi = stock.createResultElement();
                    resultsContainer.appendChild(stockLi);
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

class Stock {
    constructor(resultObject) {
      this.name = resultObject.name;
      this.symbol = resultObject.symbol;
    }
    createResultElement() {
      const resultLi = document.createElement("li");
      resultLi.classList.add("list-group-item");
      const resultText = document.createElement("p");
      resultText.innerHTML = `<a href='/company.html?symbol=${this.symbol}'>${this.name} (${this.symbol})</a>`;
      resultLi.appendChild(resultText);
      return resultLi;
    }
}
