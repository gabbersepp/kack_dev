const fs = require("fs");
const sass = require("./build/sass-process");

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
    tags.forEach(t => obj[t] = true);
    return Object.keys(obj);
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
        //console.log(myStringArg)
        let ret = new nunjucksEngine.runtime.SafeString(
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