const Twitter = require("twitter-lite");
const express = require("express");
require("./envvars");

async function retweet(id, TWTR_CKEY, TWTR_CSECRET, TWTR_ATOKEN, TWTR_ASECRET) {
    const client = new Twitter({
        subdomain: "api",
        consumer_key: TWTR_CKEY,
        consumer_secret: TWTR_CSECRET,
        access_token_key: TWTR_ATOKEN,
        access_token_secret: TWTR_ASECRET
    });

    return client.post("statuses/retweet/" + id);
}

var app = express();
app.get("/", async (req, res) => {
    console.log("new request");
    const link = req.query.link;
    console.log("link: " + link);
    const id = link.match(/.*\/([0-9]{6,})/)[1];
    console.log("id: " + id);

    const secret = req.query.secret.trim();

    if (process.env.SECRET.indexOf(secret) <= -1) {
        console.log("wrong secret");
        res.sendStatus(401);
        return;
    }

    try {
        const result = await retweet(id, process.env.TWTR_CKEY, process.env.TWTR_CSECRET, process.env.TWTR_ATOKEN, process.env.TWTR_ASECRET);
        res.sendStatus(200);
    } catch(e) {
        console.log(JSON.stringify(e))
        res.sendStatus(500);
    }
});

app.listen(44320, () => console.log("listening on port 44320"));