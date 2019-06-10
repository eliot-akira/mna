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
      menuTitle, menuItems, menuCenter,
      children,
      footer,
      onRouteEnter
    } = this.props

    const { isHeaderMenuOpen } = this.state

    return (
      <div className={`site site-layout-${type}${isHeaderMenuOpen ? ' is-header-menu-open' : ''}`}>
        { !withHeader ? null :
          <Header {...{
            menuTitle, menuCenter,
            menuItems,
            isHeaderMenuOpen,
            toggleHeaderMenu: this.toggleHeaderMenu,
            closeHeaderMenu: this.closeHeaderMenu,
          }} />
        }
        <Body {...{
          location,
          onRouteEnter,
          footer: <Footer>{footer}</Footer>
        }}>
          { children }
        </Body>
      </div>
    )
  }
}
