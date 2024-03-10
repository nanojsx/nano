// @ts-check

import crypto from 'crypto'
import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { mkdir, readdir, writeFile } from 'fs/promises'
import { requestListener } from './requestListener.mjs'
import { totalPasses } from './requestListener.mjs'

const args = process.argv.splice(2)
const serve = args.includes('serve')
const collectCoverage = args.includes('--coverage') && !serve

const ERROR_CODES = {
  TEST_FAILED: 2,
  HAS_ERROR: 3
}

let hasError = false

const sleep = ms => new Promise(r => setTimeout(r, ms))

const server = createServer(requestListener({ serve, collectCoverage }))
server.closeAsync = () => /** @type {Promise<void>} */ (new Promise(resolve => server.close(() => resolve())))

/**
 *  @param {{fileName:string, browser:puppeteer.Browser}} param0
 */
const main = async ({ fileName, browser }) => {
  console.log(`> ${fileName}`)

  const page = await browser.newPage()
  await page.setRequestInterception(true)

  // Enable both JavaScript and CSS coverage
  if (collectCoverage) await page.coverage.startJSCoverage()

  /** @type {Array<puppeteer.HTTPRequest>} */
  const requests = []

  // Blocks all window.location.href requests
  page.on('request', async request => {
    let isNavRequest = request.isNavigationRequest() && request.frame() === page.mainFrame()
    if (!isNavRequest) {
      request.continue()
      return
    }

    requests.push(request)
    if (requests.length == 1) {
      request.continue()
      return
    }

    request.abort('aborted')

    const url = requests[requests.length - 1].url()
    await page.evaluate(url => {
      window.__gotohref__ = url
    }, url)
  })

  // Navigate to page
  let url = `http://localhost:8080/${fileName.replace(/^\+/, '')}`
  await page.goto(url, { waitUntil: 'networkidle2' })

  try {
    await page.waitForSelector('#done', { timeout: 15_000 })
  } catch (err) {
    console.log('Error:', err.message)
    hasError = true
  }

  await sleep(100)

  if (collectCoverage) {
    await page.coverage.stopJSCoverage()

    const coverage = await page.evaluate(() => {
      return window.__coverage__
    })

    if (coverage) {
      const fileName = crypto.createHash('md5').update(JSON.stringify(coverage)).digest('hex')
      await writeFile(resolve(`./.nyc_output/${fileName}.json`), JSON.stringify(coverage))
    }
  }

  await page.close()
}

server.listen(8080, async () => {
  if (serve) {
    console.log('Listen on http://localhost:8080/')
    return
  }

  if (collectCoverage) {
    if (!existsSync('.nyc_output')) await mkdir('.nyc_output', { recursive: true })
    if (!existsSync('coverage')) await mkdir('coverage', { recursive: true })
  }

  console.log('\n')

  const browser = await puppeteer.launch()

  const DIR = 'test/browser'
  const files = await readdir(join(resolve(), DIR))

  for (let i = 0; i < files.length; i++) {
    await main({ fileName: `${DIR}/${files[i]}`, browser })
  }

  console.log(`TOTAL: ${totalPasses[0]}/${totalPasses[1]} passes`)
  console.log('\n')

  // don't print the report automatically
  // if (collectCoverage) NYC.report()

  await browser.close()
  await server.closeAsync()

  // exit on fail
  if (totalPasses[0] !== totalPasses[1]) process.exit(ERROR_CODES.TEST_FAILED)
  // exit on error
  if (hasError) process.exit(ERROR_CODES.HAS_ERROR)
})

process.on('SIGTERM', () => {
  server.close()
})
