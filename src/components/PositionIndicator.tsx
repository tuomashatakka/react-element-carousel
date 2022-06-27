import React, { ChangeEventHandler } from 'react'

export interface PositionIndicatorProps {
  value:  number
  max:    number
  min?:   number
  onChange: ChangeEventHandler<HTMLInputElement>
}


export default function PositionIndicator ({ onChange, value, max, min = 0 }: PositionIndicatorProps) {
  const width     = Math.round(100 / max)
  const position  = Math.round(value / (max + 1) * 100)
  const style     = {
    left:   `${position}%`,
    width:  `${width}%`,
  }

return <div className='position'>
    <div className='current-position' style={ style }/>
    <input
      type='range'
      min={ min }
      max={ max }
      value={ value }
      onChange={ onChange}
    />
  </div>
}
