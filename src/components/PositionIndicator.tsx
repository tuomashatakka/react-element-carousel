import React, { ChangeEventHandler } from 'react'

export interface PositionIndicatorProps {
  value:      number
  max:        number
  min?:       number
  disabled?:  boolean
  onChange:   ChangeEventHandler<HTMLInputElement>
}


export default function PositionIndicator ({ onChange, value, max, min = 0, disabled = false }: PositionIndicatorProps) {
  const width     = Math.round(100 / max)
  const position  = Math.round(value / (max + 1) * 100)
  const style     = {
    left:   `${position}%`,
    width:  `${width}%`,
  }

return <div className='position' style={{ display: disabled ? 'none' : 'block'}}>
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
