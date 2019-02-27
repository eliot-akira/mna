// global: FileReader

// Read files from input field or drag-and-drop

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader#Methods
const readerMethods = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  url:    'readAsDataURL',
  text:   'readAsText',
  json:   'readAsText'
}

//const files = e.dataTransfer.files // From file input field
//const files = e.target.files // From drag-and-drop

function readFiles({
  type = 'buffer',
  files = [],
  extensions = [],
  onStart, onLoadFile, onComplete, onError,
  getExtensionType
}) {

  const filteredFiles = Array.prototype.slice.call(files)
    .map(file => {
      const parts = file.name.split('.')
      file.extension = (parts[ parts.length - 1 ] || '').toLowerCase()
      return file
    })
    .filter(file => {
      // Check file extension
      return !extensions.length || extensions.indexOf(file.extension) >= 0
    })

  const numFiles = filteredFiles.length
  if (!numFiles) return

  onStart && onStart()

  const results = []
  let done = 0

  return Promise.all(filteredFiles.map(file => new Promise((resolve, reject) => {

    const reader = new FileReader()
    const method = readerMethods[type] || readerMethods.text

    reader.onload = function(e) {

      const data = e.target.result
      const result = {
        file,
        data: type==='json' ? JSON.parse(data) : data
      }

      results.push(result)
      onLoadFile && onLoadFile(result)

      done++
      if (done===numFiles && onComplete) onComplete(results)
      resolve(result)
    }

    reader.onerror = e => {
      if (onError) onError()
      reject(e)
    }

    reader[method](file)
    
  })))
}

export default readFiles