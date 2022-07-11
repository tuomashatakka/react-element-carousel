import { DependencyList, useLayoutEffect } from 'react'

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
