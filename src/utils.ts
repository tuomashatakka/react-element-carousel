import { DependencyList, TouchEventHandler, useLayoutEffect } from 'react'

type CoordinatesType = [number, number];

interface DOMRectDimensions {
  height: number;
  width: number;
}

export function getViewportDimensions(): CoordinatesType {
  return [
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  ]
}

export function useViewportDimensionsChangeHandler(
  callback: (dimensions: DOMRectDimensions) => void, // eslint-disable-line no-unused-vars
  deps: DependencyList = []
): void {

  const getDimensions = (): DOMRectDimensions => {
    const [width, height] = getViewportDimensions()
    return { width, height }
  }

  const handleResize = () => {
    callback(getDimensions())
  }

  useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize, false)
    return () => window.removeEventListener('resize', handleResize)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export const useHandleDrag = (on: {
  dragStart: (diff: number) => void, // eslint-disable-line no-unused-vars
  drag: (diff: number) => void, // eslint-disable-line no-unused-vars
  dragEnd: (diff: number) => void}) => { // eslint-disable-line no-unused-vars

  const dragPosition = {
    start: 0,
    current: 0,
  }

  const handleDrag = (event: TouchEvent) => {
    dragPosition.current = event.touches[0].screenX
    const diff = dragPosition.current - dragPosition.start
    on.drag(diff)
  }

  const handleDragEnd = () => {
    window.removeEventListener('touchmove', handleDrag)
    window.removeEventListener('touchend', handleDragEnd)
    const diff = dragPosition.current - dragPosition.start
    dragPosition.start = 0
    dragPosition.current = 0
    on.dragEnd(diff)
  }

  const handleDragStart: TouchEventHandler = (event) => {
    window.addEventListener('touchmove', handleDrag)
    window.addEventListener('touchend', handleDragEnd)
    dragPosition.start = event.touches[0].screenX
    on.dragStart(0)
  }

  return handleDragStart
}
