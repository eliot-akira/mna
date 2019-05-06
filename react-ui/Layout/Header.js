import { Link } from '@mna/react'

const HeaderTitle = ({
  menuTitle,
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
      <div className="header-title-content-right md-hide">
        <div className={`hamburger${isHeaderMenuOpen ? ' is-open' : ''}`}
          onClick={toggleHeaderMenu}
        ><span></span></div>
      </div>
    </div>
  </div>

const MenuItem = ({ item }) =>
  item.to
    ? <Link to={item.to} exact={
      // exact=true by default
      typeof item.exact==='undefined' ? true
        : item.exact
    }>{item.content}</Link>
    : (item.content || item)

const MenuItems = ({ items, keyPrefix = '' }) =>
  <>
    {items.map((item, itemIndex) =>
      <li key={
        (keyPrefix ? `${keyPrefix}-` : '')+itemIndex
      } className="header-menu-item">
        <MenuItem item={ item } />
        { !item.children ? '' :
          <ul className="list-reset">
            <MenuItems items={item.children}
              keyPrefix={(keyPrefix ? `${keyPrefix}-` : '')+itemIndex}
            />
          </ul>
        }
      </li>
    )}
  </>

const HeaderMenu = ({
  closeHeaderMenu,
  menuItems: items
}) =>
  <div className={`header-menu`}>
    <div className="header-menu-content">
      <ul className="list-reset" onClick={ closeHeaderMenu }>
        <MenuItems items={items} />
      </ul>
    </div>
  </div>

const Header = ({ isHeaderMenuOpen, closeHeaderMenu, toggleHeaderMenu, menuTitle, menuItems }) =>
  <header className={`site-header`}>
    <HeaderTitle {...{
      menuTitle,
      isHeaderMenuOpen,
      closeHeaderMenu,
      toggleHeaderMenu
    }}/>
    <HeaderMenu {...{
      menuItems,
      closeHeaderMenu
    }}/>
  </header>

export default Header
