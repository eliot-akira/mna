import { Component } from 'react'

const withState = ({
  state = {}, createState, actions = {},
  didMount, willUnmount, shouldUpdate
}) => C =>
  class StatefulComponent extends Component {

    constructor(props) {
      super(props)
      const self = this
      if (createState) {
        this.createState = () => createState({ self, ...props })
        this.state = this.createState()
      } else {
        this.state = state
      }
      this.setState = this.setState.bind(this)
      this.actions = Object.keys(actions).reduce((obj, key) => {
        obj[key] = (props) => actions[key]({
          self, ...props
        })
        return obj
      }, {})
      if (didMount) this.componentDidMount = () => didMount({ self, ...this.props })
      if (willUnmount) this.componentWillUnmount = () => willUnmount({ self, ...this.props })
      if (shouldUpdate) this.componentShouldUpdate = (nextProps) => shouldUpdate({
        self, ...this.props
      }, nextProps)
    }

    render() {
      return <C {...{ self: this, ...this.props }} />
    }
  }

export default withState