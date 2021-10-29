export { Fragment } from '../fragment.ts'
import { h } from '../core.ts'

const createNode: (type: any, props: any, key: string, source?: string, self?: string) => any = function (type, props) {
  const { children, ..._props } = props
  return h(type, _props, children ?? [])
}

export { createNode as jsx }
export { createNode as jsxs }
export { createNode as jsxDev }
