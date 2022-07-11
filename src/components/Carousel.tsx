import React, { ChangeEventHandler, RefObject, useReducer, useRef } from "react"

import PositionIndicator from "./PositionIndicator"
import { PreviousItemsButton, NextItemsButton } from './NavigationButton'
import { useViewportDimensionsChangeHandler, useHandleDrag } from "../utils"

const styles = {
  carousel: 'carousel',
  carouselComponent: 'carousel',
  carouselContainer: 'carousel-content',
  carouselContent: 'slides',
}

const getWidth = (container: HTMLElement) =>
  container.getBoundingClientRect().width

const getLastItemIndex = (parent: HTMLElement) => {
  if (!parent.childElementCount) {
    return 0
  }
  const lastChild = parent.lastElementChild as HTMLElement
  const lastChildEndPosition = lastChild.offsetLeft + getWidth(lastChild)
  const parentWidth = getWidth(parent)
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
  const lastChildEndPosition = lastChild.offsetLeft + getWidth(lastChild)
  const parentWidth = getWidth(parent)
  return lastChildEndPosition - parentWidth
}

const getIndexByOffset = (parent: HTMLElement, offset: number): number => {
  const childNodes = parent.children
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
  return target.index
}

type State = {
  currentItem: number,
  lastItem: number,
  containerWidth: number,
  currentOffset: number,
  maxOffset: number,
}

const initialState: State = {
  currentItem: 0,
  lastItem: 0,
  containerWidth: 0,
  currentOffset: 0,
  maxOffset: 0,
}

const getReducer = (containerRef: RefObject<HTMLElement>) => (prevState: State, action: { type: string, param?: any }): State => {

  const container = containerRef.current
  if (!container)
    return { ...initialState }

  const calculateCurrentOffset = (itemIndex: number) => {
    const targetSlide = container.children.item(itemIndex) as HTMLElement
    const offset = targetSlide.offsetLeft
    const maxOffset = getMaxOffset(container)
    const currentOffset = Math.min(offset, maxOffset)
    return { maxOffset, currentOffset }
 }

  switch(action.type) {
    case 'update-position': {
      const currentItem = Math.max(0, Math.min(prevState.lastItem, action.param))
      const { maxOffset, currentOffset } = calculateCurrentOffset(action.param)
      return { ...prevState, currentItem, currentOffset, maxOffset }
    }
    case 'update-layout': {
      const lastItem = getLastItemIndex(container)
      const currentItem = Math.min(lastItem, prevState.currentItem)
      const containerWidth = getWidth(container)
      const { maxOffset, currentOffset } = calculateCurrentOffset(prevState.currentItem)
      return { ...prevState, currentItem, lastItem, containerWidth, currentOffset, maxOffset }
    }
    default:
      return prevState
  }
}

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, dispatch] = useReducer(getReducer(containerRef), initialState)

  const updateLayout = () =>
    dispatch({ type: 'update-layout' })

  const updatePosition = (param: number) =>
    dispatch({ type: 'update-position', param })

  const scrollToNext = () =>
    updatePosition(state.currentItem + 1)

  const scrollToPrevious = () =>
    updatePosition(state.currentItem - 1)

  const handlePositionChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    updatePosition(Number(event.target.value))

  useViewportDimensionsChangeHandler(() => {
    updateLayout()
  })

  const onDrag = (diff: number) => {
    const offset = -state.currentOffset + diff
    containerRef.current?.style.setProperty('transform', `translateX(${offset}px)`)
  }

  const onDragStart = () => {
    containerRef.current?.style.setProperty('transition-duration', `0ms`)
  }

  const onDragEnd = (diff: number) => {
    const container = containerRef.current
    if (!container)
      return null

    container.style.removeProperty('transition-duration')
    const targetIndex = Math.min(state.lastItem, getIndexByOffset(container, -state.currentOffset + diff))
    if (state.currentItem !== targetIndex)
      updatePosition(targetIndex)
    else
      container.style.setProperty('transform', `translateX(-${state.currentOffset}px)`)
    return null
  }

  const handleDragStart = useHandleDrag({
    drag: onDrag,
    dragEnd: onDragEnd,
    dragStart: onDragStart
  })

  if (!children || children.length === 0) {
    return null
  }

  const containerStyle = {
    transform: `translateX(-${state.currentOffset}px)`,
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
          disabled={state.currentItem === 0}
        />
        <NextItemsButton
          onClick={scrollToNext}
          disabled={state.currentItem === state.lastItem}
        />
        <PositionIndicator
          value={state.currentItem}
          max={state.lastItem}
          onChange={handlePositionChange}
          disabled={state.lastItem === 0}
        />
      </menu>
    </div>
  )
}
