class Tester {
  _isAutomated = window.navigator.webdriver

  sendId = 0
  _description
  stats = { error: 0, warn: 0, success: 0 }
  tests = []

  end() {
    const total = this.stats.error + this.stats.warn + this.stats.success
    const success = this.stats.success
    const passing = this.clr.lightGreen(`${success}/${total} passing`)

    setTimeout(() => {
      this.sendToPuppeteer(`\n${this.indent}${passing}\n`)
      const done = document.createElement('div')
      done.innerText = 'done'
      done.id = 'done'
      document.body.appendChild(done)
    }, 100)
  }

  async start() {
    for (let i = 0; i < this.tests.length; i++) {
      const { description, fnc } = this.tests[i]
      this._description = description
      await fnc()
    }
    this.end()
  }

  description(description, fnc) {
    this.tests.push({ description, fnc })
  }

  async wait(ms = 100) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  error(assertion, message = 'No Description') {
    if (assertion === true) {
      this.stats.success++
      this.sendSuccess(message)
    } else {
      this.stats.error++
      this.sendError(message, assertion)
    }
  }

  get indent() {
    return '  '
  }

  get sym() {
    return {
      fail: '✘',
      pass: '✔'
    }
  }

  get clr() {
    return {
      red: text => `\u001b[31m${text}\u001b[0m`,
      green: text => `\u001b[32m${text}\u001b[0m`,
      lightGreen: text => `\u001b[32;1m${text}\u001b[0m`,
      gray: text => `\u001b[90m${text}\u001b[0m`
    }
  }

  title(title) {}

  sendSuccess(msg, assertion) {
    const symbol = this.clr.lightGreen(this.sym.pass)
    const message = this.clr.gray(msg)
    this.sendToPuppeteer(`${this.indent}${symbol} ${message}`)
  }

  sendError(msg, assertion) {
    const error = this.clr.red(`${this.sym.fail} ${msg}`)
    const description = this.clr.gray(`${this.indent}${this._description}`)
    this.sendToPuppeteer(`\n${this.indent}${error}\n${this.indent}${description}\n`)
  }

  sendToPuppeteer(msg) {
    if (!this._isAutomated) {
      console.log(msg.replace(/;1/, ''))
      return
    }

    fetch('http://localhost:8080/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: msg, id: this.sendId++ })
    })
  }
}

var Test = new Tester()
