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

  eleventyConfig.addCollection("allimages", function(collection) {
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
    return Object.keys(obj).filter(x => x.toLowerCase() !== "allimages");
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