import { Component, classnames as cx } from '@mna/react'
import TouchCarousel from './core/TouchCarousel'
import Container from './Container'

// https://github.com/xiaody/react-touch-carousel/
// https://xiaody.github.io/react-touch-carousel/docs/

const Card = ({ item, index, modIndex, cursor, cardWidth, isCurrent, carouselInstance }) => 
  <div
    className={cx(
      'carousel-card',
      isCurrent ? 'is-current' : null
    )}
    style={{ minWidth: `${cardWidth}px` }}
    onClick={() => {
      console.log('card click', {index, modIndex, cursor})
      //carouselInstance.setCursor(cursor+modIndex)
    }}
  >
    <div className='carousel-card-inner'>
      { item }
    </div>
  </div>

class Carousel extends Component {

  renderContainer = (carouselProps) => {

    const { items, cardWidth, cardHeight,  cardPadCount } = this.props

    return <Container {...{
      ...carouselProps,
      items,
      cardWidth, cardHeight,
      cardPadCount
    }} />
  }

  renderCard = (index, modIndex, cursor, carouselInstance) => {

    const { items, cardWidth } = this.props
    const item = items[modIndex]
    const cursorIndex = carouselInstance.getCursorIndex()

    return <Card {...{
      key: index,
      item,
      cardWidth,
      index, modIndex, cursor,
      isCurrent: modIndex===cursorIndex,
      carouselInstance
    }} />
  }

  render() {

    const {
      items,
      cardWidth, cardHeight,
      cardPadCount,
      onCardSelect
    } = this.props
    
    return (
      <TouchCarousel
        component={this.renderContainer}
        cardSize={cardWidth}
        cardCount={items.length}
        cardPadCount={cardPadCount}
        //loop={enableLoop}
        //autoplay={enableAutoplay ? 2e3 : false}
        loop={true}
        autoplay={false}
        renderCard={this.renderCard}
        onRest={(index, modIndex) => {
          console.log('onRest', {index, modIndex})
          if (onCardSelect) onCardSelect(modIndex)
        }}
        //onDragStart={() => log('dragStart')}
        //onDragEnd={() => log('dragEnd')}
        //onDragCancel={() => log('dragCancel')}
      />
    )
  }
}

export default Carousel
