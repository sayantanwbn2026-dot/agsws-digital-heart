import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

declare global {
  interface Window {
    lenis?: Lenis
  }
}

export function useLenis() {
  useEffect(() => {
    // Respect users who prefer reduced motion — skip smooth-scroll entirely so
    // native scrolling (and assistive tech) behave predictably.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })

    // Expose globally so route changes (ScrollToTop) and the BackToTop button
    // drive the SAME scroll engine. Previously these used native
    // window.scrollTo while Lenis kept a separate internal position, which
    // desynced the two and caused the "scroll jumps back" bug after
    // navigation and when pressing back-to-top.
    window.lenis = lenis

    let raf: number

    function animate(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    // Keep Framer Motion scroll in sync. Guarded against re-entrancy: Lenis
    // also listens for native 'scroll' events on window to track position,
    // so dispatching one here re-enters this same handler and recurses
    // synchronously forever (RangeError: Maximum call stack size exceeded)
    // on every single scroll tick — this was firing on every scroll frame
    // and was the main cause of scroll jank/lag across the site.
    let dispatchingScroll = false
    lenis.on('scroll', () => {
      if (dispatchingScroll) return
      dispatchingScroll = true
      window.dispatchEvent(new Event('scroll'))
      dispatchingScroll = false
    })

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      if (window.lenis === lenis) delete window.lenis
    }
  }, [])
}
