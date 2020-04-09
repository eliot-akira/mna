import promiseQueue from './promiseQueue'

test('promiseQueue', async it => {

  it('exists', promiseQueue)

  const createPromises = []
  const numberOfPromises = 10
  const concurrentLimit = 3
  let numberFinished = 0

  const getBatchNumber = (i: number) => Math.ceil(i / concurrentLimit)

  const pushPromiseCreator = (index: number) => {

    const batchNumber = getBatchNumber(index+1)

    // Chaos monkey: test that promises don't run before their batch, regardless of execution time
    const waitDuration = 100 / (Math.random() * 10)

    createPromises.push(() => new Promise((resolve, reject) => {

      const done = () => {
        numberFinished++
        resolve(index)

        const currentBatch = getBatchNumber(numberFinished)

        it(`runs promise #${index+1} in queue`, true)
        it(`runs promise #${index+1} in batch ${batchNumber}`, currentBatch===batchNumber, { index, currentBatch, batchNumber })

      }

      setTimeout(done, waitDuration)
    }))

  }

  for (let i=0, len=numberOfPromises; i < len; i++) {
    pushPromiseCreator(i)
  }

  const results = await promiseQueue(createPromises, concurrentLimit)

  it('runs all promises in queue', numberFinished===numberOfPromises, { numberFinished, numberOfPromises })

  it('returns all promise results', results.length===numberOfPromises)

  it('results are in order', it.is(results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), { results  })
})
