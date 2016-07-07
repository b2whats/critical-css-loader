"use strict";

var loaderUtils = require("loader-utils");

module.exports = function (content) {};

module.exports.pitch = function (remainingRequest) {
  if (this.cacheable) this.cacheable();

  return "\n    var content = require(" + loaderUtils.stringifyRequest(this, "!!" + remainingRequest) + ");\n    var Sheets = require(" + loaderUtils.stringifyRequest(this, "!" + require.resolve("./sheets.js")) + ").default;\n    Sheets.add(content.toString());\n\n    module.exports = content;\n  ";
};