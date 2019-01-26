import { Component } from 'react'
import { withRouter } from "react-router"
import animateScroll from '../scroll/mixins/animate-scroll'

class ScrollTop extends Component {

  containerId = this.props.containerId || 'content'
  activeClass = 'is-active'
  showAboveY = 70

  state = { isActive: false }

  componentDidMount() {
    // Show if scrolled down
    this.container = document.querySelector(`#${this.containerId}`)
    this.container.addEventListener('scroll', this.scrollHandler.bind(this))
    this.scrollHandler()
  }

  componentWillUnmount() {
    if (!this.container) return
    this.container.removeEventListener('scroll', this.scrollHandler.bind(this))
  }

  componentWillUpdate(newProps) {
    if (
      // Allow overriding current location
      this.props.pathname ? (this.props.pathname !== newProps.pathname)
        // From router directly
        : (this.props.location !== newProps.location)
    ) {
      this.container.scrollTop = 0
    }
  }

  scrollHandler() {
    const y = this.container.scrollTop

    if (y > this.showAboveY) {
      if (!this.state.isActive) {
        //this.el.classList.add(this.activeClass)
        this.setState({ isActive: true })
      }
    } else {
      if (this.state.isActive) {
        //this.el.classList.remove(this.activeClass)
        this.setState({ isActive: false })
      }
    }
  }

  scrollToTop = () => animateScroll.scrollToTop({
    containerId: this.containerId,
    duration: 300,
    delay: 0
  })

  render() {

    return <div
      className={`scroll-top${this.state.isActive ? ` ${this.activeClass}` : ''}`}
      ref={el => this.el = el}
      onClick={this.scrollToTop}
    ><span /></div>
  }
}

export default withRouter(ScrollTop)