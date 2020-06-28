export const Fragment = (props: any) => {
  return props.children
}

export const nodeToString = (node: any) => {
  const tmpNode = document.createElement('div')
  tmpNode.appendChild(node.cloneNode(true))
  return tmpNode.innerHTML
}

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
