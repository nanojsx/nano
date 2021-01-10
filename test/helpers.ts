export const wait = (ms: number = 100): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const nodeToString = (node: any) => {
  const tmpNode = document.createElement('div')
  tmpNode.appendChild(node.cloneNode(true))
  return tmpNode.innerHTML
}

export const mockIntersectionObserver = () => {
  class mockIntersectionObserver {
    constructor(public fnc: (entries: any, observer: any) => {}) {}

    observe(_element: HTMLElement) {
      const entries: any = [{ isIntersecting: true }]
      const observer = this

      setTimeout(() => {
        this.fnc(entries, observer)
      }, 200)
    }

    disconnect() {}
  }
  window.IntersectionObserver = mockIntersectionObserver as any
}
