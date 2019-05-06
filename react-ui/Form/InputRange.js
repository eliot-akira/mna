import { Component } from 'react'

export default class InputRange extends Component {
  componentDidMount() {

    let initDone
    let previousValue
    const fn = this.props.onChange

    const onInput = function(e){
      initDone = true
      const { value } = e.target
      if (value != previousValue) fn && fn(value)
      previousValue = value
    }

    const onChange = function(e){
      if (!initDone) fn(e.target.value)
    }

    this.el.addEventListener('input', onInput)
    this.el.addEventListener('change', onChange)
    this.unsubscribers = [
      () => this.el.removeEventListener('input', onInput),
      () => this.el.removeEventListener('change', onChange),
    ]
  }

  componentWillUnmount() {
    this.unsubscribers.forEach(f => f())
  }

  render() {
    return (
      <input type="range"
        {...this.props}
        onChange={e => {}}
        ref={el => this.el = el}
      />
    )
  }
}
