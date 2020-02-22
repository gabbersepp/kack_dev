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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, day, month].join('-');
}

async function twitter() {
    let tweets = tweetDownloader.readTweets("./tweets.json");
    let maxId = BigInt(1);
    if (tweets.length > 0) {
        maxId = tweets.map(x => x.id).reduce((x, y) => x > y ? x : y);
    }
    
    tweets = await tweetDownloader.getLatestEarningsPost(maxId.toString(), "KackDev", "./images",
        process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
    
    tweetDownloader.mergeAndWriteWithExisting("./tweets.json", tweets);

    // create .md files
    tweets.forEach(tweet => {
        if (!tweet.localPath) {
            return;
        }
        tweet.hashtags.forEach(tag => ensureHashTagPage(tag));

        const hashTags = tweet.hashtags.map(x => `    - ${x}`);
        const hashTagStr = hashTags.length > 0 ? hashTags.reduce((x, y) => `${x}\r\n${y}`) : "";

        const md = 
`---
img: /${tweet.localPath}
imgDescription: ${tweet.fullText.replace(/\r/g, " ").replace(/\n/g , "")}
date: ${formatDate(new Date(parseInt((BigInt(tweet.id) / BigInt(100000)).toString())))}
tags: 
    - alles
${hashTagStr}
---
        `;
        fs.writeFileSync(`./views/imageViews/${tweet.id.toString()}.md`, md);
    });
}

twitter();