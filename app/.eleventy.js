const fs = require("fs");
const path = require("path");
const { cwd } = require("process");
const sass = require(path.join(cwd(), "build", "sass-process"));

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('markdown', function(value) {
      let markdown = require('markdown-it')({
          html: true
      });
      return markdown.render(value);
  });

  eleventyConfig.addCollection("allTags", (collection) => {
    var tags = collection.items.map(x => x.data)
      .filter(x => x.tags).map(x => x.tags).reduce((x, y) => [...x, ...y]);
    var obj = {};
    tags.forEach(t => obj[t] = (obj[t] || 0) + 1);
    const tagsSortedByUsage = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
    return tagsSortedByUsage.splice(0, 4);
  });

  eleventyConfig.addNunjucksFilter("cleartweet", function(value) {
    if (!value) {
      return value;
    }

    // replace hashtags
    value = value.replace(/#[0-9a-z]+/ig, "");
    // replace links
    value = value.replace(/https?:\/\/[^\s$]+/gi, "")
    // tweets contain U+2800 https://www.utf8-chartable.de/unicode-utf8-table.pl?start=10240&number=128
    // no idea why
    value = value.replace(/\s+|\u2800+/g, " ")

    var map = {
      amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'"
    }
    return value.replace(/&([^;]+);/g, (m, c) => map[c]|| '')
  })

  eleventyConfig.addNunjucksTag("log", function(nunjucksEngine) {
    return new function() {
      this.tags = ["log"];

      this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        return new nodes.CallExtensionAsync(this, "run", args);
      };

      this.run = function(context, myStringArg, callback) {
        //console.log(myStringArg)
        let ret = new nunjucksEngine.runtime.SafeString(
          ""
        );
        callback(null, ret);
      };
    }();
  });


  eleventyConfig.addPassthroughCopy({ "app/assets": "./assets" });
  eleventyConfig.addPassthroughCopy({ "app/images": "./images" });

  sass(path.join(cwd(), "app", "styles", "index.scss"), path.join(cwd(), "app", "dist", "index.css"));

  return {
    dir: {
      input: path.join("app", "views"),
      output: "app/dist",
      includes: path.join("..", "_includes")
    }
  }
}