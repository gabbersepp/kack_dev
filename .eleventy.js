const fs = require("fs");
const sass = require("./build/sass-process");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('markdown', function(value) {
      let markdown = require('markdown-it')({
          html: true
      });
      return markdown.render(value);
  });

  var tags = [];

  eleventyConfig.addCollection("drawnimages", function(collection) {
    var allItems =  collection.getAll();
    allItems.map(x => x.data.tags).forEach(x => {
      if (x) {
        tags = [...tags, ...x]
      }
    });

    return allItems;
  });

  eleventyConfig.addCollection("allTags", () => {
    var obj = {};
    tags.forEach(t => obj[t] = true);
    return Object.keys(obj).filter(x => x.toLowerCase() !== "drawnimages");
  });

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
        let ret = new nunjucksEngine.runtime.SafeString(
          //console.log(myStringArg)
          ""
        );
        callback(null, ret);
      };
    }();
  });


  eleventyConfig.addPassthroughCopy("./assets");
  eleventyConfig.addPassthroughCopy("./images");

  sass('./styles/index.scss', './dist/index.css');

  return {
    dir: {
      input: "./views",
      output: "./dist",
      includes: "../_includes"
    }
  }
}