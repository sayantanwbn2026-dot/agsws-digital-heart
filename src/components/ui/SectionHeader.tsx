import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FadeInUp } from './FadeInUp'

interface Props {
  label?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ label, title, subtitle, className = '', align = 'center' }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div ref={ref} className={`${alignClass} max-w-[640px] mb-[40px] overflow-hidden ${className}`}>
      {label && (
        <motion.span
          className="label block mb-[12px]"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {label}
        </motion.span>
      )}
      
      <FadeInUp delay={0.15} y={15}>
        <h2 className="text-[var(--dark)]">{title}</h2>
      </FadeInUp>

      {subtitle && (
        <FadeInUp delay={0.25} y={15}>
          <p className={`mt-[16px] text-[var(--mid)] ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>
        </FadeInUp>
      )}
    </div>
  )
}
