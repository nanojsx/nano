/* eslint-disable prefer-template */
/* eslint-disable no-dupe-class-members */
class Tester {
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver
  _isAutomated = window.navigator.webdriver

  sendId = 0
  _description: any
  stats = { error: 0, warn: 0, success: 0 }
  tests: { description: string; fnc: Function }[] = []

  constructor() {}

  toSingleLine(str: string) {
    return str
      .split(/\r\n|\n|\r/gm)
      .map(l => l.trim())
      .join('')
  }

  init(ui: boolean) {
    if (this._isAutomated) return

    window.addEventListener('DOMContentLoaded', () => {
      const tester = document.createElement('div')
      tester.id = 'tester'
      tester.style.padding = '4% 10%'
      tester.style.position = 'absolute'
      tester.style.top = '0'
      tester.style.left = '0'
      tester.style.background = '#161925'
      tester.style.width = '100%'
      tester.style.minHeight = '100%'
      tester.style.boxSizing = 'border-box'
      document.body.appendChild(tester)

      // show or hide UI
      tester.style.display = ui ? 'unset' : 'none'

      const testerHud = this.createElement(
        'div',
        null,
        this.createElement('div', 'tests'),
        this.createElement('div', 'failures'),
        this.createElement('div', 'duration')
      )
      testerHud.id = 'tester-hud'
      testerHud.style.position = 'fixed'
      testerHud.style.top = '24px'
      testerHud.style.right = '24px'

      document.body.appendChild(testerHud)

      const style = document.createElement('style')
      style.innerText = this.toSingleLine(`    
        #tester { 
          color: #F8F8F2;
          background: #0c0e14;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: auto;
          white-space: nowrap;
        }
        #tester ul li.error {
          display: flex;
          flex-direction: column;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        #tester ul li.error span:not(:first-child) {
          margin-left: 18px;
        }
        #tester-hud {
          color: #F8F8F2;
          font-weight: 300;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;     
        }
      `)

      tester.prepend(style)
    })
  }

  end(startTime: number) {
    const total = this.stats.error + this.stats.warn + this.stats.success
    const success = this.stats.success
    const passing = this.clr.lightGreen(`${success}/${total} passing`)
    const duration = new Date().getTime() - startTime

    const hud = document.getElementById('tester-hud')
    if (hud) {
      const stats = [total.toString(), this.stats.error.toString(), duration.toString() + 'ms']
      Array.from(hud.children).forEach((c, i) => (c.innerHTML = c.innerHTML + ' ' + stats[i]))
    }

    setTimeout(() => {
      this.sendToServer(`\n${this.indent}${passing}\n`, 'end')

      // puppeteer waits for #done
      const done = this.createElement('div', 'done')
      done.id = 'done'
      document.body.appendChild(done)
    }, 100)
  }

  start(ui = true) {
    this.init(ui)

    // TODO(yandeu): check indent for nested describe()

    const startTime = new Date().getTime()

    const _start = async () => {
      for (let i = 0; i < this.tests.length; i++) {
        const { description, fnc } = this.tests[i]

        this.sendToServer(`\n• ${description}`)

        if (!this._isAutomated) {
          const ul = this.createElement('ul')
          ul.style.listStyle = 'none'
          ul.style.paddingLeft = '20px'
          this.testerDocument?.appendChild(ul)
        }

        this._description = description

        await fnc()
      }
      this.end(startTime)
    }

    // wait for five-server to connect
    const five = document.querySelector('[data-id="five-server"]')
    if (five) five.addEventListener('connected', _start)
    else window.addEventListener('load', _start)
  }

  describe(description, fnc) {
    this.tests.push({ description, fnc })
  }

  async wait(ms = 100): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  error(assertion, message, comment = '') {
    if (assertion === true) {
      this.stats.success++
      this.sendSuccess(message)
    } else {
      this.stats.error++
      this.sendError(message, comment)
    }
  }

  skip(assertion, message, comment = '') {
    this.sendSkip(message)
  }

  get indent() {
    return '  '
  }

  get sym() {
    return {
      fail: '✘',
      pass: '✔',
      skip: '⚙'
    }
  }

  get clr() {
    return {
      red: text => `\u001b[31m${text}\u001b[0m`,
      green: text => `\u001b[32m${text}\u001b[0m`,
      lightGreen: text => `\u001b[32;1m${text}\u001b[0m`,
      lightBlue: text => `\u001b[34;1m${text}\u001b[0m`,
      gray: text => `\u001b[90m${text}\u001b[0m`
    }
  }

  title(title) {}

  sendSuccess(msg, assertion?) {
    const symbol = this.clr.lightGreen(this.sym.pass)
    const message = this.clr.gray(msg)
    this.sendToServer(`${this.indent}${symbol} ${message}`)
  }

