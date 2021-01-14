import { VERSION } from './version'

/** Creates a new Task using setTimeout() */
export const task = (task: () => void) => setTimeout(task, 0)

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
  let observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.removedNodes.forEach((removed) => {
        if (isDescendant(element, removed)) {
          callback()
          if (observer) {
            // allow garbage collection
            observer.disconnect()
            // @ts-ignore
            observer = undefined
          }
        }
      })
    })
  })
  observer.observe(document, {
    childList: true,
    subtree: true,
  })
  return observer
}

export const printVersion = () => {
  const info = `Powered by nano JSX v${VERSION}`
  console.log(
    `%c %c %c %c %c ${info} %c http://nanojsx.io`,
    'background: #ff0000',
    'background: #ffff00',
    'background: #00ff00',
    'background: #00ffff',
    'color: #fff; background: #000000;',
    'background: none'
  )
}
