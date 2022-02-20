import { h } from '../core.ts'
import { boxShadow, zIndex } from './_config.ts'
import { Button } from './button.ts'

// Dialog just like just like: https://material.io/components/dialogs

/*
HOW TO USE:

const Button = (_props: any) => {
  const dialog = new Dialog()

  const onclickHandler = () => {
    dialog.show({ 
      title: 'Hello', 
      body: 'Some text.', 
      actions: [{name: 'Action 1'}] 
    }, (event) => {
      console.log(event)
    })
  }

  return <button onClick={() => onclickHandler()}>click me</button>
}
 */

interface DialogAction {
  name: string
  id?: string | number
  color?: string
}

interface DialogActionEvent {
  action: string
}

interface DialogOptions {
  title?: string
  body?: string
  actions?: DialogAction[]
  onAction?: () => DialogActionEvent
  parentId?: string
  firstFocusAction?: string | boolean
}

export class Dialog {
  defaultParentId = 'dialog_container'
  defaultActionColor = '#6200EE'

  constructor(public options: DialogOptions = {}) {
    const defaultOptions = {
      title: 'Dialog Title',
      body: 'Dialog body text.',
      actions: [
        { name: 'Action 1', color: this.defaultActionColor },
        { name: 'Action 2', color: this.defaultActionColor }
      ],
      firstFocusAction: false
    }

    this.options = { ...defaultOptions, ...options }

    // styles
    const styles = `
    #dialog_container {  
      background: #00000070;
      position: fixed;
      bottom: 0px;
      left: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      
      z-index: ${zIndex.dialog}

      animation-name: dialog-fadein;
      animation-duration: 0.2s;

      transition: opacity 0.2s;
      opacity: 1;
    }

    #dialog_container.dialog_fadeout {
      opacity: 0;
    } 

    #dialog_container .dialog {
      background-color: white;
      border-radius: 4px;
      min-width: 240px;
      max-width: min(500px, 80%);

      margin: 8px;

      ${boxShadow}
    }

    #dialog_container .dialog .dialog_header {
      color: #000000DE;
      font-size: 20px;
      padding: 0px 24px 9px;
      margin: 24px 0px 6px 0px;
      line-height: 1;
    }

    #dialog_container .dialog .dialog_body {
      color: #00000099;
      font-size: 16px;  
      padding: 0px 24px 20px;
      line-height: 1.5em;
    }

    #dialog_container .dialog .dialog_actions {
      
      margin: 0;
      padding: 8px;
      
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      float: right;

      flex-wrap: wrap;
      justify-content: flex-end;
    }

    #dialog_container .dialog .dialog_action {
      margin-bottom: 0px;
      margin-left: 10px;
    }

    /*#dialog_container .dialog .dialog_action:hover {
      border-radius: 4px;      
      background: #0000000a;
    }*/

    @keyframes dialog-fadein {
      from {opacity: 0;}
      to {opacity: 1;}
    }
    `

    document.head.appendChild(h('style', {}, styles))

    this.handleKeydown = this.handleKeydown.bind(this)
  }

  private getParentElement(parentId: string) {
    let el = document.getElementById(parentId || this.defaultParentId) as any

    if (!el) {
      el = document.createElement('div')
      el.id = this.defaultParentId
      el.ariaHidden = 'true'
      document.body.appendChild(el)
    }

    return el as HTMLDivElement
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.remove()
    }

    if (event.key === 'Tab') {
      event.preventDefault()

      const actions = Array.from(document.querySelectorAll('.dialog_action')) as HTMLElement[]
      if (actions.length < 1) {
        return
      }
      const currentFocus = actions.findIndex(el => document.activeElement === el)
      if (currentFocus === -1) {
        actions[0].focus()
      }

      const nextFocus = currentFocus + (event.shiftKey ? -1 : 1)

      if (nextFocus === -1) {
        actions[actions.length - 1].focus()
        return
      }

      if (nextFocus === actions.length) {
        actions[0].focus()
        return
      }

      actions[nextFocus].focus()
    }
  }

  public remove() {
    const el = document.getElementById('dialog_container')
    if (!el) return
    el.classList.add('dialog_fadeout')
    setTimeout(() => {
      el.remove()
      window.removeEventListener('keydown', this.handleKeydown)
      this.enableScroll()
    }, 200)
  }

  private disableScroll() {
    document.body.style.overflow = 'hidden'
  }

  private enableScroll() {
    // default
    document.body.style.overflow = ''
  }

  private focusAction(focusActionId: string, actions: DialogAction[]) {
    const actionElements = Array.from(document.querySelectorAll('.dialog_action')) as HTMLElement[]
    const focusTargetIndex = actions.findIndex(action => action.id === focusActionId)
    const focusTarget = actionElements[focusTargetIndex]
    if (focusTarget) {
      focusTarget.focus()
    }
  }

  private focusFirstAction() {
    const actionElements = Array.from(document.querySelectorAll('.dialog_action')) as HTMLElement[]
    const focusTarget = actionElements[0]
    if (focusTarget) {
      focusTarget.focus()
    }
  }

  public show(options: DialogOptions | null, callback: (event: { name: string; id: string | number }) => void) {
    options = { ...this.options, ...options }

    const container = this.getParentElement(options.parentId || this.defaultParentId)

    if (container.hasChildNodes()) return

    // remove dialog when container (background) gets clicked
    container.addEventListener('click', e => {
      if (e.target === container) this.remove()
    })

    const Dialog = (_header: string | undefined, _body: string | undefined, _actions: any) => {
      const actionsArray = _actions.map((action: any) => {
        return h(
          Button,
          {
            text: true,
            color: action.color || this.defaultActionColor,
            class: 'dialog_action',
            // style: `color: ${action.color || this.defaultActionColor}`,
            onClick: () => {
              callback({ name: action.name, id: action.id })
              this.remove()
            }
          },
          action.name.toUpperCase()
        )
      })

      const title = h('h2', { class: 'dialog_header', id: 'dialog-title' }, _header)
      const body = h('div', { class: 'dialog_body' }, _body)
      const actions = h('div', { class: 'dialog_actions' }, actionsArray)
      const dialog = h(
        'div',
        { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dialog-title' },
        title,
        body,
        actions
      )
      return dialog
    }

    const el = Dialog(options.title, options.body as string, options.actions || []) as HTMLElement

    container.appendChild(el)

    const { firstFocusAction } = options
    if (options.actions && firstFocusAction) {
      if (typeof firstFocusAction === 'string') {
        this.focusAction(firstFocusAction, options.actions)
      } else {
        this.focusFirstAction()
      }
    }

    this.disableScroll()

    window.addEventListener('keydown', this.handleKeydown)

    const dialog = document.getElementsByClassName('dialog')[0]
    const actions = document.getElementsByClassName('dialog_actions')[0]

    // if the actions are too long, we prefer to set flex-direction to column than to wrap the single actions
    const useColumn = dialog.clientWidth <= actions.clientWidth
    if (useColumn) actions.setAttribute('style', 'flex-direction: column;')
  }
}
