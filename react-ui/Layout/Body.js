import { Component, Switch, Route } from '@mna/react'
import SmoothTransition from '@mna/react-ui/SmoothTransition'
import ScrollTop from '@mna/react-ui/ScrollTop'

class Body extends Component {

  componentDidMount() {
    this.focusScrollContainer()
  }

  focusScrollContainer = () => {

    // Enable keyboard scroll upon route render

    // https://stackoverflow.com/questions/22109621/keyboard-down-button-does-not-work-when-overflow-is-defined-for-html-body#answer-22126539

    if (!this.scrollContainer) return
    this.scrollContainer.tabIndex = '0'
    this.scrollContainer.focus()
  }

  render() {
    const { children, location } = this.props
    return (
      <main id="content"
        className="site-main"
        ref={el => this.scrollContainer = el }
      >
        <SmoothTransition
          location={location}
          onRouteEnter={() => this.focusScrollContainer()}
        >
          {transitLocation =>
            <>
              <ScrollTop pathname={transitLocation.pathname} />
              <Switch location={transitLocation}>
                { children }
              </Switch>
            </>
          }
        </SmoothTransition>
      </main>
    )
  }
}

export default Body