// global: FileReader

// Read files from input field or drag-and-drop

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader#Methods
const readerMethods = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  url:    'readAsDataURL',
  text:   'readAsText'
}

//const files = e.dataTransfer.files // From file input field
//const files = e.target.files // From drag-and-drop

function readFiles(props) {

  const {
    type = 'buffer',
    files,
    extensions = [],
    onStart, onLoad, onComplete, onError
  } = props

  if (!files || !files.length) return

  const buffers = []
  const filtersFiles = Array.prototype.slice.call(files)
    .map(file => {
      const parts = file.name.split('.')
      file.extension = (parts[ parts.length - 1 ] || '').toLowerCase()
      return file
    })
    .filter(file => {
      // Check file extension
      return !extensions.length || extensions.indexOf(file.extension) >= 0
    })

  const numFiles = filtersFiles.length

  if (!numFiles) return
  onStart && onStart()

  let done = 0

  filtersFiles.forEach(file => {

    const reader = new FileReader()
    const method = readerMethods[type] || readerMethods.text

    reader.onload = function(e) {

      const data = e.target.result
      const result = { file, data }

      buffers.push(result)
      onLoad && onLoad(result)

      done++
      if (done===numFiles && onComplete) onComplete(buffers)
    }

    if (onError) reader.onerror = onError

    reader[method](file)

  })
}

export default readFiles