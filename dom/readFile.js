import readFiles from './readFiles'

export default async function readFile({ file, ...props }) {

  const results = await readFiles({
    files: [file],
    ...props
  })

  return results ? results[0] : null
}