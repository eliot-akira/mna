import { Component } from 'react'
import ScrollLink from './mixins/scroll-link'

class LinkElement extends Component {
  render() {
    return <a {...this.props}>{this.props.children}</a>
  }
}

const Link = ScrollLink(LinkElement)

export default ({ offset, ...props }) => <Link {...{
  activeClass: 'active',
  spy: true,
  smooth: 'easeInOutQuad',
  duration: 300,
  containerId: 'content',
  ...props,
  offset: offset ? (0 - offset) : 0 // Negative is above the anchor, positive is below
}} />
