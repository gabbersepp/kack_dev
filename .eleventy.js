const fs = require("fs");
const sass = require("./build/sass-process");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('markdown', function(value) {
      let markdown = require('markdown-it')({
          html: true
      });
      return markdown.render(value);
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