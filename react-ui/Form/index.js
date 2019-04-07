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

  render() {

    const { className, onValidate, onSubmit, children } = this.props

    return (
      <form className={className || ''} onSubmit={e => {

        e.preventDefault()

        const data = {
          ...this.state.fields,
          ...getFormData(e.target)
        }

        if (onValidate) {
          const invalidFields = onValidate(data)
          if (invalidFields) {
            this.setState({ invalidFields })
            return
          } else this.setState({ invalidFields: {} })
        }

        if (onSubmit) onSubmit(data)
      }}>{
          children instanceof Function ? children({
            ...this.state,
            setFields: fields => this.setState({ fields: {
              ...this.state.fields,
              ...fields
            } })
          }) : children
        }</form>
    )
  }
}
