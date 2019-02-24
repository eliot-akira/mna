import { Component } from 'react'

const lifeCycleHooks = {
  didMount: 'componentDidMount',
  willUnmount: 'componentWillUnmount',
  shouldUpdate: 'componentShouldUpdate'
}

const withState = ({
  state = {},
  createState,
  actions = {},
  ...lifecycle
}) => C =>
  class StatefulComponent extends Component {

    constructor(props) {

      super(props)

      const self = this

      if (createState) {
        this.createState = (newProps = {}) => createState({
          self, ...props, ...newProps
        })
        this.state = this.createState()
      } else {
        this.state = state
      }

      this.setState = this.setState.bind(this)

      this.actions = Object.keys(actions).reduce((obj, key) => {
        obj[key] = (props) => actions[key]({
          ...this.getStateProps(),
          ...props
        })
        return obj
      }, {})

      Object.keys(lifecycle).forEach(key => {
        if (!lifeCycleHooks[key]) return
        this[ lifeCycleHooks[key] ] = (...args) => lifecycle[key]({
          ...this.getStateProps(),
          ...this.props
        }, ...args)
      })
    }

    getStateProps = () => ({
      self: this,
      state: this.state,
      actions: this.actions,
      setState: this.setState,
      createState: this.createState
    })

    render() {
      return <C {...{
        ...this.getStateProps(),
        ...this.props
      }} />
    }
  }

export default withState