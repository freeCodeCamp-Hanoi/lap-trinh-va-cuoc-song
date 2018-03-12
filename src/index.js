const puppeteer = require('puppeteer');
const fs = require('fs');
let globalResult = 'Links to be added below\n';  // contains links of all pages
let globalCount = 0;    // keeps counting links which are collected

async function crawlCodingHorror(callback) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    for (let pageNo = 1; pageNo < 21; pageNo++) {
        let pageURL = (pageNo === 1 ) ? '' : `page/${pageNo}`; //
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        await page.goto(`https://vinacode.net/${pageURL}`, {
            waitUntil: 'load',
            timeout: 90000
        });

        const localResult = await page.evaluate(({globalCount}) => {
            // collects links of one page
            const ARTICLE_SELECTOR      = 'article'; // to select one title
            const TITLE_SELECTOR        = 'h1.entry-title > a'; // to select title and link of title
            const REF_SELECTOR          = 'div.entry-content a'; // to select reference of title
            const CONDITION_SELECTOR    = 'codinghorror'; // keyword to select title
            
            let currentCount = globalCount; 
            let articleList = document.getElementsByTagName(ARTICLE_SELECTOR);
            let articles = '';

            for (let i = 0; i < articleList.length; i++) {
                let titleElement = articleList[i].querySelector(TITLE_SELECTOR);
                let referenceElement = articleList[i].querySelector(REF_SELECTOR );
                referenceLink = referenceElement.href;
                const isBlogCodingHorror = referenceLink.indexOf(CONDITION_SELECTOR) >= 0;
                if (isBlogCodingHorror) {
                    currentCount++;
                    const post = `${currentCount}. [${titleElement.text}](${titleElement.href})\n`;
                    articles = articles + post;
                }
            }

            return {articles, currentCount};

        }, {globalCount})

        globalResult = globalResult.concat(localResult.articles);
        globalCount = localResult.currentCount;

        callback(globalResult, 'data.txt')

    }

    await browser.close();
};

function writeResultToFile(source, target) {
    fs.writeFileSync(target, source);
}

crawlCodingHorror(writeResultToFile);