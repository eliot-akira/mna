import { Component } from 'react'

const lifeCycleHooks = {
  didMount: 'componentDidMount',
  willUnmount: 'componentWillUnmount',
  didUpdate: 'componentDidUpdate',
  shouldUpdate: 'componentShouldUpdate'
}

const withState = ({
  state = {},
  createState,
  actions = {},
  actionContext,
  withProps,
  ...lifecycle
}) => C => {

  class StatefulComponent extends Component {

    constructor(props) {

      super(props)

      const store = this

      // Pass static properties to store actions
      Object.keys(StatefulComponent).forEach(key => {
        store[key] = StatefulComponent[key]
      })

      if (createState) {
        this.createState = (newProps = {}) => createState({
          store, ...props, ...newProps
        })
        state = this.createState()
        this.state = state
      } else {
        this.state = state
      }

      const setState = this.setState.bind(this)

      this.setState = (newState, fn) => {
        Object.assign(state, newState)
        return setState(newState, fn)
      }

      this.actionContext = actionContext || {}
      this.actions = Object.keys(actions).reduce((obj, key) => {
        obj[key] = (props, ...args) => {
          const isPropsObject = typeof props==='object' && !Array.isArray(props)
          const allArgs = [props, ...args]
          return actions[key]({
            ...this.getStateProps(),
            args: allArgs,
            props,
            ...(isPropsObject ? props : {})
          }, ...(isPropsObject ? args : [props, ...args]))
        }
        return obj
      }, {})

      Object.keys(lifecycle).forEach(key => {
        if (!lifeCycleHooks[key]) return
        this[ lifeCycleHooks[key] ] = (...args) => lifecycle[key]({
          ...this.getStateProps(),
          withProps,
          ...this.props
        }, ...args)
      })
    }

    getStateProps = () => ({
      store: this,
      state: this.state,
      actions: this.actions,
      setState: this.setState,
      createState: this.createState,
      ...this.actionContext
    })

    render() {
      const props = {
        ...this.getStateProps(),
        ...this.props
      }
      return <C {...(withProps ? withProps(props) : props)} />
    }
  }  

  // Hoist static properties
  Object.keys(C).forEach(key => {
    StatefulComponent[key] = C[key]
  })

  return StatefulComponent
}

export default withState
