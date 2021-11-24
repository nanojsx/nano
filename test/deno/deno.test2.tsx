/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

/**
 * test for https://crux.land/nanossr@0.0.1 and https://dash.deno.com/playground/example-nanossr
 */

import { assertStringIncludes } from 'https://deno.land/std@0.115.1/testing/asserts.ts'

import { h, FC } from '../../deno_lib/mod.ts'
import { tw } from 'https://cdn.skypack.dev/twind'

import { Helmet, renderSSR as nanoRender } from '../../deno_lib/mod.ts'
import { setup } from 'https://cdn.skypack.dev/twind'
import { getStyleTag, virtualSheet } from 'https://cdn.skypack.dev/twind/sheets'
import typography from 'https://cdn.skypack.dev/@twind/typography'

let SHEET_SINGLETON: any = null
function sheet(twOptions = {}) {
  return SHEET_SINGLETON ?? (SHEET_SINGLETON = setupSheet(twOptions))
}

// Setup TW sheet singleton
function setupSheet(twOptions: Record<string, any>) {
  const sheet = virtualSheet()
  setup({ ...twOptions, sheet, plugins: { ...typography() } })
  return sheet
}

interface MakeHtml {
  body: string
  head: string[]
  footer: string[]
  styleTag: string
}
const html = ({ body, head, footer, styleTag }: MakeHtml): string => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join('\n')}
    ${styleTag}
  </head>
  <body>
    ${body}
    ${footer.join('\n')}
  </body>
<html>
`

export function ssr(render: CallableFunction, options?: any) {
  sheet(options?.tw ?? {}).reset()
  const app = nanoRender(render())
  const { body, head, footer } = Helmet.SSR(app)
  const styleTag = getStyleTag(sheet())
  return /*new Response*/ html({ body, head, footer, styleTag }) //, { headers: { 'content-type': 'text/html' } }
}

const Hello: FC<any> = props => (
  <div class={tw`bg-white flex h-screen`}>
    <h1 class={tw`text-5xl text-gray-600 m-auto mt-20`}>Hello {props.name}!</h1>
  </div>
)

// console.log('Listening on http://localhost:8080')
// await listenAndServe(':8080', req => {
//   const url = new URL(req.url)
//   const name = url.searchParams.get('name') ?? 'world'
//   return ssr(() => <Hello name={name} />)
// })

Deno.test('should render without errors', () => {
  const res = ssr(() => <Hello name={'deno'} />)

  // simply test some string outputs
  assertStringIncludes(res, '<!DOCTYPE html>')
  assertStringIncludes(res, 'Hello deno!')
  assertStringIncludes(res, '<style id="__twind">button,input,optgroup,select,textarea{font-family:')
  assertStringIncludes(
    res,
    '<div class="bg-white flex h-screen"><h1 class="text-5xl text-gray-600 m-auto mt-20">Hello deno!</h1></div>'
  )
})
