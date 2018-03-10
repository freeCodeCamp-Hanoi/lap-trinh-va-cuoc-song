const puppeteer = require('puppeteer');

async function codinghorror() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    for (let pageNo = 1; pageNo < 21; pageNo++) {
        let pageNumber = (pageNo === 1 ) ? '' : `page/${pageNo}`; //
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        await page.goto(`https://vinacode.net/${pageNumber}`, {
            waitUntil: 'load',
            timeout: 60000
        });

        const articles = await page.evaluate(() => {
            let articleList = document.getElementsByTagName('article');
            let articles = [];
            for (let i = 0; i < articleList.length; i++) {
                let titleElement = articleList[i].querySelector('h1.entry-title > a');
                let referenceElement = articleList[i].querySelector('div.entry-content a');
                referenceLink = referenceElement.href;
                const isBlogCodingHorror = referenceLink.indexOf('codinghorror') >= 0;
                if (isBlogCodingHorror) {
                    const post = `[${titleElement.text}](${titleElement.href})`;
                    articles.push(post);
                }

            }

            return articles;

        })

        console.log(articles);

    }
    await browser.close();
};

codinghorror();