
type PromiseCreator = () => Promise<any>

export default async function promiseQueue(promiseCreators: PromiseCreator[], limit:number = 1) {

  const results = []
  const queue = []

  for (let i=0, len=promiseCreators.length; i < len; i++) {

    queue.push(promiseCreators[i])

    const isLastItemInBatch = (i+1) % limit === 0
    const isLastItem = i===len-1

    if (!isLastItemInBatch && !isLastItem) continue

    const promises = queue.map(fn => fn())

    // Run batch in parallel
    results.push(...await Promise.all(promises))

    // Empty queue
    queue.splice(0)
  }

  // Results are in order!
  return results
}
