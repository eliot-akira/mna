import { start, stop } from './index'

export const createState = () => ({
  isSpinning: false
})

export const actions = {
  startSpinner({ setState }) {
    start()
    setState({ isSpinning: true })
  },
  stopSpinner({ setState }) {
    stop()
    setState({ isSpinning: false })
  },
}
