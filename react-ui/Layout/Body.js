import { Component, Switch, Route } from '@mna/react'
import SmoothTransition from '@mna/react-ui/SmoothTransition'
import ScrollTop from '@mna/react-ui/ScrollTop'
import { scroller } from '@mna/react-ui/Scroll'

class Body extends Component {

  static overrideScrollContainer = false

  componentDidMount() {
    if (!Body.overrideScrollContainer) this.focusScrollContainer()
  }

  focusScrollContainer = () => {

    // Enable keyboard scroll upon route render

    // https://stackoverflow.com/questions/22109621/keyboard-down-button-does-not-work-when-overflow-is-defined-for-html-body#answer-22126539

    if (!this.scrollContainer) return
    // Make sure no other element is focused already
    if (!window.document.activeElement) {
      this.scrollContainer.tabIndex = '0'
      this.scrollContainer.focus()
    }
  }

  render() {
    const { children, location, onRouteEnter, header, footer } = this.props
    const mainProps = {
      className: "site-main",
      ref: el => this.scrollContainer = el
    }
    if (!Body.overrideScrollContainer) mainProps.id = 'content'

    return (
      <main {...mainProps}>
        <SmoothTransition
          className="site-main-body"
          location={location}
          onRouteEnter={newLocation => {
            this.focusScrollContainer()
            onRouteEnter && onRouteEnter(newLocation)
          }}
        >
          {transitLocation =>
            <>
              {!Body.overrideScrollContainer && <ScrollTop pathname={transitLocation.pathname} />}
              <Switch location={transitLocation}>
                { children }
              </Switch>
            </>
          }
        </SmoothTransition>
        {footer}
      </main>
    )
  }
}

export default Body
