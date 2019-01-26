import { Component } from 'react'

// Usage:
// import load from '@mna/react-client/load'
// export const Test = load(() => import(/* webpackChunkName: "Test" */ './dynamic/posts/test'))

export default function loadAsync(getComponent) {

  return class AsyncComponent extends Component {

    static Loaded = null

    // Client calls this before page load
    static loadComponent() {
      return getComponent()
        .then(Loaded => {
          const C = Loaded.default || Loaded
          AsyncComponent.Loaded = C
          return C
        })
    }

    mounted = false
    resolvePromise = null
    state = {
      Loaded: AsyncComponent.Loaded
    }

    componentWillMount() {
      if (this.state.Loaded) {
        if (this.resolvePromise) this.resolvePromise()
        return
      }
      AsyncComponent.loadComponent()
        .then(Loaded => {
          if (this.mounted) this.setState({ Loaded })
          if (this.resolvePromise) this.resolvePromise()
        })
    }

    componentDidMount() {
      this.mounted = true
    }

    componentWillUnmount() {
      this.mounted = false
    }

    createAsyncLoadPromise(el) {
      if (!el) return
      el.asyncLoadPromise = new Promise((resolve, reject) => {
        this.resolvePromise = () => {
          resolve()
          this.resolvePromise = null
        }
      })
    }

    render() {
      const { Loaded } = this.state

      if (!Loaded) return (
        <div data-async-component
          ref={el => this.createAsyncLoadPromise(el)}
        ></div>
      )

      return <Loaded {...this.props} />
    }
  }
}
