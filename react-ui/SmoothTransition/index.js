import { Component } from 'react'

class SmoothTransition extends Component {

  constructor(props) {
    super(props)
    this.state = {
      location: this.props.location,
      fadeClassName: 'fade-enter',
    }
    this.pathname = this.props.location.pathname
  }

  componentDidMount() {
    //this.props.onRouteEnter && this.props.onRouteEnter(this.props.location)
    this.smoothEnter()
  }

  componentWillUpdate(newProps) {
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

    }, newProps.duration || 150) // Same as CSS transition duration
  }

  smoothEnter() {
    this.pageAssetsLoaded().then(() => {
      this.props.onRouteEnter && this.props.onRouteEnter(this.props.location)
      this.setState({
        fadeClassName: 'fade-enter fade-enter-active'
      })
    })
  }

  pageAssetsLoaded() {
    return new Promise((resolve, reject) => {

      if (!this.el) return resolve()

      // Set in react-client/load for async imported routes/chunks
      const asyncComponentsPromises = Array.prototype.slice.call(
        this.el.querySelectorAll('[data-async-component]') || []
      ).map(el => el.asyncLoadPromise)

      return Promise.all(asyncComponentsPromises)
        .then(() => {

          const imagePromises = Array.prototype.slice.call(
            this.el.querySelectorAll('img') || []
          )
            .map(img => new Promise((resolve, reject) => {

              if (img.complete) return resolve()
              let handler = () => {
                resolve()
                //img.onload = null
                //img.onerror = null
                img.removeEventListener('load', handler)
                img.removeEventListener('error', handler)
                handler = null
              }

              //img.onload = handler
              //img.onerror = handler
              img.addEventListener('load', handler)
              img.addEventListener('error', handler)

            }))

          // Other manually loaded assets
          const manualAsyncComponentsPromises = Array.prototype.slice.call(
            this.el.querySelectorAll('[data-async-component]') || []
          ).map(el => el.asyncLoadPromise)

          Promise.all([
            ...imagePromises,
            ...manualAsyncComponentsPromises
          ]).then(resolve)
        })
    })
  }

  render() {
    return (
      <div className={this.state.fadeClassName} ref={el => this.el = el}>
        {this.props.children(this.state.location)}
      </div>
    )
  }
}

export default SmoothTransition