import { Component, classnames as cx } from '@mna/react'
import TouchCarousel from './core/TouchCarousel'
import Container from './Container'

// https://github.com/xiaody/react-touch-carousel/
// https://xiaody.github.io/react-touch-carousel/docs/

const Card = ({
  item,
  index, modIndex, cursor,
  cardWidth,
  isCurrent,
  carouselInstance,
  onCardClick
}) =>
  <div
    className={cx(
      'carousel-card',
      isCurrent ? 'is-current' : null
    )}
    style={{ minWidth: `${cardWidth}px` }}
    onClick={() => {
      const onClickProps = { index, modIndex, cursor, carouselInstance }
      //console.log('Carousel.Card onClick', onClickProps)
      if (onCardClick) onCardClick({
        index: modIndex
      })
    }}
  >
    <div className='carousel-card-inner'>
      { item }
    </div>
  </div>

class Carousel extends Component {

  renderContainer = (carouselProps) => {

    const {
      items,
      cardCentered = true,
      cardWidth,
      cardHeight,
      cardPadCount,
      getInstance
    } = this.props

    if (getInstance) getInstance(carouselProps.carouselInstance)

    return <Container {...{
      ...carouselProps,
      items,
      cardCentered,
      cardWidth, cardHeight,
      cardPadCount
    }} />
  }

  renderCard = (index, modIndex, cursor, carouselInstance) => {

    const { items, cardWidth, onCardClick } = this.props
    const item = items[modIndex]
    const cursorIndex = carouselInstance.getCursorIndex()

    return <Card {...{
      key: index,
      item,
      cardWidth,
      index, modIndex, cursor,
      isCurrent: modIndex===cursorIndex,
      carouselInstance,
      onCardClick
    }} />
  }

  render() {

    const {
      items,
      cardWidth, cardHeight,
      cardPadCount = items.length,
      onChange,
      loop = true
    } = this.props

    const cardCount = items.length

    return (
      <TouchCarousel
        component={this.renderContainer}
        cardSize={cardWidth}
        cardCount={cardCount}
        cardPadCount={cardPadCount || cardCount}
        //loop={enableLoop}
        //autoplay={enableAutoplay ? 2e3 : false}
        loop={loop}
        autoplay={false}
        renderCard={this.renderCard}
        onRest={(index, modIndex) => {
          if (onChange) onChange(modIndex)
        }}
        //onDragStart={() => log('dragStart')}
        //onDragEnd={() => log('dragEnd')}
        //onDragCancel={() => log('dragCancel')}
      />
    )
  }
}

export default Carousel
