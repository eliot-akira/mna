import { Component, classnames as cx } from '@mna/react'
import NonPassiveTouchTarget from './core/NonPassiveTouchTarget'
import touchWithMouseHOC from './core/touchWithMouseHOC'
import { modCursor } from './core/utils'

class CarouselContainer extends Component {

  state = {
    carouselWidth: 960
  }

  componentDidMount() {    
    window.addEventListener('resize', this.getCarouselWidth)
    this.getCarouselWidth(null, { immediate: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getCarouselWidth)
  }

  getCarouselWidth = (e, opts = {}) => {
    if (!this.el) return
    // Debounce
    clearTimeout(this.scheduleResize)

    const fn = () => this.setState({
      carouselWidth: this.el.clientWidth
    })

    if (opts.immediate) return fn()
    this.scheduleResize = setTimeout(fn, 300)
  }

  render() {

    const {
      cursor,
      carouselState: {
        active,
        dragging
      },
      carouselInstance,

      items,
      cardWidth, cardHeight,
      cardPadCount,

      // From carousel core
      // onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onMouseDown, children,
      cardSize, 
      ...rest
    } = this.props

    const itemCount = items.length
    let current = -Math.round(cursor) % itemCount
  
    while (current < 0) {
      current += itemCount
    }
  
    const carouselWidth = this.state.carouselWidth

    // Put current card at center
    const translateX = (cursor - cardPadCount) * cardWidth + (carouselWidth - cardWidth) / 2
  
    return (
      <NonPassiveTouchTarget
        getRef={el => this.el = el}
        className={cx(
          'carousel-container',
          {
            'is-active': active,
            'is-dragging': dragging
          }
        )}
        style={{
          height: `${cardHeight}px`
        }}
      >
        <NonPassiveTouchTarget
          className='carousel-track'
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
  
        {/* <div className='carousel-pagination-wrapper'>
          <ol className='carousel-pagination'>
            {items.map((_, index) => (
              <li
                key={index}
                className={current === index ? 'current' : ''}
                onClick={e => {
                  e.preventDefault()
                  if (index!==current) carouselInstance.go(modCursor(index, itemCount))
                }}
              />
            ))}
          </ol>
        </div>
   */}
      </NonPassiveTouchTarget>
    )
  }
}

export default touchWithMouseHOC(CarouselContainer)
