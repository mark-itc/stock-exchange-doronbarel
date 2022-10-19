export class Marquee {
    constructor(element) {
      this.marqueeElement = element;
    }
    load() {
        const fetchURL = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nasdaq'
        fetch(fetchURL)
            .then(async data => {
                const isJson = data.headers.get('content-type')?.includes('application/json');
                const stockTickerData = isJson ? await data.json() : data;
                const stockTicker = this.marqueeElement;
                if (isJson) {
                    console.log(stockTickerData);
                    const dataArray = [];
                    // limiting marquee stocks to only 1000 elements to improve performance
                    for(let i = 0; i < 1000; i++) {
                        let element = stockTickerData[i]
                        dataArray.push(`<span class='tickerElement'>${element.symbol} ${element.changesPercentage*1 > 0 ? "<span class='priceGain'>+" : "<span class='priceLoss'>"}${(element.changesPercentage*1).toFixed(2)}%</span></span>`)
                    }
                    stockTicker.innerHTML = dataArray.join('&nbsp;&nbsp;&nbsp;&nbsp;');
                } else {
                    response.text().then(error => {
                        console.log(error);
                });
                }
            }).catch(error => {
                console.log(error)
            });
    }
}