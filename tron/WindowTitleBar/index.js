import React from 'react'
import { remote } from 'electron'
//import './WindowTitleBar.scss'

class WindowControls extends React.Component {

  constructor(props){
    super(props)
  }

  closeWindow = (remote) => {
    remote.getCurrentWindow().close()
  }

  minimize = (remote) => {
    remote.getCurrentWindow().minimize()
  }

  maximize = (remote) => {
    let window = remote.getCurrentWindow()

    if(window.isMaximized())
      window.unmaximize()
    else
      window.maximize()
  }

  render () {
    //const { remote } = this.props
    return (
      <ul className="windowControls">
        <li onClick={ () => this.closeWindow(remote) } className="windowControlsButtons closeButton"></li>
        <li onClick={ () => this.minimize(remote) } className="windowControlsButtons minButton"></li>
        <li onClick={ () => this.maximize(remote) } className="windowControlsButtons maxButton"></li>
      </ul>
    )
  }
}

export default class TitleBar extends React.Component {

  // render side buttons

  renderButtons = (buttons) => {
    return buttons.map((button, index) => {
      return React.cloneElement(button, { key: index })
    })
  }

  render () {
    let { title, theme, remote, className, style, actionsPos, hideControls, buttons } = this.props

    if(!theme) {
      theme = 'light'
    }

    className = className || ""

    if(actionsPos == "left" || !actionsPos) {
      className += " controlLeft "
    } else if (actionsPos == "right") {
      className += " controlRight "
    }

    return (
      <div style={style} className={"reactWindowTitleBar " + className + theme}>
        <div className="windowControlsContainer">
          {!hideControls ? <WindowControls remote={remote} /> : null}
        </div>
        <div className="windowTitle">{title}</div>
        <div className="sideButtons">{buttons && buttons.length > 0 ? this.renderButtons(buttons) : null}</div>
      </div>
    )
  }
}
