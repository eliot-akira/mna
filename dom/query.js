export const $ = (el, sel) =>
  el ? el.querySelector(sel) : document.querySelector(el)

export const $$ = (el, sel) =>
  Array.prototype.slice.call(
    el ? el.querySelectorAll(sel) : document.querySelectorAll(el)
  )
