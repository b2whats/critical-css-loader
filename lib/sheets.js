'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sheets = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sheets = function () {
  function Sheets() {
    _classCallCheck(this, Sheets);

    this.sheets = [];
    this.ast = null;
    this.cache = new Map();
  }

  _createClass(Sheets, [{
    key: 'add',
    value: function add(sheet) {
      this.sheets.push(sheet);
    }
  }, {
    key: 'walkRules',
    value: function walkRules(selectorsQuery) {
      console.time('clone');
      var critical = this.ast.clone();
      console.timeEnd('clone');

      console.time('walk');
      var tag = selectorsQuery.tag;
      var id = selectorsQuery.id;
      var classes = selectorsQuery.class;

      critical.walkRules(function (rule) {
        if (rule.selector.startsWith('*')) return null;
        if (rule.selector.startsWith('::')) return null;
        if (classes && classes.test(rule.selector)) return null;
        if (id && id.test(rule.selector)) return null;
        if (tag && tag.test(rule.selector)) return null;

        rule.remove();
      });

      critical.walkAtRules(function (atRule) {
        if (atRule.nodes.length === 0) atRule.remove();
      });
      console.timeEnd('walk');

      return critical;
    }
  }, {
    key: 'createAST',
    value: function createAST(stringSheets) {
      console.time('create');
      this.ast = _postcss2.default.parse(stringSheets);
      console.timeEnd('create');
    }
  }, {
    key: 'getCriticalCss',
    value: function getCriticalCss(selectors) {
      if (!(0, _utils.isObject)(selectors)) {
        throw new Error('Expected the argument to be a object with property {id: [], class: [], tag: []}.');
      }
      Object.keys(selectors).forEach(function (key) {
        if (['id', 'tag', 'class'].includes(key) && !Array.isArray(selectors[key])) {
          throw new Error('Property ' + key + ' must be an array.');
        }
      });
      var hash = this.getHash(selectors);

      if (this.checkCache(hash)) return this.getCache(hash);
      if (this.ast === null) this.createAST(this.toString());

      var selectorsQuery = this.generateSelectorsQuery(selectors);
      var critical = this.walkRules(selectorsQuery);
      console.time('toString');
      var criticalToString = critical.toString();
      console.timeEnd('toString');
      this.setCache(hash, criticalToString);

      return criticalToString;
    }
  }, {
    key: 'generateSelectorsQuery',
    value: function generateSelectorsQuery(selectors) {
      return _extends({}, selectors.id && { id: (0, _utils.compose)(this.regexpNamedSelectors, this.getSelectorsString)(selectors.id) }, selectors.class && { class: (0, _utils.compose)(this.regexpNamedSelectors, this.getSelectorsString)(selectors.class) }, selectors.tag && { tag: (0, _utils.compose)(this.regexpTag, this.getSelectorsString)(selectors.tag) });
    }
  }, {
    key: 'getSelectorsString',
    value: function getSelectorsString(selectors) {
      return selectors.join('|').replace(/([\.])/g, '\\$1');
    }
  }, {
    key: 'regexpTag',
    value: function regexpTag(str) {
      return new RegExp('(,|^)[^\\.#,]*?([^\\w\\.#-]|\\b)(' + str + ')(?=[^\\w\\.#-]|$)[^\\.#]*?(?=,|$)');
    }
  }, {
    key: 'regexpNamedSelectors',
    value: function regexpNamedSelectors(str) {
      return new RegExp('(' + str + ')\\b');
    }
  }, {
    key: 'getHash',
    value: function getHash(value) {
      return JSON.stringify(value);
    }
  }, {
    key: 'setCache',
    value: function setCache(id, value) {
      this.cache.set(id, value);
    }
  }, {
    key: 'getCache',
    value: function getCache(id) {
      return this.cache.get(id);
    }
  }, {
    key: 'checkCache',
    value: function checkCache(id) {
      return this.cache.has(id);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.sheets.join('\r\n');
    }
  }]);

  return Sheets;
}();

var sheets = new Sheets();

exports.Sheets = Sheets;
exports.default = sheets;