const loaderUtils = require("loader-utils")

module.exports = function(content) {}

module.exports.pitch = function(remainingRequest) {
  if(this.cacheable) this.cacheable()

  return `
    var content = require(${loaderUtils.stringifyRequest(this, `!!${remainingRequest}`)});
    var Sheets = require(${loaderUtils.stringifyRequest(this, `!${require.resolve("./sheets.js")}`)}).default;
    Sheets.add(content.toString());

    module.exports = content;
  `
}
