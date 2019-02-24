import { Component } from '@mna/react'
import getFormData from '@mna/dom/getFormData'

export default class LoginForm extends Component {

  state = {
    formData: {
      name: '',
      password: ''
    },
    invalidFields: {},
    resultMessage: ''
  }

  onSubmit(e) {

    const { actions } = this.props

    e.preventDefault()

    const formData = getFormData(this.el)
    const invalid = {}

    Object.keys(formData).forEach(key => {
      if (!formData[key]) invalid[key] = true
    })

    this.setState({ formData, invalidFields: invalid, resultMessage: '' })

    if (!Object.keys(invalid).length) {
      actions.login({ data: formData })
        .then(result => {
          if (!result) {
            this.setState({ resultMessage: 'Failed' })
            return
          }
          // Redirects on success
          //this.setState({ resultMessage: 'Success!' })
        })
    }

  }

  render() {

    const { formData, invalidFields, resultMessage } = this.state

    return (
      <form
        style={{ maxWidth: '360px' }}
        ref={el => this.el = el}
        onSubmit={e => this.onSubmit(e)}
      >

        <input type="text" name="name" placeholder="User name"
          className={invalidFields.name ? 'is-error' : ''}
          defaultValue={formData.name}
        />

        <input type="password" name="password" placeholder="Password"
          className={invalidFields.password ? 'is-error' : ''}
          defaultValue={formData.password}
        />

        <button type="submit" className="btn bg-blue color-white">Login</button>

        <div>{resultMessage}</div>
      </form>
    )
  }
}
