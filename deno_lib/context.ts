export const createContext = (value: any) => {
  return {
    Provider: (props: any) => {
      if (props.value) value = props.value
      return props.children
    },
    Consumer: (props: any) => {
      return { component: props.children[0](value), props: { ...props, context: value } }
    },
  }
}
