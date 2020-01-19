import { Component } from 'react'
import { withRouter } from "react-router"
import animateScroll from '../Scroll/animateScroll'

class ScrollTop extends Component {

  containerId = this.props.containerId || 'content'
  activeClass = 'is-active'
  showAboveY = 70

  state = { isActive: false }

  constructor(props) {
    super(props)
    this.pathname = props.location.pathname
    this.location = props.location
  }

  componentDidMount() {
    // Show if scrolled down
    this.container = document.querySelector(`#${this.containerId}`)
    if (!this.container) return
    this.container.addEventListener('scroll', this.scrollHandler.bind(this))
    this.scrollHandler()
  }

  componentWillUnmount() {
    if (!this.container) return
    this.container.removeEventListener('scroll', this.scrollHandler.bind(this))
  }

  componentDidUpdate() {
    //componentWillUpdate(newProps) {
    const props = this.props
    if (
      // Allow overriding current location
      props.pathname ? (props.pathname !== this.pathname)
        // From router directly
        : (props.location !== this.location)
    ) {
      this.container.scrollTop = 0
      this.pathname = props.location.pathname
      this.location = props.location
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
    delay: 0,
    smooth: 'easeInOutQuad'
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
