import { VERSION } from './version'

/** Creates a new Task using setTimeout() */
export const task = (task: () => void) => setTimeout(task, 0)

export const nodeToString = (node: Node) => {
  const tmpNode = document.createElement('div')
  tmpNode.appendChild(node.cloneNode(true))
  return tmpNode.innerHTML
}

export const detectSSR = (): boolean => {
  const isDeno = typeof Deno !== 'undefined'
  const hasWindow = typeof window !== 'undefined' ? true : false
  return (typeof _nano !== 'undefined' && _nano.isSSR) || isDeno || !hasWindow
}

function isDescendant(desc: ParentNode | null, root: Node): boolean {
  return !!desc && (desc === root || isDescendant(desc.parentNode, root))
}

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
export const onNodeRemove = (element: HTMLElement, callback: () => void) => {
  let observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.removedNodes.forEach(removed => {
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
    subtree: true
  })
  return observer
}

// https://stackoverflow.com/a/6234804
export const escapeHtml = (unsafe: string) => {
  if (unsafe && typeof unsafe === 'string')
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  return unsafe
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
