'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (html) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { tag: true, id: true, class: true } : arguments[1];

  if (typeof html !== 'string') {
    throw new Error('Expected the argument to be a string.');
  }
  var selectors = {
    tag: new Set(),
    class: new Set(),
    id: new Set()
  };

  var regexpTag = /<(?!\/)([\w]+)([^>]*)\/?>/g;
  var regexpAttr = /(id|class)=(?:(?:["'](.*?)["'])|([\w-]+))/g;
  var type = {
    'id': '#',
    'class': '.'
  };
  var resultTag = void 0;
  var resultAttr = void 0;

  while (resultTag = regexpTag.exec(html)) {
    if (resultTag[1] === '') continue;
    selectors.tag.add(resultTag[1]);

    while (resultAttr = regexpAttr.exec(resultTag[2])) {
      if (resultAttr[2] === '' || resultAttr[3] === '') continue;

      (resultAttr[2] || resultAttr[3]).split(' ').forEach(function (selector) {
        if (selector === '') return false;

        selectors[resultAttr[1]].add(type[resultAttr[1]] + selector);
      });
    }
  }

  return _extends({}, options.tag && { tag: [].concat(_toConsumableArray(selectors.tag)) }, options.class && { class: [].concat(_toConsumableArray(selectors.class)) }, options.id && { id: [].concat(_toConsumableArray(selectors.id)) });
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }