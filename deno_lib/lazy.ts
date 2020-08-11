import { hydrate, h } from './core.ts'
import { Visible } from './components/visible.ts'

export const hydrateLazy = (component: any, parent: HTMLElement | null = null, removeChildNodes = true) => {
  const c = h(Visible, null, component)
  return hydrate(c, parent, removeChildNodes)
}
