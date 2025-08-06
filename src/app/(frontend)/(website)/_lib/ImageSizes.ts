interface BreakPointConfig {
  gap?: number
  padding?: number
  cols?: number
}

interface BreakPoints {
  [key: string]: BreakPointConfig
}

interface DefaultBreakPoints {
  [key: string]: number
}

export function imageSizes(breakPoints: BreakPoints): string {
  const TAILWIND_UNIT = 4

  const defaultBreakPoints: DefaultBreakPoints = {
    "2xl": 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
    xs: 0,
  }

  try {
    return Object.entries(breakPoints).map(([key, { gap = 0, padding = 0, cols = 1 }]) => {
      const width = defaultBreakPoints[key] || 0
      const gapPx = gap * TAILWIND_UNIT
      const paddingPx = padding * TAILWIND_UNIT * 2
      const extraSpaces = (paddingPx + gapPx * (cols - 1))

      if (width === 0) {
        return `calc(${Math.floor(100 / cols)}vw - ${extraSpaces / cols}px)`
      }
      return `(min-width: ${width}px) ${Math.floor((width - extraSpaces) / cols)}px`
    }).join(',')
  } catch (error) {
    return '100vw'
  }
}
