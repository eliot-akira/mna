import { Component } from 'react'
import getFormData from '@mna/dom/getFormData'

export default class Form extends Component {

  state = {
    fields: {},
    invalidFields: {}
  }

  constructor(props) {

    super(props)

    const { fields, onValidate } = props
    if (fields) this.state.fields = fields
  }

  componentDidMount() {
    this.mounted = true
  }

  getFormData = () => ({
    ...this.state.fields,
    ...(!this.el ? {} : getFormData(this.el))
  })

  onSubmit = e => {

    e && e.preventDefault()

    if (!this.el) return

    const { onValidate, onSubmit } = this.props

    const data = this.getFormData()

    if (onValidate) {
      const invalidFields = onValidate(data)
      if (invalidFields) {
        this.setState({ invalidFields })
        return
      }
      this.setState({ invalidFields: {} })
    }
    if (onSubmit) onSubmit(data)

  }

  onChange = e => {
    const { onChange, onValidate } = this.props
    if (!onChange) return
    const data = this.getFormData()
    onChange(data)
  }

  setFields = (fields, fn) => this.setState({
    fields: { ...this.state.fields, ...fields }
  }, fn)

  render() {

    const { id, className, fields = {}, onChange, onValidate, children, autoComplete = true } = this.props
    const validateOnRender = false //this.mounted && onChange && onValidate
    const invalidFields = validateOnRender
      ? onValidate({
        ...fields,
        ...this.state.fields
      }) || {}
      : this.state.invalidFields

    return (
      <form ref={el => this.el = el}
        id={id || ''}
        className={className || ''}
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        autoComplete={autoComplete ? 'true' : 'off'}
      >{
          children instanceof Function ? children({
            ...this.state,
            invalidFields,
            isValid: !Object.keys(invalidFields).length,
            setFields: this.setFields,
            submit: this.onSubmit
          }) : children
        }</form>
    )
  }
}
