import React, { MouseEventHandler } from 'react'

type NavigationButtonProps = {
  onClick: MouseEventHandler<unknown>;
  disabled: boolean;
}

// <button
//   className="carousel-control control-previous"
//   onClick={scrollToPrevious}
// />

export const PreviousItemsButton = ({
  onClick,
  disabled = false,
}: NavigationButtonProps) => {
  if (disabled)
    return null
  return <button className='carousel-control control-previous' onClick={onClick} />
};

// <button
//   className="carousel-control control-next"
//   onClick={scrollToNext}
// />

export const NextItemsButton = ({
  onClick,
  disabled = false,
}: NavigationButtonProps) => {
  if (disabled)
    return null
  return <button className='carousel-control control-next' onClick={onClick} />
};
