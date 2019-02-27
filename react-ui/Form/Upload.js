import { Component } from 'react'
import DropZone from './DropZone'

export default class FilesUpload extends Component {
  render() {

    const {
      onFile, onFiles,
      children,
      className = '',
      Button = 'button',
      extensions = []
    } = this.props

    // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications

    return (
      <DropZone
        onFiles={files => !files.length ? null :
          onFiles ? onFiles(files) : onFile(files[0])
        }
        onDragOver={() => this.button && this.button.classList.add('active')}
        onDragLeave={() => this.button && this.button.classList.remove('active')}
      >
        <Button type="button" className={`btn ${className}`}
          ref={el => this.button = el}
          onClick={() => this.input.click()}
        >
          <input type='file' name='upload' hidden={true} multiple={onFile ? false : true}
            ref={el => this.input = el}
            onChange={e => {
              if (e.target.files.length) {
                if (onFiles) onFiles(e.target.files)
                if (onFile) onFile(e.target.files[0])
              }
              if (this.input) this.input.value = null
            }}
          />
          {children || 'Upload'}
        </Button>
      </DropZone>
    )
  }
}
