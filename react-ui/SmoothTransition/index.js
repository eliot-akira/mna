import { Component } from 'react'

class SmoothTransition extends Component {

  constructor(props) {
    super(props)
    this.state = {
      location: props.location,
      fadeClassName:
        'fade-enter'
    }
    this.pathname = props.location.pathname
  }

  componentDidMount() {
    this.smoothEnter()
  }

  componentDidUpdate() {
  //componentWillUpdate(newProps) {
    const newProps = this.props
    if (this.pathname===newProps.location.pathname) return

    this.pathname = newProps.location.pathname
    this.setState({
      fadeClassName: 'fade-exit fade-exit-active'
    })

    setTimeout(() => {
      this.setState({
        location: newProps.location,
        fadeClassName: 'fade-enter'
      }, this.smoothEnter)
    }, newProps.duration || 360) // Same as CSS transition duration
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  smoothEnter() {

    this.asyncComponentsLoaded()
      .then(() => {

        this.props.onRouteEnter && this.props.onRouteEnter(this.props.location)

        return this.pageAssetsLoaded()
      })
      .then(() => {

        if (!this.unmounted) this.setState({
          fadeClassName: 'fade-enter fade-enter-active'
        })
      })
  }

  createImagePromise = img => new Promise((resolve, reject) => {

    if (img.complete) return resolve()
    let handler = () => {
      resolve()
      img.removeEventListener('load', handler)
      img.removeEventListener('error', handler)
      handler = null
    }

    img.addEventListener('load', handler)
    img.addEventListener('error', handler)

  })

  asyncComponentsLoaded = () => {
    return new Promise((resolve, reject) => {

      if (!this.el) return resolve()

      // Set in react-client/load for async imported routes/chunks
      const asyncComponentsPromises = Array.prototype.slice.call(
        this.el.querySelectorAll('[data-async-component]') || []
      )
        .map(el => el.asyncLoadPromise)
        .filter(p => p) // Make sure a promise exists

      return Promise.all(asyncComponentsPromises).then(resolve).catch(e => {
        // Allow route to load, even if a promise fails
        console.log(e)
        resolve()
      })
    })
  }

  pageAssetsLoaded = () => {
    return new Promise((resolve, reject) => {

      if (!this.el) return resolve()

      const imagePromises = Array.prototype.slice.call(
        this.el.querySelectorAll('img') || []
      )
        .map(this.createImagePromise)

      // Manually loaded assets

      const manualAsyncComponentsPromises = Array.prototype.slice.call(
        this.el.querySelectorAll('[data-async-component]') || []
      ).map(el => el.asyncLoadPromise)

      Promise.all([
        ...imagePromises,
        ...manualAsyncComponentsPromises
      ]).then(resolve).catch(e => {
        // Allow route to load, even if a promise fails
        console.log(e)
        resolve()
      })
    })
  }

  render() {
    return (
      <div className={`smooth-transition ${this.state.fadeClassName} ${this.props.className || ''}`} ref={el => this.el = el}>
        {this.props.children(this.state.location)}
      </div>
    )
  }
}

export default SmoothTransition
