import { h } from '../core'
import { boxShadow, zIndex } from './_config'

// snackbar just like just like: https://material.io/components/snackbars

/*
HOW TO USE:

const Button = (_props: any) => {
  const snackbar = new Snackbar()

  const onclickHandler = () => {
    snackbar.show({ message: 'Hello Snack! ' }, (event) => {
      console.log(event)
    })
  }

  return <button onClick={() => onclickHandler()}>click me</button>
}
 */

type Milliseconds = number

interface SnackbarAction {
  name: string
  id?: string | number
  color?: string
}

interface SnackbarActionEvent {
  action: string
}

interface SnackbarOptions {
  message?: string
  actions?: SnackbarAction[]
  onAction?: () => SnackbarActionEvent
  autoHide?: boolean | Milliseconds
  parentId?: string
  offsetY?: number
  consecutive?: boolean
}

export class Snackbar {
  defaultParentId = 'snackbar_container'
  defaultActionColor = '#BC86FC'

  constructor(public options: SnackbarOptions = {}) {
    const defaultOptions = {
      message: 'Hello Snack!',
      actions: [{ name: 'Dismiss', color: this.defaultActionColor }],
      autoHide: true,
      consecutive: true,
      offsetY: 0,
    }

    this.options = { ...defaultOptions, ...options }

    // styles
    const styles = `
      #snackbar_container {    
        position: fixed;
        bottom: ${this.options.offsetY}px;
        left: 0px;
        overflow: hidden;
        z-index: ${zIndex.snackbar}
      }

      #snackbar_container .snackbar_snack {
        background-color: #323232;

        padding: 16px 16px 16px 16px;
        margin: 0px 8px 8px 8px;

        border-radius: 4px;
        width: 344px;
        max-width: calc(100vw - 16px);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        height: fit-content;
        overflow: hidden;

        ${boxShadow}

        animation-name: snackbar-fadein;
        animation-duration: 0.2s;

        transition: opacity 0.2s;
        opacity: 1;
      }

      #snackbar_container .snackbar_snack_fadeout {
        opacity: 0;
      } 

      #snackbar_container .snackbar_snack .snackbar_message {
        color: #DFDFDF;
        font-size: 16px;
        align-self: center;
      }

      #snackbar_container .snackbar_snack .snackbar_actions {
        align-self: center;
      }

      #snackbar_container .snackbar_snack .snackbar_action {
        font-size: 16px;
        cursor: pointer;
        padding: 8px;
        margin-right: -8px;
      }

      @keyframes snackbar-fadein {
        from {opacity: 0;}
        to {opacity: 1;}
      }
    `
    const styleElement = h('style', {}, styles)
    document.head.appendChild(styleElement)
  }

  private getParentElement(parentId: string) {
    let el = document.getElementById(parentId || this.defaultParentId)
    if (!el) {
      el = document.createElement('div')
      el.id = this.defaultParentId
      document.body.appendChild(el)
    }

    return el
  }

  public remove(el: HTMLElement) {
    el.classList.add('snackbar_snack_fadeout')
    setTimeout(() => el.remove(), 200)
  }

  public show(options: SnackbarOptions | null, callback: (event: { name: string; id: string | number }) => void) {
    if (this.options.consecutive) {
      const snacks = document.querySelectorAll('.snackbar_snack') as NodeListOf<HTMLElement>
      snacks.forEach((s) => this.remove(s))
      if (snacks.length > 0) setTimeout(() => this._show(options, callback), 200 + 20)
      else this._show(options, callback)
      return
    }

    this._show(options, callback)
  }

  private _show(options: SnackbarOptions | null, callback: (event: { name: string; id: string | number }) => void) {
    options = { ...this.options, ...options }

    let container = this.getParentElement(options.parentId || this.defaultParentId)
    let el: HTMLElement

    const Snack = (_message: string, _actions: any) => {
      const actionsArray = _actions.map((action: any) => {
        return h(
          'a',
          {
            class: 'snackbar_action',
            style: `color: ${action.color || this.defaultActionColor}`,
            onClick: () => {
              callback({ name: action.name, id: action.id })
              this.remove(el)
            },
          },
          action.name.toUpperCase()
        )
      })
      const message = h('div', { class: 'snackbar_message' }, _message)
      const actions = h('div', { class: 'snackbar_actions' }, actionsArray)
      const snack = h('div', { class: 'snackbar_snack' }, message, actions)
      return snack
    }

    el = Snack(options.message as string, options.actions || []) as HTMLElement

    // autoHide options
    if (options.autoHide === true) setTimeout(() => this.remove(el), 5000)
    else if (typeof options.autoHide === 'number') setTimeout(() => this.remove(el), options.autoHide)

    container.appendChild(el)
  }
}
