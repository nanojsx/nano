import { h } from '../core'

// https://gist.github.com/renancouto/4675192
export const lightenColor = (color: string, percent: number) => {
  if (color === 'white') color = '#FFFFFF'
  else if (color === 'black') color = '#000000'

  if (!/^#/.test(color))
    console.warn(`Please convert color "${color}" to hex! Otherwise the ripple effect will not work.`)

  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)}`
}

export const addStylesToHead = (styles: string, hash: string) => {
  const el = document.querySelector(`[data-css-hash*="${hash}"]`)
  if (!el) {
    const styleElement = h('style', { 'data-css-hash': hash }, styles)
    document.head.appendChild(styleElement)
  }
}
