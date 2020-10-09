import { h, strToHash } from '../core'
import { boxShadow, zIndex, userSelect, rippleEffect } from './_config'
import { lightenColor } from './_helpers'
import { Icon } from './icon'

export const Button = (props: {
  outlined?: boolean
  text?: boolean
  style?: string
  icon?: string
  [key: string]: any
}) => {
  const {
    children,
    outlined = false,
    text = false,
    background = '#6200ee',
    color = '#ffffff',
    style = '',
    class: className = '',
    icon,
    ...rest
  } = props

  const normal = !(outlined || text)

  const bg = normal ? background : '#ffffff'
  const clr = normal ? color : background
  const hoverClr = normal ? lightenColor(bg, 10) : lightenColor(bg, -10)
  const rippleClr = normal ? lightenColor(bg, 50) : lightenColor(background, 50)
  const cssHash = strToHash(outlined.toString() + text.toString() + bg + clr + style)

  const ripple = rippleEffect(rippleClr, hoverClr)

  const styles = `
    .nano_jsx_button-${cssHash} {
      color: ${clr};
      background: ${bg};
      border-radius: 4px;
      display: inline-block;
      font-size: 14px;
      padding: 10px 16px;
      margin: 0px 0px 1em 0px;
      text-align: center;
      cursor: pointer;
      display: flex;

      ${userSelect}
      

      z-index: ${zIndex.button}

      ${boxShadow}

      border: none;
      text-transform: uppercase;
      box-shadow: 0 0 4px #999;
      outline: none;
    }

    ${ripple.styles}
  `

  const el = document.querySelector(`[data-css-hash*="${cssHash}"]`)
  if (!el) {
    const styleElement = h('style', { 'data-css-hash': cssHash }, styles)
    document.head.appendChild(styleElement)
  }

  let customStyles = ''
  if (outlined || text) {
    customStyles += 'padding-top: 9px; padding-bottom: 9px; '
    customStyles += '-webkit-box-shadow: none; -moz-box-shadow: none; box-shadow none; '
    if (outlined) customStyles += `border: 1px ${clr} solid; `
  }
  customStyles += style

  return h(
    'a',
    { class: `nano_jsx_button-${cssHash} ${ripple.class} ${className}`, style: customStyles, ...rest },
    icon ? h(Icon, { style: 'margin-left: -4px; margin-right: 8px; width: 14px; height: 14px;' }, icon) : null,
    children
  )
}
