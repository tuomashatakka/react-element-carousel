import React, { PropsWithChildren, useEffect, useRef, useState } from "react"

import PositionIndicator from "./PositionIndicator"


export default function Carousel ({ children }: PropsWithChildren) {
  const [ currentItem, setCurrentItem ] = useState(0)
  const [ currentOffset, setOffset ]    = useState(0)
  const [ lastItem, setLastItem ]       = useState(0)

  const containerRef                    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container             = containerRef.current as HTMLElement
    const lastChild             = container.lastElementChild as HTMLElement
    const lastChildEndPosition  = lastChild.getBoundingClientRect().right
    const parentWidth           = container.getBoundingClientRect().width
    const overflowPosition      = lastChildEndPosition - parentWidth
    const childNodes            = container.children

    for (let n = 0; n < childNodes.length; n++) {
      const node = childNodes.item(n) as HTMLElement
      const endPosition = node.getBoundingClientRect().left
      if (endPosition > overflowPosition) {
        setLastItem(n)
        break
      }
    }
  }, [])

  useEffect(() => {
    const container             = containerRef.current as HTMLElement
    const lastChild             = container.lastElementChild as HTMLElement
    const targetSlide           = container.children.item(currentItem) as HTMLElement
    const offset                = targetSlide.offsetLeft
    const diff                  = offset - currentOffset
    const lastChildEndPosition  = lastChild.getBoundingClientRect().right - diff
    const parentWidth           = container.getBoundingClientRect().width
    const overflow              = lastChildEndPosition - parentWidth

    if (overflow < 0)
      setOffset(offset + overflow)
    else
      setOffset(offset)
  }, [ currentItem ])

  const scrollToItem = (item: number) => {
    // const itemsCount = containerRef.current.children.length
    if (item < 0)
      return
    if (item > lastItem)
      return
    setCurrentItem(item)
  }

  const containerStyle = {
    transform: `translateX(-${currentOffset}px)`
  }

  return <div className='carousel'>

    <section className='carousel-content'>
      <div className='slides' ref={ containerRef } style={ containerStyle }>
        { children }
      </div>
    </section>

    <menu>
      <button className='carousel-control control-previous' onClick={() => scrollToItem(currentItem-1)} />
      <button className='carousel-control control-next' onClick={() => scrollToItem(currentItem+1)} />
      <PositionIndicator
        value={ currentItem }
        max={ lastItem }
        onChange={ (event) => scrollToItem(Number(event.target.value))}
      />
    </menu>

  </div>
}
