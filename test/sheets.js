import test from 'ava'
import { Sheets } from '../src/sheets'

test.beforeEach(t => {
    t.context.sheets = new Sheets()
})

test('initial sheets', t => {
  t.true(t.context.sheets instanceof Sheets)
  t.true(t.context.sheets.ast === null)
  t.true(t.context.sheets.sheets instanceof Array)
  t.true(t.context.sheets.sheets.length === 0)
  t.true(t.context.sheets.cache instanceof Object)
})

test('add sheet', t => {
  t.context.sheets.add('a {}')
  t.true(t.context.sheets.sheets.length === 1)
})

test('toString', t => {
  t.context.sheets.add('a {}')
  t.true(t.context.sheets.toString() === 'a {}')
})

test('getCriticalCss should throw error if argument will be not equal object', t => {
  t.throws(() => t.context.sheets.getCriticalCss(undefined))
  t.throws(() => t.context.sheets.getCriticalCss([]))
  t.throws(() => t.context.sheets.getCriticalCss(1))
  t.throws(() => t.context.sheets.getCriticalCss(''))
})

test('getCriticalCss should throw error if one of the property {tag, id, class} will be not equal array', t => {
  t.throws(() => t.context.sheets.getCriticalCss({tag: [], id: [], class: undefined}))
  t.throws(() => t.context.sheets.getCriticalCss({tag: [], id: {}, class: []}))
  t.throws(() => t.context.sheets.getCriticalCss({tag: 1, id: [], class: []}))
})

test('getCriticalCss()', t => {
  const replaceSpaces = (str) => str.replace(/\s/g, '')
  const css = `
    @at-root {
      @-moz-viewport      { width: device-width }
      @-ms-viewport       { width: device-width }
      @-o-viewport        { width: device-width }
      @-webkit-viewport   { width: device-width }
      @viewport           { width: device-width }
    }
    * {}
    *::before {}
    ::-webkit-input-placeholder {}
    div {}
    span {}
    .a {}
    #b {}
    abbr[data-original-title] {}
    @media screen and (max-width:480px) {
      div {}
      span {}
      .a:hover {}
      input[type="search"] {}
      @media screen and (max-width:480px) {
        #b::before {}
        a {}
        ol, ul, dl {}
      }
    }
  `
  const resultCss = replaceSpaces(`
    @at-root {
      @-moz-viewport      { width: device-width }
      @-ms-viewport       { width: device-width }
      @-o-viewport        { width: device-width }
      @-webkit-viewport   { width: device-width }
      @viewport           { width: device-width }
    }
    * {}
    *::before {}
    ::-webkit-input-placeholder {}
    div {}
    .a {}
    #b {}
    abbr[data-original-title] {}
    @media screen and (max-width:480px) {
      div {}
      .a:hover {}
      input[type="search"] {}
      @media screen and (max-width:480px) {
        #b::before {}
        ol, ul, dl {}
      }
    }
  `)
  const selectors = {
    tag: ['div', 'abbr', 'ul', 'input', 'ul'],
    id: ['#b'],
    class: ['.a'],
  }
  t.context.sheets.add(css)
  t.true(replaceSpaces(t.context.sheets.getCriticalCss(selectors)) === resultCss)
})

test('generateSelectorsQuery()', t => {
  const selectorsString = t.context.sheets.getSelectorsString(['a', '#main', '.main'])
  t.true(selectorsString === 'a|#main|\\.main', 'getSelectorsString()' )
  const result = {
    tag: t.context.sheets.regexpTag('a'),
    id: t.context.sheets.regexpNamedSelectors('#main'),
    class: t.context.sheets.regexpNamedSelectors('\\.main'),
  }
  t.deepEqual(t.context.sheets.generateSelectorsQuery({tag: ['a'], id: ['#main'], class: ['.main']}), result)
})

// @at-root{@-moz-viewport{width:device-width}@-ms-viewport{width:device-width}@-o-viewport{width:device-width}@-webkit-viewport{width:device-width}@viewport{width:device-width}}*{}*::before{}::-webkit-input-placeholder{}.a{}#b{}@mediascreenand(max-width:480px){.a:hover{}@mediascreenand(max-width:480px){#b::before{}ol,ul,dl{}}}
// @at-root{@-moz-viewport{width:device-width}@-ms-viewport{width:device-width}@-o-viewport{width:device-width}@-webkit-viewport{width:device-width}@viewport{width:device-width}}*{}*::before{}::-webkit-input-placeholder{}div{}.a{}#b{}abbr[data-original-title]{}@mediascreenand(max-width:480px){div{}.a:hover{}input[type=\"search\"]{}@mediascreenand(max-width:480px){#b::before{}ol,ul,dl{}}}
