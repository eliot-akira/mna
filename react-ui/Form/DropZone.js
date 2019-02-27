import { Component } from 'react'

export default class Dropzone extends Component {

  componentDidMount() {

    const { onFiles, onDragOver, onDragLeave } = this.props
    const el = this.el

    this.handleDragover = (e) => {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      //console.log('OVER', e.target)
      this.el.classList.add('active')
      if (onDragOver) onDragOver(e)
    }

    this.handleDragleave = (e) => {
      this.el.classList.remove('active')
      if (onDragLeave) onDragLeave(e)
    }

    this.dropped = (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.handleDragleave()
      //console.log('DROPEED', e.target)
      onFiles(e.dataTransfer.files)
    }

    el.addEventListener('dragenter', this.handleDragover, false)
    el.addEventListener('dragover', this.handleDragover, false)
    el.addEventListener('dragleave', this.handleDragleave, false)
    el.addEventListener('drop', this.dropped, false)

    this.elementReady = true
  }

  componentWillUnmount() {

    if (!this.elementReady || ! this.el) return

    const el = this.el

    el.removeEventListener('dragenter', this.handleDragover)
    el.removeEventListener('dragover', this.handleDragover)
    el.removeEventListener('dragleave', this.handleDragleave, false)
    el.removeEventListener('drop', this.dropped)
  }

  render() {
    let { children } = this.props
    return (
      <div className="dropzone" ref={el => this.el = el}>{ children }</div>
    )
  }
}
