import { Component } from '../component.ts'
import { h, strToHash } from '../core.ts'
import { boxShadow, userSelect, zIndex } from './_config.ts'
import { addStylesToHead } from './_helpers.ts'

interface FabProps {
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
      background = '#6200EE',
      color = 'white',
      extended = false,
      mini = false,
      center = false,
      left = false,
      onClick = () => {}
    } = this.props

    const height = mini ? 40 : extended ? 48 : 56
    const cssHash = strToHash(extended.toString() + mini.toString() + center.toString() + left.toString())
    const className = `fab-container-${cssHash}`

    const styles = `
      .${className} {
        ${mini ? 'width: 40px;' : extended ? 'padding: 0px 12px;' : 'width: 56px;'}
        height: ${height}px;
        position: fixed;
        background: ${background};
        border-radius: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
        cursor: pointer;

        z-index: ${zIndex.fab}
        bottom: ${this.props.offsetY ? 16 + this.props.offsetY : 16}px;        
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
