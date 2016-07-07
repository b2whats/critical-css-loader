export default function(html, options = { tag: true, id: true, class: true}) {
  if (typeof html !== 'string') {
    throw new Error(
      `Expected the argument to be a string.`
    )
  }
  const selectors = {
    tag: new Set(),
    class: new Set(),
    id: new Set(),
  }

  const regexpTag = /<(?!\/)([\w]+)([^>]*)\/?>/g
  const regexpAttr = /(id|class)=(?:(?:["'](.*?)["'])|([\w-]+))/g
  const type = {
    'id': '#',
    'class': '.',
  }
  let resultTag
  let resultAttr

  while (resultTag = regexpTag.exec(html)) {
    if (resultTag[1] === '') continue
    selectors.tag.add(resultTag[1])

    while (resultAttr = regexpAttr.exec(resultTag[2])) {
      if (resultAttr[2] === '' || resultAttr[3] === '') continue

      (resultAttr[2] || resultAttr[3]).split(' ').forEach(selector => {
        if (selector === '') return false

        selectors[resultAttr[1]].add(type[resultAttr[1]] + selector)
      })
    }
  }

  return {
    ...options.tag && {tag: [...selectors.tag]},
    ...options.class && {class: [...selectors.class]},
    ...options.id && {id: [...selectors.id]},
  }
}
