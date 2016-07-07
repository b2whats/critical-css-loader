import postcss from 'postcss'
import { isObject, compose } from './utils'

class Sheets {
  constructor() {
    this.sheets = []
    this.ast = null
    this.cache = new Map()
  }

  add(sheet) {
    this.sheets.push(sheet)
  }

  walkRules(selectorsQuery) {
    console.time('clone')
    const critical = this.ast.clone()
    console.timeEnd('clone')

    console.time('walk')
    const { tag, id, class: classes } = selectorsQuery
    critical.walkRules(rule => {
      if(rule.selector.startsWith('*')) return null
      if(rule.selector.startsWith('::')) return null
      if(classes && classes.test(rule.selector)) return null
      if(id && id.test(rule.selector)) return null
      if(tag && tag.test(rule.selector)) return null

      rule.remove()
    })

    critical.walkAtRules(atRule => {
      if (atRule.nodes.length === 0) atRule.remove()
    })
    console.timeEnd('walk')

    return critical
  }

  createAST(stringSheets) {
    console.time('create')
    this.ast = postcss.parse(stringSheets)
    console.timeEnd('create')
  }

  getCriticalCss(selectors) {
    if (!isObject(selectors)) {
      throw new Error(
        `Expected the argument to be a object with property {id: [], class: [], tag: []}.`
      )
    }
    Object.keys(selectors).forEach(key => {
      if (['id', 'tag', 'class'].includes(key) && !Array.isArray(selectors[key])) {
        throw new Error(
          `Property ${key} must be an array.`
        )
      }
    })
    const hash = this.getHash(selectors)

    if (this.checkCache(hash)) return this.getCache(hash)
    if (this.ast === null) this.createAST(this.toString())

    const selectorsQuery = this.generateSelectorsQuery(selectors)
    const critical = this.walkRules(selectorsQuery)
    console.time('toString')
    const criticalToString = critical.toString()
    console.timeEnd('toString')
    this.setCache(hash, criticalToString)

    return criticalToString
  }

  generateSelectorsQuery(selectors) {
    return {
      ...selectors.id && {id: compose(this.regexpNamedSelectors, this.getSelectorsString)(selectors.id)},
      ...selectors.class && {class: compose(this.regexpNamedSelectors, this.getSelectorsString)(selectors.class)},
      ...selectors.tag && {tag: compose(this.regexpTag, this.getSelectorsString)(selectors.tag)},
    }
  }

  getSelectorsString(selectors) {
    return selectors.join('|').replace(/([\.])/g, '\\$1')
  }

  regexpTag(str) {
    return new RegExp(`(,|^)[^\\.#,]*?([^\\w\\.#-]|\\b)(${str})(?=[^\\w\\.#-]|$)[^\\.#]*?(?=,|$)`)
  }

  regexpNamedSelectors(str) {
    return new RegExp(`(${str})\\b`)
  }

  getHash(value) {
    return JSON.stringify(value)
  }

  setCache(id, value) {
    this.cache.set(id, value)
  }

  getCache(id) {
    return this.cache.get(id)
  }

  checkCache(id) {
    return this.cache.has(id)
  }

  toString() {
    return this.sheets.join('\r\n')
  }
}

const sheets = new Sheets()

export { Sheets }
export default sheets
