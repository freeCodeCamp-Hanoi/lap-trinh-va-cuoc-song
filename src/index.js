const puppeteer = require('puppeteer');
process.setMaxListeners(Infinity); 

async function createAPage(browser) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    return page
}


async function parseCodinghorror() {
    const articleList = Array.from(document.getElementsByTagName('article'));
    return await articleList.map(article => {
        const titleElement = article.querySelector('h1.entry-title > a');
        const referenceElement = article.querySelector('div.entry-content a');
        return { title: titleElement.text, vncodeHref: titleElement.href, referLink: referenceElement.href }
    }).filter(obj => obj.referLink.indexOf('codinghorror') >= 0)
}


async function codinghorror() {

    const endPoint = 'https://vinacode.net/'
    const listOfUri = Array.from({length: 20}, (x,i) => i + 1)
                            .map(pageNo => {
                                const pageNumber = (pageNo === 1 ) ? '' : `page/${pageNo}`;
                                return  `${endPoint}${pageNumber}`
                            })
    const browser = await puppeteer.launch({ headless: false });
    const promises = listOfUri.map(async uri => {
        const page = await createAPage(browser)
        await page.goto(uri, { waitUntil: 'load', timeout: 600000 })
        return page.evaluate(parseCodinghorror)
    })


    return Promise.all(promises)
 };

 codinghorror()
    .then(val => console.log("val",val.map(e => e.length), val))
    .catch(err => console.log("erraaasas",err))
 
//TODO: write to ../README.md