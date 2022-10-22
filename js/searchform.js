export class SearchForm {
    constructor(element) {
        this.formElement = element;
        this.form = document.createElement('form');
        this.form.classList.add("d-flex");
        this.form.setAttribute("role", "search");
        this.form.setAttribute("id", "searchForm");

        this.query = document.createElement('input');
        this.query.classList.add("form-control");
        this.query.classList.add("me-2");
        this.query.setAttribute("type", "search");
        this.query.setAttribute("placeholder", "Search Symbol");
        this.query.setAttribute("id", "searchQuery");
        this.form.appendChild(this.query);

        this.spinner = document.createElement('div');
        this.spinner.classList.add("spinner-border");
        this.spinner.classList.add("text-primary");
        this.spinner.setAttribute("role", "status");
        this.spinner.setAttribute("id", "searchSpinner");
        this.form.appendChild(this.spinner)

        this.button = document.createElement("button");
        this.button.classList.add("btn");
        this.button.classList.add("btn-outline-success");
        this.button.setAttribute("type", "submit");
        this.button.setAttribute("id", "searchButton");
        this.button.innerText = "Search";
        this.form.appendChild(this.button);

        this.formElement.appendChild(this.form);
        this.companies = [];
    }
    async runSearch(callback) {
        const fetchURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${this.query.value}&limit=10&exchange=NASDAQ`
        this.spinner.style.display = "inline-block";
        fetch(fetchURL)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const stockResults = isJson ? await response.json() : response;
                if (isJson) {
                    searchSpinner.style.display = "none";
                    return callback(stockResults);
                } else {
                    response.text().then(error => {
                        console.log(error);
                });
                }
            }).catch(error => {
                console.log(error)
            });
      }
    async onSearch(callback) {
        this.form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await this.runSearch(callback);
        });
    }
}