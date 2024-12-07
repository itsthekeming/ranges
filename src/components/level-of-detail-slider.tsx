import { useStore } from '~/state'
import * as Slider from '@radix-ui/react-slider'
import { useState } from 'react'

// 0 will yield a levelOfDetail of 0.1
const min = 0
// if max was 100, it would yield a levelOfDetail of 0
// this would result in no simplification, which is undesirable
// setting to 99 ensures that the slider will always yield a levelOfDetail of at least 0.1
// 99 will yield a levelOfDetail of 0.01
const max = 99
const step = 10

function calculateLevelOfDetail(sliderValue: number) {
  // in the simplification algorithm we use, a lower number means more detail.
  // we've found that anything over 0.1 is too little detail,
  // and anything under 0.01 yields diminishing returns.
  // so, invert the value and divide by 1000 to get a value between 0 and 0.1
  return (100 - sliderValue) / 1000
}

export function LevelOfDetailSlider() {
  const levelOfDetail = useStore((state) => state.levelOfDetail)
  const setLevelOfDetail = useStore((state) => state.setLevelOfDetail)

  const [localValue, setLocalValue] = useState([max - levelOfDetail * 100])

  const onChange = (value: number[]) => {
    setLocalValue(value)
    setLevelOfDetail(calculateLevelOfDetail(value[0]))
  }

  return (
    <Slider.Root
      value={localValue}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      className='relative flex h-5 w-48 touch-none select-none items-center'
    >
      <Slider.Track className='relative h-1 grow rounded-full bg-white'>
        <Slider.Range className='absolute h-full rounded-full bg-blue-500' />
      </Slider.Track>
      <Slider.Thumb className='block size-5 rounded-[10px] bg-white focus:outline-none' aria-label='Level of detail' />
    </Slider.Root>
  )
}
