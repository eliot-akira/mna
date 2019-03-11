import { Component } from 'react'
import getFormData from '@mna/dom/getFormData'

export default class Form extends Component {

  state = {
    invalidFields: {}
  }

  render() {

    const { children, onValidate, onSubmit } = this.props

    return (
      <form onSubmit={e => {
        e.preventDefault()
        const data = getFormData(e.target)
        if (onValidate) {
          const invalidFields = onValidate(data)
          if (invalidFields) {
            this.setState({ invalidFields })
            return
          } else this.setState({ invalidFields: {} })
        }
        if (onSubmit) onSubmit(data)
      }}>{
          children instanceof Function ? children(this.state) : children
        }</form>
    )
  }
}
