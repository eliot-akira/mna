import isNumeric from './isNumeric'

export default function uniqueSlug({ items, slug, id = 0 }) {

  let i = 0, newSlug = slug

  Object.keys(items).forEach(key => {

    // Not self and duplicate slug

    if ((items[key].id !== id) && items[key].slug === newSlug) {

      if (i===0) slug = getBase(slug)
      i++
      newSlug = slug+'-'+(i+1)
    }
  })

  //console.log('unique slug', { slug, base: getBase(slug), newSlug })

  return newSlug
}

function getBase(slug) {

  let parts = slug.split('-')
  const lastPart = parts[parts.length - 1]

  if (parts.length>1 && isNumeric(lastPart)) {
    parts.pop()
  }

  return parts.join('-')
}
