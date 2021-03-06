import { Component } from 'react'
import withRouteData from './withRouteData'

const lifeCycleHooks = {
  didMount: 'componentDidMount',
  willUnmount: 'componentWillUnmount',
  shouldUpdate: 'shouldComponentUpdate',
  didUpdate: 'componentDidUpdate'
}

const withState = ({
  state = {},
  createState,
  actions = {},
  actionContext,
  withProps,
  withRouteData: routeDataProvider,
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
        //if (!lifeCycleHooks[key]) return
        this[ lifeCycleHooks[key] || key ] = (...args) => lifecycle[key]({
          ...this.getStateProps(),
          withProps,
          ...this.props
        }, ...args)
      })
    }

    getStateProps = () => ({
      ...this.props,
      store: this,
      state: this.state,
      actions: this.actions,
      setState: this.setState,
      createState: this.createState,
      ...this.actionContext,
      // Was: ...this.props,
    })

    render() {
      const props = {
        ...this.getStateProps(),
        ...this.props
      }
      return <C {...{
        ...props,
        ...(withProps ? withProps(props) : {}),
      }} />
    }
  }

  // Hoist static properties
  Object.keys(C).forEach(key => {
    StatefulComponent[key] = C[key]
  })

  if (routeDataProvider) {
    return withRouteData(routeDataProvider)(StatefulComponent)
  }

  return StatefulComponent
}

export default withState
