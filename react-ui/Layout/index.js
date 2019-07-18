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
      withHeader = true,
      location,
      menuTitle, menuItems, menuCenter, menuRoot,
      children,
      footer,
      onRouteEnter
    } = this.props

    const { isHeaderMenuOpen } = this.state

    const header = !withHeader ? null :
      <Header {...{
        menuTitle, menuCenter, menuRoot,
        menuItems,
        isHeaderMenuOpen,
        toggleHeaderMenu: this.toggleHeaderMenu,
        closeHeaderMenu: this.closeHeaderMenu,
      }} />

    return (
      <div className={`site site-layout-${type}${isHeaderMenuOpen ? ' is-header-menu-open' : ''}`}>
        { header /*type!=='standard' ? header : null*/ }
        <Body {...{
          location,
          onRouteEnter,
          footer: <Footer>{footer}</Footer>,
          //header: type==='standard' ? header : null
        }}>
          { children }
        </Body>
      </div>
    )
  }
}
