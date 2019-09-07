import { Link } from '@mna/react'

const HeaderTitle = ({
  menuTitle, menuCenter,
  isHeaderMenuOpen,
  closeHeaderMenu,
  toggleHeaderMenu
}) =>
  <div className="header-title" style={{ zIndex: 1 }}>
    <div className="header-title-content">
      <div className="header-title-content-left"
        onClick={ closeHeaderMenu }
      >
        {menuTitle}
      </div>
      { !menuCenter ? null
        :
        <div className="header-center md-hide">{menuCenter}</div>
      }
      <div className="header-title-content-right md-hide">
        <div className={`hamburger${isHeaderMenuOpen ? ' is-open' : ''}`}
          onClick={toggleHeaderMenu}
        ><span></span></div>
      </div>
    </div>
  </div>

const withMenuRoot = (to, menuRoot) => {

  // Skip external links
  if (to.indexOf(':')>=0) return to

  const route = to[0]==='/' ? to : (
    menuRoot[ menuRoot.length - 1 ]==='/'
      ? menuRoot
      : menuRoot+'/'
  )+to

  return route
}

const MenuItem = ({ item, menuRoot }) =>
  item.to!=undefined
    ? <Link to={withMenuRoot(item.to, menuRoot)} exact={
      // exact=true by default
      typeof item.exact==='undefined' ? true
        : item.exact
    }>{item.content}</Link>
    : (item.content || item)

const MenuItems = ({ items, keyPrefix = '', menuRoot }) =>
  <>
    {items.map((item, itemIndex) =>
      <li key={
        (keyPrefix ? `${keyPrefix}-` : '')+itemIndex
      } className="header-menu-item">
        <MenuItem item={ item } menuRoot={menuRoot} />
        { !item.children ? '' :
          <ul className="list-reset">
            <MenuItems items={item.children}
              keyPrefix={(keyPrefix ? `${keyPrefix}-` : '')+itemIndex}
              menuRoot={ item.to!=undefined ? withMenuRoot(item.to, menuRoot) : menuRoot }
            />
          </ul>
        }
      </li>
    )}
  </>

const HeaderMenu = ({
  closeHeaderMenu,
  menuItems: items,
  menuRoot = '/'
}) =>
  <div className={`header-menu`}>
    <div className="header-menu-content">
      <ul className="list-reset" onClick={ closeHeaderMenu }>
        <MenuItems items={items} menuRoot={menuRoot} />
      </ul>
    </div>
  </div>

const Header = ({ isHeaderMenuOpen, closeHeaderMenu, toggleHeaderMenu, menuTitle, menuItems, menuCenter, menuRoot }) =>
  <header className={`site-header`}>
    <div className="site-header-inner-pad">
      <div className="site-header-inner">
        <HeaderTitle {...{
          menuTitle, menuCenter,
          isHeaderMenuOpen,
          closeHeaderMenu,
          toggleHeaderMenu
        }}/>
        { !menuCenter ? null
          :
          <div className="header-center md-show">{menuCenter}</div>
        }
        <HeaderMenu {...{
          menuItems, menuRoot,
          closeHeaderMenu
        }}/>
      </div>
    </div>
  </header>

export default Header
