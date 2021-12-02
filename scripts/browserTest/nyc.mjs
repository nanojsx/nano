import { spawn } from 'child_process'

const isWin = process.platform === 'win32'

export const NYC = {
  instrument: (filePath, res) => {
    if (isWin) spawn('powershell.exe', ['npx', 'nyc', 'instrument', filePath]).stdout.pipe(res)
    else spawn('npx', ['nyc', 'instrument', filePath]).stdout.pipe(res)
  },
  report: () => {
    if (isWin) spawn('powershell.exe', 'npx nyc report --reporter=text'.split(' '), { stdio: 'inherit' })
    else spawn('npx', 'nyc report --reporter=text'.split(' '), { stdio: 'inherit' })
  }
}
