import { h, removeAllChildNodes, render } from '../core'
import { boxShadow, zIndex } from './_config'

// interface MenuItem {
//   item: any
// }

interface MenuOptions {
  position: { x: number; y: number }
  list: any
}

export class Menu {
  defaultParentId = 'menu_items_container'
  cssHash = Math.random().toString(36).substr(2, 9)

  didUnmount() {
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (el) el.remove()
  }

  private getParentElement(id: string) {
    // delete all other
    const others = document.querySelectorAll(`[id^="${this.defaultParentId}"]`)
    others.forEach((e) => {
      e.remove()
    })

    let el = document.getElementById(`${this.defaultParentId}-${id}`)
    if (!el) {
      el = document.createElement('div')
      el.id = `${this.defaultParentId}-${id}`
    }

    removeAllChildNodes(el)
    document.body.appendChild(el)

    return el
  }

  close() {
    removeAllChildNodes(this.getParentElement(this.cssHash))
  }

  open(menuOptions: MenuOptions) {
    const { position, list } = menuOptions

    // check in which corner the menu appears and adjust fixed position.
    const left = position.x < window.innerWidth / 2 ? 'left' : 'right'
    const top = position.y < window.innerHeight / 2 ? 'top' : 'bottom'

    const styles = `
   
    #menu_items_background-${this.cssHash} {
      width: 100vw;
      height: 100vh;
      background: transparent;
      position: fixed;
      top: 0;
      left: 0;
      z-index: ${zIndex.menu}      
    }
   
    #menu_items_list-${this.cssHash} {
      position: fixed;
      background: white;
      
      border-radius: 4px;
      min-width: 112px;

      ${top}: ${position.y > window.innerHeight / 2 ? window.innerHeight - position.y : position.y}px;
      ${left}: ${position.x > window.innerWidth / 2 ? window.innerWidth - position.x : position.x}px;

      z-index: ${zIndex.menu}

      ${boxShadow}
    }

    `

    // remove old styles
    const el = document.querySelector(`[data-css-hash*="${this.cssHash}"]`)
    if (el) el.remove()

    // add new styles
    const styleElement = h('style', { 'data-css-hash': this.cssHash }, styles)
    document.head.appendChild(styleElement)

    const itemsList = h('div', { id: `menu_items_list-${this.cssHash}` }, list)
    const itemsBg = h('div', { onClick: () => this.close(), id: `menu_items_background-${this.cssHash}` }, itemsList)

    itemsList.addEventListener('click', (e: Event) => e.stopPropagation())

    this.getParentElement(this.cssHash).appendChild(render(itemsBg))
  }
}
