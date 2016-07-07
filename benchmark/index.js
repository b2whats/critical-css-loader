import parserHtml from '../src/parserHtml'
import sheets from '../src/sheets'
import fs from 'fs'
import path from 'path'

const text = fs.readFileSync(path.join(__dirname, 'html'), 'utf8')
const css = fs.readFileSync(path.join(__dirname, 'css'), 'utf8')

console.time('parse')
const selectors = parserHtml(text)
console.timeEnd('parse')

console.time('add')
sheets.add(css)
console.timeEnd('add')

console.time('getCriticalCss-init')
const critical = sheets.getCriticalCss(selectors)
console.timeEnd('getCriticalCss-init')

console.time('getCriticalCss-no-cache')
sheets.getCriticalCss({...selectors, tag: [...selectors.tag, 'new']})
console.timeEnd('getCriticalCss-no-cache')

console.time('getCriticalCss-cache')
sheets.getCriticalCss(selectors)
console.timeEnd('getCriticalCss-cache')
