
const debounce = (fn, duration) => {

  let timer = null

  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, duration)
  }
}

export default debounce