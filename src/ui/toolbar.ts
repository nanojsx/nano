import { Component } from '../component'
import { h, render } from '../core'

const classes = {
  bar: 'toolbar_container',
  left: 'toolbar_left',
  right: 'toolbar_right',
  icon: 'toolbar_icon',
}
interface ToolbarProps {
  menu?: boolean
  title?: string
  icons?: any
}

export class Toolbar extends Component<ToolbarProps> {
  render() {
    const styles = `
      .toolbar_container {
        padding: 16px;
      }

      .toolbar_container i.toolbar_icon {
        width: 22px;
        height: 22px;
        display: inline-block;
        content: '';

        /*-webkit-mask: url(YOUR_SVG_URL) no-repeat 50% 50%;
        mask: url(YOUR_SVG_URL) no-repeat 50% 50%;*/

        -webkit-mask-size: cover;
        mask-size: cover; 

        background-color: white;
      }

      .toolbar_navigation_box {
        padding: 4px;
        width: 20px;
        height: 16px;
        margin-right: 32px;
        cursor: pointer;
      }

      .toolbar_hamburger_button,
      .toolbar_hamburger_button_hamburger_button::before,
      .toolbar_hamburger_button_hamburger_button::after {
        position: absolute;
        width: 20px;
        height: 2px;
        border-radius: 2px;
        background: white;
        content: '';
      }
      .toolbar_hamburger_button::before {
        top: 6px;
      }
      .toolbar_hamburger_button::after {
        top: 12px;
      }

      .toolbar_back_button,
      .toolbar_back_button::before,
      .toolbar_back_button::after {
        position: relative;
        top: 7px;
        width: 20px;
        height: 2px;
        border-radius: 2px;
        background: white;
        content: '';
      }

      .toolbar_back_button::before {
        position: absolute;
        top: -5px;
        transform: translate3d(-4px,0,0) rotate(-45deg) scaleX(.7);
      }

      .toolbar_back_button::after {
        position: absolute;
        top: 5px;
        transform: translate3d(-4px,0,0) rotate(45deg) scaleX(.7);
      }
    `

    const styleElement = h('style', {}, styles)
    document.head.appendChild(styleElement)

    // const hamburger = h('div', { class: 'bar_hamburger_button' })
    const back = h('div', { class: 'toolbar_back_button' })

    const navigation = this.props.menu ? h('div', { class: 'toolbar_navigation_box' }, back) : null

    const title = this.props.title ? h('div', { class: 'toolbar_title' }, this.props.title) : null

    const icons = this.props.icons
      ? Object.keys(this.props.icons).map((key) => {
          const icon = this.props.icons[key]
          return render(icon)
        })
      : []

    const left = h('div', { class: classes.left }, navigation, title)
    const right = h('div', { class: classes.right }, ...icons)

    const bar = h('div', { class: classes.bar }, left, right)

    return bar
  }
}
