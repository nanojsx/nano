export const createContext = (ctx: any) => {
  let _ctx = ctx
  return {
    Provider: (props: any) => {
      if (props.value) _ctx = props.value
      return props.children
    },
    Consumer: (props: any) => {
      return { component: props.children[0](_ctx), props: { ...props, context: _ctx } }
    },
    get: () => _ctx,
    set: (ctx: any) => (_ctx = ctx),
  }
}
