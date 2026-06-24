import { useReveal } from '../hooks/useReveal'

/**
 * Wraps children in a div that fades/slides in when scrolled into view.
 * Extra props (style, className, key handlers) pass through to the wrapper.
 */
export default function Reveal({ children, style, className = '', ...rest }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
