const assert = require('assert').strict

const assertHelpers = {
  is(a, b) {
    try {
      assert.deepStrictEqual(a, b)
      return true
    } catch(e) {
      return e
    }
  },
  throws(fn) {
    try {
      fn()
      return false
    } catch(e) {
      return true
    }
  }
}

const tester = (title, reporter) => {

  if (!reporter && typeof title!=='string') {
    reporter = title
    title = ''
  }

  // Default reporter
  if (typeof reporter==='undefined') {
    reporter = console.log //tester.reporter
  }

  let tests = []
  let createTestPromises = []
  const emitEvent = e => {
    if (reporter) reporter(e)
  }

  const test = (title, testCallback) => {

    if (!testCallback) {
      testCallback = title
      title = ''
    }

    const currentTest = {
      id: tests.length + 1,
      title,
      assertions: [],
      passes: 0, fails: 0,
      ...test.current
    }

    tests.push(currentTest)

    // Main function passed to test: assert ok
    const it = (title, ok, ...logOnFail) => {

      const assertion = {
        testId: currentTest.id,
        id: currentTest.assertions.length + 1,
        title,
        ok,
        // For reporter when assertion fails
        logOnFail
      }

      currentTest.assertions.push(assertion)

      if (ok) {
        if (ok instanceof Error) {
          currentTest.fails++
          assertion.ok = false
          if (ok.message) assertion.logOnFail.push(ok.message)
        } else {
          currentTest.passes++
        }
      } else {
        currentTest.fails++
      }

      emitEvent({ type: 'assertion', ...assertion })
    }

    Object.assign(it, assertHelpers)

    const createPromise = () => new Promise((resolve, reject) => {

      emitEvent({ type: 'test', state: 'start', ...currentTest })

      const done = (error) => {
        const result = {
          type: 'test',
          state: error ? 'error' : 'end',
          ...currentTest
        }
        if (error) result.error = error
        emitEvent(result)
        resolve()
      }

      const doneWithError = error => {
        console.log(error)
        currentTest.fails++
        done(error)
      }

      try {

        const result = testCallback(it)

        if (result instanceof Promise) {
          result.then(done).catch(doneWithError)
          return
        }

        done()

      } catch (error) {
        doneWithError(error)
      }
    })

    createTestPromises.push(createPromise)
  }

  test.setup = fn => createTestPromises.push(() => new Promise(async (resolve, reject) => {
    try {
      await fn()
      resolve()
    } catch(e) {
      reject(e)
    }
  }))

  test.all = async () => {

    emitEvent({ type: 'tests', state: 'start', title })

    for (const p of createTestPromises) {
      try {
        await p()
      } catch (e) {
        //
      }
    }

    const result = {
      tests, passes: 0, fails: 0
    }

    tests.forEach(t => {
      if (t.fails) result.fails++
      else result.passes++
    })

    emitEvent({ type: 'tests', state: 'end', ...result })

    // Clear all tests
    tests = []
    createTestPromises = []

    return result
  }

  // For passing fields into current test(s)
  // These are merged into reporter event object

  test.current = {}
  test.setCurrent = obj => Object.assign(test.current, obj)

  return test
}

module.exports = tester
