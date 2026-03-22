import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    })

    let raf: number

    function animate(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    // Keep Framer Motion scroll in sync
    lenis.on('scroll', () => {
      window.dispatchEvent(new Event('scroll'))
    })

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}
