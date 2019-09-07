"use strict"

import React from 'react'
import ScrollElement from './mixins/scroll-target'
import scroller from './mixins/scroller'
import PropTypes from 'prop-types'

class ElementWrapper extends React.Component{
  componentDidMount() {

    const target = window.location.hash.substring(1)
    if (!target) return

    const { name } = this.props
    if (target!==name) return

    scroller.scrollTo(target, {
      containerId: 'content',
      offset: -45
    })
  }

  render() {
    // Remove `parentBindings` from props
    const {
      parentBindings,
      tag = 'div',
      ...tagProps
    } = this.props

    const Tag = tag

    return (
      <Tag {...tagProps} ref={(el) => { this.props.parentBindings.domNode = el }}>
        {this.props.children}
      </Tag>
    )
  }
}

ElementWrapper.propTypes = {
  name: PropTypes.string,
  id:   PropTypes.string
}

export default ScrollElement(ElementWrapper)
