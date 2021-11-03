import { getTheme } from '.'
import { Component } from '../component'
import { h, strToHash } from '../core'
import { boxShadow, userSelect, zIndex } from './_config'
import { addStylesToHead } from './_helpers'

interface FabProps {
  primary?: boolean
  secondary?: boolean
  onClick?: (e: MouseEvent) => void
  offsetY?: number
  center?: boolean
  left?: boolean
  extended?: boolean
  mini?: boolean
  background?: string
  color?: string
}

export class Fab extends Component<FabProps> {
  render() {
    const {
      colors: { primaryContainer, onPrimaryContainer, secondaryContainer, onSecondaryContainer }
    } = getTheme()

    const {
      primary = false,
      secondary = false,

      extended = false,
      mini = false,
      center = false,
      left = false,
      offsetY,
      onClick = () => {}
    } = this.props

    let { background = 'gray', color = 'white' } = this.props

    const height = mini ? 40 : extended ? 48 : 56
    const cssHash = strToHash(
      extended.toString() + mini.toString() + center.toString() + left.toString() + offsetY?.toString()
    ) // Math.random().toString(36).substr(2, 9)
    const className = `fab-container-${cssHash}`

    if (primary) {
      background = primaryContainer
      color = onPrimaryContainer
    } else if (secondary) {
      background = secondaryContainer
      color = onSecondaryContainer
      console.log('secondry', background, color)
    }

    const styles = `
      .${className} {
        ${mini ? 'width: 40px;' : extended ? 'padding: 0px 12px;' : 'width: 56px;'}
        height: ${height}px;
        position: fixed;
        background: ${background};
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
        cursor: pointer;

        z-index: ${zIndex.fab}
        bottom: ${offsetY ? 16 + offsetY : 16}px;        
        ${left ? 'left: 16px;' : 'right: 16px;'}
        ${center ? 'transform: translateX(50%); right: 50%;' : ''}
        ${boxShadow}
        ${userSelect}
      }
    `

    addStylesToHead(styles, cssHash)

    const { children } = this.props as any

    return h('div', { class: className, onClick: (e: MouseEvent) => onClick(e) }, children)
  }
}
