import React, { ChangeEventHandler, useEffect, useRef, useState } from "react"

import PositionIndicator from "./PositionIndicator"
import { PreviousItemsButton, NextItemsButton } from './NavigationButton'
import { useViewportDimensionsChangeHandler } from "../utils"

const styles = {
  carousel: 'carousel',
  carouselComponent: 'carousel',
  carouselContainer: 'carousel-content',
  carouselContent: 'slides',
}

const getLastItemIndex = (parent: HTMLElement) => {
  if (!parent.childElementCount) {
    return 0
  }
  const lastChild = parent.lastElementChild as HTMLElement
  const lastChildEndPosition = lastChild.offsetLeft + lastChild.getBoundingClientRect().width
  const parentWidth = parent.getBoundingClientRect().width
  const overflowPosition = lastChildEndPosition - parentWidth
  const childNodes = parent.children

  for (let n = 0; n < childNodes.length; n++) {
    const node = childNodes.item(n) as HTMLElement
    const endPosition = node.offsetLeft
    if (endPosition > overflowPosition) {
      return n
    }
  }
  return childNodes.length - 1
}

const getMaxOffset = (parent: HTMLElement): number => {
  if (!parent.childElementCount) {
    return 0
  }
  const lastChild = parent.lastElementChild as HTMLElement
  const lastChildEndPosition = lastChild.offsetLeft + lastChild.getBoundingClientRect().width
  const parentWidth = parent.getBoundingClientRect().width
  return lastChildEndPosition - parentWidth
}

// const getLastItem = (node: HTMLElement) => {
//   const getLastItemEndPosition()
// }

/**
 * Display a horizontal carousel component with `props.children` rendered inside
 * @param props.children Children for the carousel
 * @returns A carousel JSX component
 */
export default function Carousel ({
  children,
}: {
  children: Array<React.ReactNode>;
}) {
  const [currentItem, setCurrentItem] = useState(0)
  const [currentOffset, setOffset] = useState(0)
  const [lastItem, setLastItem] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  const updateOffset = (target: number) => {
    const container = containerRef.current
    const targetSlide = container?.children.item(target) as HTMLElement
    if (!targetSlide) {
      return
    }
    const offset = targetSlide.offsetLeft
    const maxOffset = getMaxOffset(container as HTMLElement)
    if (offset > maxOffset) {
      setOffset(maxOffset)
    } else {
      setOffset(offset)
    }
  }

  useViewportDimensionsChangeHandler(() => {
    if (containerRef.current)
      setLastItem(getLastItemIndex(containerRef.current))
  })

  useEffect(() => {
    if (containerRef.current)
      setLastItem(getLastItemIndex(containerRef.current))
  }, [children])

  useEffect(() => {
    if (currentItem > lastItem)
      updateOffset(lastItem)
    else
      updateOffset(currentItem)
  }, [currentItem])

  const containerStyle = {
    transform: `translateX(-${currentOffset}px)`,
  }

  const scrollToItem = (item: number) => {
    if (item < 0)
      setCurrentItem(0)
    else if (item >= lastItem)
      setCurrentItem(lastItem)
    else
      setCurrentItem(item)
  }

  const scrollToNext = () => scrollToItem(currentItem + 1)
  const scrollToPrevious = () => scrollToItem(currentItem - 1)
  const handlePositionChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    scrollToItem(Number(event.target.value))

  if (!children || children.length === 0) {
    return null
  }

  const dragPosition = {
    start: 0,
    current: 0,
  }

  const handleDrag = (event: TouchEvent) => {
    dragPosition.current = event.touches[0].screenX
    const diff = dragPosition.current - dragPosition.start
    const offset = -currentOffset + diff
    containerRef.current?.style.setProperty('transform', `translateX(${offset}px)`)
  }

  const handleDragEnd = () => {
    window.removeEventListener('touchmove', handleDrag)
    window.removeEventListener('touchend', handleDragEnd)

    const container = containerRef.current
    if (!container)
      return null

    container.style.removeProperty('transition-duration')
    const childNodes = container.children
    const diff = dragPosition.current - dragPosition.start
    const offset = -currentOffset + diff
    const target = {
      index: 0,
      position: null as Number | null,
    }
    // const maxOffset = getMaxOffset(container as HTMLElement)

    for (let n = 0; n < childNodes.length; n++) {
      const node = childNodes.item(n) as HTMLElement
      const endPosition = Math.abs(node.offsetLeft + offset)

      if (target.position === null || endPosition < target.position) {
        target.index = n
        target.position = endPosition
      }
    }
    if (target.index > lastItem)
      target.index = lastItem

    if (currentItem !== target.index) {
      setCurrentItem(target.index)
    }
    else {
      // TODO: Refactor so this hack is not needed; now the offset
      // would not get updated if the current item didn't change
      container.style.setProperty('transform', `translateX(-${currentOffset}px)`)
    }
    return null
  }

  const handleDragStart: React.TouchEventHandler = (event) => {
    window.addEventListener('touchmove', handleDrag)
    window.addEventListener('touchend', handleDragEnd)
    dragPosition.start = event.touches[0].screenX
    containerRef.current?.style.setProperty('transition-duration', `0ms`)
  }

  return (
    <div className={styles.carouselComponent}>
      <section className={styles.carouselContainer}>
        <div
          onTouchStart={handleDragStart}
          className={styles.carouselContent}
          ref={containerRef}
          style={containerStyle}
        >
          {children.map((child, n) => {
            return <article key={String(n)}>{child}</article>
          })}
        </div>
      </section>
      <menu>
        <PreviousItemsButton
          onClick={scrollToPrevious}
          disabled={currentItem === 0}
        />
        <NextItemsButton
          onClick={scrollToNext}
          disabled={currentItem === lastItem}
        />
        <PositionIndicator
          value={currentItem}
          max={lastItem}
          onChange={handlePositionChange}
        />
      </menu>
    </div>
  )
}
