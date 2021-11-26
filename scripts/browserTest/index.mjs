import crypto from 'crypto'
import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { mkdir, readdir, writeFile } from 'fs/promises'
import { requestListener } from './requestListener.mjs'
import { NYC } from './nyc.mjs'

const args = process.argv.splice(2)
const collectCoverage = args.includes('--coverage')

const server = createServer(requestListener(collectCoverage))
server.closeAsync = () => new Promise(resolve => server.close(() => resolve()))

const browser = await puppeteer.launch()

const main = async fileName => {
  console.log(`\u001b[90m> ${fileName}\u001b[39m\n`)

  const page = await browser.newPage()

  // Enable both JavaScript and CSS coverage
  await page.coverage.startJSCoverage()

  // Navigate to page
  let url = `http://localhost:8080/${fileName.replace(/^\+/, '')}`
  await page.goto(url, { waitUntil: 'networkidle2' })

  try {
    await page.waitForSelector('#done', { timeout: 15_000 })
  } catch (err) {
    console.log('Error:', err.message)
  }

  await page.waitForTimeout(100)

  await page.coverage.stopJSCoverage()

  const coverage = await page.evaluate(() => {
    return window.__coverage__
  })

  if (coverage) {
    const fileName = crypto.createHash('md5').update(JSON.stringify(coverage)).digest('hex')
    await writeFile(resolve(`./.nyc_output/${fileName}.json`), JSON.stringify(coverage))
  }

  await page.close()
}

server.listen(8080, async () => {
  if (collectCoverage) {
    if (!existsSync('.nyc_output')) await mkdir('.nyc_output', { recursive: true })
    if (!existsSync('coverage')) await mkdir('coverage', { recursive: true })
  }

  console.log('\n')

  const DIR = 'test/browser'
  const files = await readdir(join(resolve(), DIR))

  for (let i = 0; i < files.length; i++) {
    await main(`${DIR}/${files[i]}`)
  }

  if (collectCoverage) NYC.report()

  await browser.close()
  await server.closeAsync()
})
