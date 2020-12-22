import { Component } from '../component'
import { h, strToHash } from '../core'
import { addStylesToHead } from './_helpers'

interface IconProps {
  src: string
  active?: boolean
  color?: string
  style?: string
  size?: number
  onClick?: (e: MouseEvent) => void
}

export class Icon extends Component<IconProps> {
  cssHash: string

  didUnmount() {
    // not sure if I want to remove the css, since there might be another Icon with the same styles.
    // const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    // if (el) el.remove()
  }

  render() {
    const { src, size = 16, active = true, color = '#6204EE', style = '', ...rest } = this.props

    // @ts-ignore
    const children = this.props.children

    this.cssHash = strToHash(active + color + size.toString())

    const colors = {
      active: color,
      inactive: '#00000070',
    }

    const styles = `
    i.icon-${this.cssHash} {
      width: ${size}px;
      height: ${size}px;
      display: inline-block;
      content: '';

      /*-webkit-mask: url(YOUR_SVG_URL) no-repeat 50% 50%;
      mask: url(YOUR_SVG_URL) no-repeat 50% 50%;*/

      -webkit-mask-size: cover;
      mask-size: cover; 

      background-color: ${colors.active};
    }

    i.icon-${this.cssHash}.icon_inactive-${this.cssHash} {
      background-color: ${colors.inactive};
    }
    `

    addStylesToHead(styles, this.cssHash)

    // const iconStyle = `-webkit-mask: url(/dev/font-awesome/ellipsis-v-solid.svg) no-repeat 50% 50%;mask: url(/dev/font-awesome/ellipsis-v-solid.svg) no-repeat 50% 50%;`
    const iconStyle = `-webkit-mask: url(${src || children}) no-repeat 50% 50%; mask: url(${
      src || children
    }) no-repeat 50% 50%;`

    const classes = [`icon-${this.cssHash}`]
    if (!active) classes.push(`icon_inactive-${this.cssHash}`)

    const icon = h('i', { class: classes.join(' '), ...rest, style: iconStyle + style })

    return icon
  }
}
