const puppeteer = require('puppeteer');

async function codinghorror() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    var count = 0;
    let result = [];
    for (let pageNo = 1; pageNo < 4; pageNo++) {
        let pageNumber = (pageNo === 1 ) ? '' : pageNo
        await page.goto(`https://vinacode.net/page/${pageNumber}`, {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        const articles = await page.evaluate(() => {
            let articleList = document.getElementsByTagName('article');
            let articles = [];
            for (let i = 0; i < articleList.length; i++) {
                count++;
                let titleElement = articleList[i].querySelector('h1.entry-title > a');
                let referenceElement = articleList[i].querySelector('div.entry-content a');
                referenceLink = referenceElement.href;
                const isBlogCodingHorror = referenceLink.indexOf('codinghorror') >= 0;
                if (isBlogCodingHorror) {
                    const post = `${count}. [${titleElement.text}](${titleElement.href})`;
                    articles.push(post);
                }

            }

            result = result.concat(articles);

            return articles;

        })

        // console.log(articles);

    }

    console.log(result);

    await browser.close();
};

codinghorror();