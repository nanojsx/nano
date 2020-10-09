import { Component } from '../component'
import { h, strToHash, render } from '../core'
import { boxShadow, zIndex } from './_config'

interface SheetProps {
  height?: string
  width?: string
  radius?: boolean
  mode?: 'side' | 'bottom' | 'right' | 'left' | 'custom'
  title?: string
  subtitle?: string
}

export class Sheet extends Component<SheetProps> {
  static Show(sheet: Sheet) {
    document.body.appendChild(render(sheet))
  }

  render() {
    const { mode = 'custom', title, subtitle } = this.props

    const cssHash = strToHash('sheet' + mode)

    const isSide = mode === 'side' || mode === 'right' || mode === 'left'
    const isBottom = mode === 'bottom'
    const fadeIn = mode === 'side' ? 'left' : mode
    const borderRadius = mode === 'bottom' ? 'border-radius: 4px;' : ''

    let sheetStyles = ''

    if (isSide) {
      sheetStyles += `
        min-width: 256px;
        max-width: calc(100vw - 56px);
        height: 100vh;

        top: 0;
        ${mode === 'right' ? 'right' : 'left'}: 0;`
    }

    if (isBottom) {
      sheetStyles += `
        width: 100vw;
        bottom: 0px;      
        left: 0;`
    }

    const styles = `
      @keyframes sheet_fadein_${fadeIn}-${cssHash} {
        from {${fadeIn}: -100%;}
        to {${fadeIn}: 0;}
      }

      .sheet_container-${cssHash} {
      }

      .sheet_sheet-${cssHash} {
        overflow: scroll;
        max-height: 100vh;

        ${sheetStyles}
        background: white;
        position: fixed;

        ${borderRadius}

        box-sizing: border-box;
        ${boxShadow}

        z-index: ${zIndex.sheet}

        animation-name: sheet_fadein_${fadeIn}-${cssHash};
        animation-duration: 0.2s;

        transition: top 2s, right 2s, bottom 2s, left 2s;
      }

      .sheet_background-${cssHash} {
        background: #00000070;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        z-index: ${zIndex.sheet}

        animation-name: sheet-background-fadein;
        animation-duration: 0.2s;
      }

      @keyframes sheet-background-fadein {
        from {opacity: 0;}
        to {opacity: 1;}
      }
      
      .sheet_title-${cssHash} {
        padding: 20px 16px 0px;
        font-size: 24px;
      }
      
      .sheet_subtitle-${cssHash} {
        padding: 8px 16px;
        font-size: 14px;
        color: #000000b0;
      }`

    const el = document.querySelector(`[data-css-hash*="${cssHash}"]`)
    if (!el) {
      const styleElement = h('style', { 'data-css-hash': cssHash }, styles)
      document.head.appendChild(styleElement)
    }

    let element: HTMLElement

    const background = h('div', {
      class: `sheet_background-${cssHash}`,
      onClick: () => {
        element.remove()
      },
    })
    const t = title ? h('div', { class: `sheet_title-${cssHash}` }, title) : null
    const s = subtitle ? h('div', { class: `sheet_subtitle-${cssHash}` }, subtitle) : null

    // @ts-ignore
    const sh = h('div', { class: `sheet_sheet-${cssHash}` }, t, s, this.props.children)

    element = h('div', { class: `sheet_container-${cssHash}` }, background, sh)

    return element
  }
}
