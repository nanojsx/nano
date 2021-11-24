import puppeteer, { Browser, Page } from 'puppeteer'
import { TinyServer } from '../../../scripts/tinyServer'

const port = Math.floor(Math.random() * 6000 + 3000)
const server = new TinyServer()

server.r.get('/index.html', async ({ res }) => res.send.file('test/nodejs/e2e/assets/index.html'))
server.r.get('/toggle.html', async ({ res }) => res.send.file('test/nodejs/e2e/assets/toggle.html'))
server.r.get('/bundle.core.js', async ({ res }) => res.send.file('bundles/nano.core.min.js'))
server.r.get('/bundle.slim.js', async ({ res }) => res.send.file('bundles/nano.slim.min.js'))

let browser: Browser, page: Page

beforeAll(async () => {
  await server.listen(port)
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

describe('some e2e testing', () => {
  it('should work with the core bundle (index.html)', async () => {
    await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle2' })
    // await page.screenshot({ path: 'example.png' })
    const data = await page.evaluate(() => ({
      hello: document.getElementById('hello')?.innerText
    }))
    expect(data.hello).toBe('Hello Nano!')
  })

  it('should work with the slim bundle (toggle.html)', async () => {
    await page.goto(`http://localhost:${port}/toggle.html`, { waitUntil: 'networkidle2' })
    const data0 = await page.evaluate(() => ({
      button: document.getElementById('btn'),
      text: document.getElementById('text')
    }))

    expect(data0.text).toBeNull()
    expect(data0.button).not.toBeNull()

    await page.click('#btn')
    const data1 = await page.evaluate(() => ({
      text: document.getElementById('text'),
      innerText: document.getElementById('text')?.innerText
    }))
    expect(data1.text).not.toBeNull()
    expect(data1.innerText).toBe('Hidden Text')

    await page.click('#btn')
    const data2 = await page.evaluate(() => ({
      text: document.getElementById('text')
    }))
    expect(data2.text).toBeNull()
  })
})

afterAll(async () => {
  await browser.close()
  await server.close()
})
