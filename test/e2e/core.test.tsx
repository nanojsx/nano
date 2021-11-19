import puppeteer, { Browser, Page } from 'puppeteer'
import { Routes, TinyServer } from '../tinyServer'

const port = Math.floor(Math.random() * 6000 + 3000)
const routes: Routes = {
  '/': async c => c.res.send.file('test/assets/index.html'),
  '/bundle.core.js': async c => c.res.send.file('bundles/nano.core.min.js')
}
const server = new TinyServer(routes)

let browser: Browser, page: Page

beforeAll(async () => {
  await server.listen(port)
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

test('bundles core', async () => {
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle2' })
  // await page.screenshot({ path: 'example.png' })
  const data = await page.evaluate(() => {
    return {
      hello: document.getElementById('hello')?.innerText
    }
  })
  expect(data.hello).toBe('Hello Nano!')
})

afterAll(async () => {
  await browser.close()
  await server.close()
})
