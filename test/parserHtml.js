import test from 'ava'
import parserHtml from '../src/parserHtml'

const html = `
  <div id="id-1" class=class-1>
    <span id=id-2 class='class-2 class-3'>class id</span>
    <span id=' id-3 ' class=" class-4 class-5 "/>
    <span id="" class=""/>
    <span id= class=/>
    <i id class/>
    <b/>
    <a>
  </div>
`

const results = {
  tag: ['div', 'span', 'i', 'b', 'a'],
  id: ['#id-1','#id-2', '#id-3'],
  class: ['.class-1', '.class-2', '.class-3', '.class-4', '.class-5'],
}

test('function should throw error if argument will be not equal string', t => {
  t.throws(() => parserHtml(1))
  t.throws(() => parserHtml([]))
  t.throws(() => parserHtml({}))
  t.throws(() => parserHtml(null))
  t.throws(() => parserHtml(undefined))
})

test('parse all selectors from html string with default options', t => {
  t.deepEqual(parserHtml(html), results)
})

test('parse classes from html string with options = { tag: false, class: true, id: false }', t => {
  t.deepEqual(parserHtml(html, { tag: false, class: true, id: false }).class, results.class)
})

test('parse ids from html string with options = { tag: false, class: false, id: true }', t => {
  t.deepEqual(parserHtml(html, { tag: false, class: false, id: true }).id, results.id)
})

test('parse tags from html string with options = { tag: true, class: false, id: false }', t => {
  t.deepEqual(parserHtml(html, { tag: true, class: false, id: false }).tag, results.tag)
})
