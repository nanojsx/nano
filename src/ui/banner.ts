import { Component } from '../component'
import { h } from '../core'
import { Button } from './button'
import { zIndex } from './_config'

interface BannerAction {
  name: string
  id?: string | number
  color?: string
}

interface BannerActionEvent {
  action: string
}

interface BannerProps {
  title?: string
  body?: string
  actions?: BannerAction[]
  onAction?: () => BannerActionEvent
  parentId?: string
  sticky?: number
}

export class Banner extends Component<BannerProps> {
  defaultActionColor = '#6200EE'

  render() {
    const {
      sticky,
      body = 'There was a problem processing a transaction on your credit card.',
      actions = [
        { name: 'fix it', color: this.defaultActionColor },
        { name: 'learn more', color: this.defaultActionColor },
      ],
    } = this.props

    const stickyStyles = sticky
      ? `
    position: -webkit-sticky;
    position: sticky;
    top: ${sticky}px;`
      : ''

    const styles = {
      container: `
        margin: -16px -16px 16px -16px;
        ${stickyStyles}
        z-index: ${zIndex.banner}
        `,
      banner: `    

        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;


        background: white;
        border-bottom: 1px rgb(0 0 0 / 0.12) solid;
        min-height: 54px;`,
      body: `
        color: #000000;
        padding: 16px;
        padding-bottom: 8px;
        font-size: 16px;  
        line-height: 1.5em;`,
      actions: `
        margin: 0;
        padding: 8px;        
        display: flex;
        flex-direction: row;
        align-items: flex-end; 
        margin-left: auto;
        flex-wrap: wrap;
        justify-content: flex-end;
        `,
      action: `
        margin-bottom: 0px;
        margin-left: 10px;`,
    }

    const actionsArray = actions.map((action: any) => {
      return h(
        Button,
        {
          text: true,
          color: action.color || this.defaultActionColor,
          style: styles.action,
          // style: `color: ${action.color || this.defaultActionColor}`,
          onClick: () => {
            // callback({ name: action.name, id: action.id })
            // this.remove()
          },
        },
        action.name.toUpperCase()
      )
    })

    const bodyElement = h('div', { style: styles.body }, body)
    const actionsElement = h('div', { style: styles.actions }, actionsArray)
    const bannerElement = h('div', { style: styles.banner }, bodyElement, actionsElement)

    return h('div', { style: styles.container }, bannerElement)
  }
}
