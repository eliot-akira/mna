/**
 * A simple password generator
 */

/**
 * This function generates an array of the given length filled with random integers
 * in between the given minimum and maximum values. It is exported for testing purposes
 * only.
 *
 * @see https://stackoverflow.com/a/42321673/931860
 *
 * @param {Integer} length How many elements should the array include
 * @param {Integer} min The minimum bound of the random number
 * @param {Integer} max The maximum bound of the random number
 *
 * @return {Integer} An array full of random integers between the given min and max
 */
export const randArray = (length, min, max) => {

  const crypto = typeof window !== 'undefined' && (window.crypto || window.msCrypto)
  const hasCrypto = (crypto && crypto.getRandomValues)
  const array = new Array(length).fill(0)
  let randomValues

  if (hasCrypto) {

    randomValues = new Uint32Array(length)

    crypto.getRandomValues(randomValues)
  }

  return array.map((num, i) => {

    // Here's the magic. I'm not sure how this works, but it takes the
    // random 32 bit unsigned integer we just generated and makes it into
    // a (hopefully) random floating point number between 0 and 1 (like
    // you get from Math.random)
    const float = hasCrypto
      ? (randomValues[i] / (0xffffffff + 1))
      : Math.random()

    return (Math.floor(float * (max - min + 1)) + min)
  })
}

/**
* This function returns a string of characters to use to generate passwords. It is exported for
* testing purposes only.
*
* @param {Boolean} includeSpecials Whether or not to include special characters
*
* @return {String} A string containing all of the characters in the dictionary
*/
export const getDictionary = (includeSpecials = true) => {

  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = lower.toUpperCase()
  const numbers = '0123456789'
  const specials = '/*-+.~`!@#$%^&()[]{}<>?|:;'

  let dictionary = lower + upper + numbers

  if (includeSpecials) { dictionary += specials }

  return dictionary
}

/**
* This function generates a random password of a given length and returns it.
*
* @param {Integer} length How long of a password should we generate
* @param {Boolean} includeSpecials Whether or not to include special characters
*
* @return {String} The generated password
*/
export default (length = 15, includeSpecials = false) => {

  const dictionary = getDictionary(includeSpecials)
  let password = ''

  // Make sure the generated password has at least 1 number since many sites require that
  while (password.replace(/[^0-9]/g, '').length < 1) {

    password = randArray(length, 0, (dictionary.length - 1))
      .map(index => (dictionary.charAt(index)))
      .join('')
  }

  return password
}
