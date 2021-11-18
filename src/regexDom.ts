import { escapeHtml } from './helpers'

export class HTMLElementSSR {
  ssr: string
  tagName: string
  isSelfClosing: boolean = false
  nodeType: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 = null

  constructor(tag: string) {
    this.tagName = tag

    const selfClosing = [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr'
    ]

    this.nodeType = 1

    if (selfClosing.indexOf(tag) >= 0) {
      this.ssr = `<${tag} />`
      this.isSelfClosing = true
    } else {
      this.ssr = `<${tag}></${tag}>`
    }
  }

  get outerHTML() {
    return this.innerText
  }

  get innerHTML() {
    const reg = /(^<[a-z]+>)([\s\S]*)(<\/[a-z]+>$)/gm
    return reg.exec(this.ssr)?.[2] ?? ''
  }

  set innerHTML(text) {
    this.ssr = text
  }

  get innerText() {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    return reg.exec(this.ssr)?.[2] ?? ''
  }

  set innerText(text) {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    this.ssr = this.ssr.replace(reg, `$1${text}$3`)
  }

  get attributes() {
    return { length: 1 }
  }

  toString() {
    return this.ssr
  }

  setAttributeNS(name: string, value: string) {
    this.setAttribute(name, value)
  }

  setAttribute(name: string, value: string) {
    if (this.isSelfClosing)
      this.ssr = this.ssr.replace(/(^<[a-z]+ )(.+)/gm, `$1${escapeHtml(name)}="${escapeHtml(value)}" $2`)
    else this.ssr = this.ssr.replace(/(^<[^>]+)(.+)/gm, `$1 ${escapeHtml(name)}="${escapeHtml(value)}"$2`)
  }

  appendChild(child: any) {
    const append = child.ssr ? child.ssr : child

    const index = this.ssr.lastIndexOf('</')

    this.ssr = this.ssr.substring(0, index) + append + this.ssr.substring(index)
  }

  replaceChild(newChild: any, _oldChild?: any) {
    this.innerText = newChild.ssr
  }

  get children() {
    const reg = /<([a-z]+)((?!<\/\1).)*<\/\1>/gms

    const array = []

    let match

    while ((match = reg.exec(this.innerHTML)) !== null) {
      array.push(match[0].replace(/[\s]+/gm, ' '))
    }

    return array
  }

  addEventListener<K extends keyof DocumentEventMap>(
    _type: keyof K,
    _listener: (this: Document, ev: DocumentEventMap[K]) => any,
    _options?: boolean | AddEventListenerOptions | undefined
  ) {}
}

export class DocumentSSR {
  body: HTMLElementSSR
  head: HTMLElementSSR

  constructor() {
    this.body = this.createElement('body')
    this.head = this.createElement('head')
  }

  createElement(tag: string) {
    return new HTMLElementSSR(tag)
  }

  createElementNS(_URI: string, tag: string) {
    return new HTMLElementSSR(tag)
  }

  createTextNode(text: string) {
    return escapeHtml(text)
  }

  querySelector(_query: string) {
    return undefined
  }
}

const documentSSR = () => {
  return new DocumentSSR() as unknown as Document
}

export { documentSSR }
