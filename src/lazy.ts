import { hydrate, h } from './core'
import { Visible } from './components/visible'

export const hydrateLazy = (component: any, parent: HTMLElement | null = null, removeChildNodes = true) => {
  const c = h(Visible, null, component)
  return hydrate(c, parent, removeChildNodes)
}
