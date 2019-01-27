import { Component } from '@mna/react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'

export default class Layout extends Component {

  state = {
    isHeaderMenuOpen: false
  }

  closeHeaderMenu = () => this.setState({
    isHeaderMenuOpen: false
  })

  toggleHeaderMenu = () => this.setState({
    isHeaderMenuOpen: !this.state.isHeaderMenuOpen
  })

  render() {
    const {
      type = 'standard',
      location,
      menuTitle, menuItems,
      children,
      footer
    } = this.props

    const { isHeaderMenuOpen } = this.state

    return (
      <div className={`site site-layout-${type}${isHeaderMenuOpen ? ' is-header-menu-open' : ''}`}>
        <Header {...{
          menuTitle,
          menuItems,
          isHeaderMenuOpen,
          toggleHeaderMenu: this.toggleHeaderMenu,
          closeHeaderMenu: this.closeHeaderMenu,
        }} />
        <Body {...{ location }}>{ children }</Body>
        <Footer>{footer}</Footer>
      </div>
    )
  }
}