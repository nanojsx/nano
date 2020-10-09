import { h } from '../core'
import { boxShadow, zIndex } from './_config'
import { Button } from './button'

// Dialog just like just like: https://material.io/components/Dialogs

/*
HOW TO USE:

const Button = (_props: any) => {
  const Dialog = new Dialog()

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
        { name: 'Action 2', color: this.defaultActionColor },
      ],
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

  public remove() {
    const el = document.getElementById('dialog_container')
    if (!el) return
    el.classList.add('dialog_fadeout')
    setTimeout(() => el.remove(), 200)
  }

  public show(options: DialogOptions | null, callback: (event: { name: string; id: string | number }) => void) {
    options = { ...this.options, ...options }

    let container = this.getParentElement(options.parentId || this.defaultParentId)

    if (container.hasChildNodes()) return

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
            },
          },
          action.name.toUpperCase()
        )
      })

      const title = h('h2', { class: 'dialog_header' }, _header)
      const body = h('div', { class: 'dialog_body' }, _body)
      const actions = h('div', { class: 'dialog_actions' }, actionsArray)
      const dialog = h('div', { class: 'dialog' }, title, body, actions)
      return dialog
    }

    const el = Dialog(options.title, options.body as string, options.actions || []) as HTMLElement

    container.appendChild(el)

    const dialog = document.getElementsByClassName('dialog')[0]
    const actions = document.getElementsByClassName('dialog_actions')[0]

    // if the actions are too long, we prefer to set flex-direction to column than to wrap the single actions
    const useColumn = dialog.clientWidth <= actions.clientWidth
    if (useColumn) actions.setAttribute('style', 'flex-direction: column;')
  }
}