  sendError(msg, comment) {
    const error = this.clr.red(`${this.sym.fail} ${msg}`)
    const _comment = comment ? this.clr.gray(`\n${this.indent}  ${comment}`) : ''
    this.sendToServer(`${this.indent}${error}${_comment}`, 'error')
  }

  sendSkip(msg, assertion?) {
    const message = this.clr.lightBlue(`${this.sym.skip} ${msg}`)
    this.sendToServer(`${this.indent}${message}`)
  }

  get testerDocument() {
    return document.getElementById('tester') as HTMLElement
  }

  createElement(tag: string, innerHTML?: string | null, ...children: any[]) {
    const el = document.createElement(tag)
    if (innerHTML) el.innerHTML = innerHTML
    if (children)
      children.forEach(c => {
        el.appendChild(c)
      })
    return el
  }

  escapeHtml(unsafe: string) {
    if (unsafe && typeof unsafe === 'string')
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    return unsafe
  }

  removeLineBreaks(str: string) {
    return str.replace(/\r\n|\r|\n/gm, '')
  }

  /**
   * Turns ascii colors to <span /> with color styles.
   * Replaces new lines.
   * Escapes HTML.
   */
  colorify(text: string) {
    const replacer = (color: string) => (match, p1, p2, p3, offset, string) => {
      return `<span style="color:${color};">${this.escapeHtml(p2)}</span>`
    }

    // convert colors
    return (
      text
        .replace(/\r\n|\n|\r/gm, '')
        // eslint-disable-next-line no-control-regex
        .replace(/\x1b/g, '')
        // colors from https://github.com/yandeu/favorite-terminal-colors
        .replace(/(\[32;1m)(.*?)(\[0m)/gm, replacer('#50FA7B'))
        .replace(/(\[34;1m)(.*?)(\[0m)/gm, replacer('#8BE9FD'))
        .replace(/(\[31m)(.*?)(\[0m)/gm, replacer('#FF5555'))
        .replace(/(\[32m)(.*?)(\[0m)/gm, replacer('#2FD651'))
        .replace(/(\[90m)(.*?)(\[0m)/gm, replacer('#656B84'))
    )
  }

  sendToServer(msg: string, type?: string) {
    const tester = this.testerDocument

    // add to dom
    if (!this._isAutomated && tester) {
      const _msg = this.removeLineBreaks(msg)
      if (type === 'end') {
        const p = this.createElement('p', this.colorify(_msg))
        tester.appendChild(p)
      } else if (_msg.startsWith('• ')) {
        const title = this.createElement('h3', _msg.slice(2))
        title.style.fontWeight = '300'
        tester.appendChild(title)
      } else {
        const ul = tester.lastChild as HTMLElement
        const li = this.createElement('li')
        li.innerHTML = this.colorify(_msg)
        if (type === 'error') li.classList.add('error')
        ul.appendChild(li)
      }
    }

    // scroll and print to console
    // (light colors are not supported on the browser console, therefore we replace all light colors (;1) with its normal)
    if (!this._isAutomated) {
      window.scrollTo({ top: tester.scrollHeight, behavior: 'smooth' })
      console.log(msg.replace(/;1/, ''))
      return
    }

    fetch('http://localhost:8080/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: msg, id: this.sendId++, type })
    })
  }

  expect(assertion: any)
  expect(type: 'error' | 'warn' | 'skip', assertion: any)
  expect(a: 'error' | 'warn' | 'skip' | any, b?: any) {
    const assertion = typeof b !== 'undefined' ? b : a
    const type: 'error' | 'warn' | 'skip' = typeof b !== 'undefined' ? a : 'error'

    let not = false

    const toBe = (expectation: any, message: string = '') => {
      let isTrue = assertion === expectation
      if (not) isTrue = !isTrue

      const should = not ? 'should NOT be' : 'should be'

      if (isTrue && message) this[type](isTrue, message)
      else if (message) this[type](isTrue, message, `${should} "${expectation}", got "${assertion}"`)
      else this[type](isTrue, `${should} "${expectation}", got "${assertion}"`)
    }

    return {
      toBe: toBe,
      get not() {
        not = !not
        return { toBe }
      }
    }
  }
}

const Test = new Tester()
const expect = Test.expect.bind(Test)
const describe = Test.describe.bind(Test)

// setTimeout(() => {
//   describe('my first test', async () => {
//     expect(typeof 'hello').toBe('string', 'some message')
//     expect(typeof 'hello').toBe('string')
//     await Test.wait(500)
//     expect(99 - 8).not.toBe(72)
//     expect(99 - 8).not.toBe(91)
//     expect(99 - 8).toBe(72)
//     expect(99 - 8).toBe(72, '99 minus 8 should be 72')
//     expect(typeof 'hello').toBe('string', 'some message')
//     expect(typeof 'hello').toBe('string')
//   })
// })
