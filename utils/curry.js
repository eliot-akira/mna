/**
 * Function to curry any javascript method
 * @param   {Function}  f - the target function we want to curry
 * @param   {...[args]} args - initial arguments
 * @returns {Function|*} it will return a function until the target function
 *                       will receive all of its arguments
 */
// https://sunjay.dev/2016/08/13/es6-currying
export default function curry(f, ...args) {
  return args.length >= f.length
    ? f(...args)
    : (...next) => curry(f, ...args, ...next)
}

//https://github.com/GianlucaGuarini/curri
/*export default function curry(fn, ...acc) {
  return (...args) => {
    args = [...acc, ...args]

    return args.length < fn.length
      ? curry(fn, ...args)
      : fn(...args)
  }
}
*/
