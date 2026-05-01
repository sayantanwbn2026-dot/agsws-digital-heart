import { motion, useInView } from 'framer-motion'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  once?: boolean
}

export const FadeInUp = forwardRef<HTMLDivElement, Props>(function FadeInUp({
  children, delay = 0, y = 28,
  duration = 0.5, className, once = true
}, forwardedRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  // Expose the inner div node to any forwarded ref (object or callback).
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement, [])
  const isInView = useInView(innerRef, { once, margin: '-60px 0px' })

  return (
    <motion.div
      ref={innerRef}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
})

export default FadeInUp;
