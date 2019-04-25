import { Component } from 'react'
import getFormData from '@mna/dom/getFormData'

export default class Form extends Component {

  state = {
    fields: {},
    invalidFields: {}
  }

  constructor(props) {
    super(props)
    this.state.fields = props.fields || {}
  }

  onSubmit = e => {

    e && e.preventDefault()

    if (!this.el) return

    const { onValidate, onSubmit } = this.props

    const data = {
      ...this.state.fields,
      ...getFormData(this.el)
    }

    if (onValidate) {
      const invalidFields = onValidate(data)
      if (invalidFields) {
        this.setState({ invalidFields })
        return
      } else this.setState({ invalidFields: {} })
    }

    if (onSubmit) onSubmit(data)

  }

  setFields = fields => this.setState({
    fields: { ...this.state.fields, ...fields }
  })

  render() {

    const { className, children } = this.props

    return (
      <form ref={el => this.el = el} className={className || ''} onSubmit={this.onSubmit}>{
        children instanceof Function ? children({
          ...this.state,
          setFields: this.setFields,
          submit: this.onSubmit
        }) : children
      }</form>
    )
  }
}
