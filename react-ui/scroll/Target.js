"use strict"

import React from 'react'
import ScrollElement from './mixins/scroll-target'
import PropTypes from 'prop-types'

class ElementWrapper extends React.Component{
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
