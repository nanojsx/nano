import { Component } from '../component'
import { h, strToHash } from '../core'
import { Icon } from './icon'

interface ListProps {
  small?: boolean
  children?: any
}

interface ListItemProps {
  icon?: string
  avatar?: string
  square?: string
  image?: string
  children?: any
}

export class ListItem extends Component<ListItemProps> {
  render() {
    const { props: p } = this

    const adjustedMargin = 'margin-right: 16px;'

    const icon = p.icon ? h(Icon, { size: 20, style: 'margin-right: 32px;', src: p.icon }) : null
    const avatar = p.avatar
      ? h('img', { src: p.avatar, width: 40, height: 40, style: 'border-radius: 20px; ' + adjustedMargin })
      : null
    const square = p.square ? h('img', { src: p.square, width: 56, height: 56, style: adjustedMargin }) : null
    const image = p.image
      ? h('img', { src: p.image, width: 100, height: 56, style: 'margin-left: -16px; margin-right: 16px;' })
      : null
    const text = h('span', null, p.children)

    // additional style for the list item
    let style = ''
    if (p.icon || p.avatar) style += 'min-height: 56px; '
    if (p.square || p.image) style += 'min-height: 72px; '

    return h('li', { style }, icon, avatar, square, image, text)
  }
}

export class List extends Component<ListProps> {
  cssHash: string

  render() {
    const { small = false } = this.props

    this.cssHash = strToHash('List' + small.toString())

    const styles = `
      .list-${this.cssHash} ul {
        margin: 0px;
        padding: 8px 16px;
      }

      .list-${this.cssHash} ul li {
        list-style: none;
        min-height: ${small ? 32 : 46}px;
        display: flex;
        align-items: center;
        margin: 0px -16px;
        padding: 0px 16px;
        cursor: pointer;
      }

      .list-${this.cssHash} ul li span {
        font-size: 16px;
      }

      .list-${this.cssHash} ul li:hover  {
        background:#00000010
      }    
    `
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (!el) {
      const styleElement = h('style', { 'data-css-hash': this.cssHash }, styles)
      document.head.appendChild(styleElement)
    }

    const ul = h('ul', null, this.props.children)
    return h('div', { class: `list-${this.cssHash}` }, ul)
  }
}
