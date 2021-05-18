import { Component } from '../component.ts'
import { h } from '../core.ts'

const classes = {
  bar: 'toolbar_container',
  left: 'toolbar_left',
  right: 'toolbar_right',
  icon: 'toolbar_icon'
}
interface ToolbarProps {
  menu?: boolean
  back?: boolean
  actionClick?: Function
  title?: string
  children?: any
}

export class Toolbar extends Component<ToolbarProps> {
  static setTitle(title: string) {
    const el = document.querySelector('.toolbar_title') as HTMLElement
    if (el) el.innerText = title
  }

  render() {
    const styles = `
      .toolbar_container {
        padding: 16px;
      }

      .toolbar_container .toolbar_text {
        font-size: 20px;
        margin-left: 24px;
      }

      .toolbar_container .toolbar_icon {
        width: 22px;
        height: 22px;
        margin-left: 24px;

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
      .toolbar_hamburger_button::before,
      .toolbar_hamburger_button::after {
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

      .toolbar_button_wrapper {
        width: 24px;
        height: 24px;
        padding: 2px;
        position: relative;
        top: -2px;
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

    document.head.appendChild(h('style', {}, styles))

    const { back = false, actionClick = () => {}, menu } = this.props

    const navigationAction = menu
      ? h(
          'div',
          {
            class: 'toolbar_button_wrapper',
            onClick: actionClick
          },
          h('div', { class: 'toolbar_hamburger_button' })
        )
      : back
      ? h(
          'div',
          {
            class: 'toolbar_button_wrapper',
            onClick: actionClick
          },
          h('div', {
            class: 'toolbar_back_button'
          })
        )
      : null

    const navigation = navigationAction ? h('div', { class: 'toolbar_navigation_box' }, navigationAction) : null

    const title = this.props.title ? h('div', { class: 'toolbar_title' }, this.props.title) : null

    const left = h('div', { class: classes.left }, navigation, title)
    const right = h('div', { class: classes.right }, this.props.children)

    const bar = h('div', { class: classes.bar }, left, right)

    return bar
  }
}
