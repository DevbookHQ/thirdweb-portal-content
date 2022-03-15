import React, {
  useCallback,
  useRef,
} from 'react'

import {
  Devbook,
  DevbookStatus,
  useDevbook,
} from '@devbookhq/sdk'
import {
  Terminal,
} from '@devbookhq/ui'

const packageJSON = `{
  "name": "thirdweb",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}`

function DevbookTerminal() {
  const devbook = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })
  const terminalRef = useRef(null)

  async function install() {
    if (!terminalRef.current) return
    if (!devbook.fs) return
    if (devbook.status !== DevbookStatus.Connected) return

    await devbook.fs.write('/package.json', packageJSON)

    terminalRef.current.handleInput('npm i @3rdweb/sdk ethers dotenv')
    terminalRef.current.focus()
  }

  return (
    <div className="dbk-editor-wrapper">
      <div className="control-wrapper">
        <button className="run-btn" onClick={install}>Install ThirdWeb SDK</button>
      </div>
      <Terminal
        title=""
        ref={terminalRef}
        lightTheme={false}
        devbook={devbook}
        height="100px"
      />
    </div>
  )
}

export default DevbookTerminal