import React from 'react'
import ScrollLink from './mixins/scroll-link'

class LinkElement extends React.Component {
  render = () => (<a {...this.props}>{this.props.children}</a>)
}

const Link = ScrollLink(LinkElement)

export default (props) => <Link {...{
  activeClass: 'active',
  spy: true,
  smooth: 'easeInOutQuad',
  duration: 300,
  containerId: 'content',
  ...props
}} />
