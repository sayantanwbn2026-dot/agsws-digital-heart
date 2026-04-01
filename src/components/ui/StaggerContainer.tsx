import { FadeInUp } from './FadeInUp'
import React from 'react'

interface Props {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children, staggerDelay = 0.08, className
}: Props) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <FadeInUp delay={i * staggerDelay} key={i}>
          {child}
        </FadeInUp>
      ))}
    </div>
  )
}
