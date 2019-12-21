"use strict"

import React from 'react'
import ScrollElement from './mixins/scroll-target'
import scroller from './mixins/scroller'
import PropTypes from 'prop-types'
import { setImmediate } from 'core-js'

let Target

class ElementWrapper extends React.Component{
  componentDidMount() {

    const target = window.location.hash.substring(1)
    if (!target) return

    const { name } = this.props
    if (target!==name) return

    scroller.scrollTo(target, {
      containerId: 'content',
      offset: Target.offset
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

Target = ScrollElement(ElementWrapper)
Target.offset = -45

export default Target
