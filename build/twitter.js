const tweetDownloader = require("tweet-downloader");
const fs = require("fs");

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
        const md = 
`---
img: /${tweet.localPath}
imgDescription: ${tweet.fullText}
tags: 
    - alles
---
        `;
        fs.writeFileSync(`./views/images/${tweet.id.toString()}.md`, md);
    });
}

twitter();