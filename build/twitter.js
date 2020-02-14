const tweetDownloader = require("tweet-downloader");
const fs = require("fs");
const path = require("path");

const tplPath = path.join("views", "tags", "tag.njk.tpl");
console.log(tplPath);
const viewTpl = fs.readFileSync(tplPath).toString();

function ensureHashTagPage(tag) {
    const viewPath = path.join("views", "tags", `${tag}.njk`);
    if (!fs.existsSync(viewPath)) {
        const view = viewTpl.replace("#tag#", tag);
        fs.writeFileSync(viewPath, view);
    }
}

async function twitter() {
    let tweets = tweetDownloader.readTweets("./tweets.json");
    let maxId = BigInt(1);
    if (tweets.length > 0) {
        maxId = tweets.map(x => x.id).reduce((x, y) => Math.max(x, y));
    }
    
    tweets = await tweetDownloader.getLatestEarningsPost(maxId.toString(), "KackDev", "./images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    
    tweetDownloader.mergeAndWriteWithExisting("./tweets.json", tweets);

    // create .md files
    tweets.forEach(tweet => {
        tweet.hashtags.forEach(tag => ensureHashTagPage(tag));

        const hashTagStr = tweet.hashtags.map(x => `    - ${x}`).reduce((x, y) => `${x}\r\n${y}`);
        const md = 
`---
img: /${tweet.localPath}
imgDescription: ${tweet.fullText}
tags: 
    - alles
${hashTagStr}
---
        `;
        fs.writeFileSync(`./views/images/${tweet.id.toString()}.md`, md);
    });
}

twitter();