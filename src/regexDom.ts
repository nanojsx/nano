import { escapeHtml } from './helpers'

class HTMLElementSSR {
  public tagName: string
  public isSelfClosing: boolean = false
  public nodeType: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 = null
  private _ssr: string

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
      this._ssr = `<${tag} />`
      this.isSelfClosing = true
    } else {
      this._ssr = `<${tag}></${tag}>`
    }
  }

  get outerHTML() {
    return this._ssr
  }

  get innerHTML(): string {
    const reg = /(^<[^>]+>)(.*)(<\/[^>]+>$)/gs
    const matches = reg.exec(this._ssr)
    if (!matches || matches.length < 2) return ''
    return matches[2]
  }

  set innerHTML(text) {
    const reg = /(^<[^>]+>)(.*)(<\/[^>]+>$|\/>$)/gs
    this._ssr = this._ssr.replace(reg, `$1${text}$3`)
  }

  get innerText(): string {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    return reg.exec(this._ssr)?.[2] || ''
  }

  set innerText(text) {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    this._ssr = this._ssr.replace(reg, `$1${text}$3`)
  }

  getAttribute(_name: any) {
    return null
  }

  get classList() {
    const element = this._ssr

    const classesRegex = /^<\w+.+(\sclass=")([^"]+)"/gm

    return {
      add: (name: string) => {
        this.setAttribute('class', name)
      },
      entries: {
        get length(): number {
          const classes = classesRegex.exec(element)
          if (classes && classes[2]) return classes[2].split(' ').length
          return 0
        }
      }
    }
  }

  toString() {
    return this._ssr
  }

  setAttributeNS(_namespace: string | null, name: string, value: string) {
    this.setAttribute(name, value)
  }

  setAttribute(name: string, value: string) {
    if (this.isSelfClosing)
      this._ssr = this._ssr.replace(/(^<[a-z]+ )(.+)/gm, `$1${escapeHtml(name)}="${escapeHtml(value)}" $2`)
    else this._ssr = this._ssr.replace(/(^<[^>]+)(.+)/gm, `$1 ${escapeHtml(name)}="${escapeHtml(value)}"$2`)
  }

  get attributes() {
    const childrenless = this._ssr.match(/<.*>/)

    if (!childrenless) return []

    const attrs = [...childrenless[0].matchAll(/([\w-]+?)="([^"]*)"/gm)].map(matches => matches[0])

    return attrs.map(attr => {
      const [name, value] = attr.split('=')
      return { name, value }
    })
  }

  append(child: any) {
    this.appendChild(child)
  }

  appendChild(child: any) {
    const index = this._ssr.lastIndexOf('</')
    this._ssr = this._ssr.substring(0, index) + child + this._ssr.substring(index)
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
  body: HTMLElement
  head: HTMLElement

  constructor() {
    this.body = this.createElement('body')
    this.head = this.createElement('head')
  }

  createElement(tag: string) {
    return new HTMLElementSSR(tag) as unknown as HTMLElement
  }

  createElementNS(_URI: string, tag: string) {
    return new HTMLElementSSR(tag) as unknown as HTMLElement
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
