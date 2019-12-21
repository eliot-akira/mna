export const $ = (el, sel) =>
  sel ? el.querySelector(sel) : document.querySelector(el)

export const $$ = (el, sel) =>
  Array.prototype.slice.call(
    sel ? el.querySelectorAll(sel) : document.querySelectorAll(el)
  )
