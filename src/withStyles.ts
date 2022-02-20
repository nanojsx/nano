import { h } from './core.js'
import { Component } from './component.js'
import { Fragment } from './fragment.js'
import { Helmet } from './components/helmet.js'

interface ObjectHasToString {
  toString: () => string
}
type Styles = string
type FunctionReturnsString = () => string
type WithStylesType = Styles | ObjectHasToString | FunctionReturnsString

export const withStyles: any =
  (...styles: WithStylesType[]) =>
  (WrappedComponent: any) => {
    return class extends Component {
      render() {
        const { children, ...rest } = this.props

        const helmets: any[] = []
        styles.forEach(style => {
          if (typeof style === 'string') {
            helmets.push(h(Helmet, null, h('style', null, style)))
          } else if (typeof style === 'function') {
            const _style = style()
            if (typeof _style === 'string') {
              helmets.push(h(Helmet, null, h('style', null, _style)))
            }
          } else if (typeof style === 'object') {
            const _style = style.toString?.()
            if (typeof _style === 'string') {
              helmets.push(h(Helmet, null, h('style', null, _style)))
            }
          }
        })

        const component =
          children && children.length > 0
            ? h(WrappedComponent, { ...rest }, children)
            : h(WrappedComponent, { ...this.props })

        return h(Fragment, null, ...helmets, component)
      }
    }
  }
