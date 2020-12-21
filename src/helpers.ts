export const nodeToString = (node: any) => {
  const tmpNode = document.createElement('div')
  tmpNode.appendChild(node.cloneNode(true))
  return tmpNode.innerHTML
}

const isDescendant: any = (desc: any, root: any) => {
  return !!desc && (desc === root || isDescendant(desc.parentNode, root))
}

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
export const onNodeRemove = (element: any, callback: any) => {
  var observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.removedNodes.forEach((removed) => {
        if (isDescendant(element, removed)) {
          callback()
          // allow garbage collection
          observer.disconnect()
          // @ts-ignore
          observer = undefined
        }
      })
    })
  })
  observer.observe(document, {
    childList: true,
    subtree: true,
  })
}
