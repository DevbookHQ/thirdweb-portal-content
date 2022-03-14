import React, {
  useCallback,
  useRef,
} from 'react'

import {
  useDevbook,
} from '@devbookhq/sdk'
import {
  Terminal,
  TerminalHandler,
} from '@devbookhq/ui'

function DevbookTerminal() {
  const devbook = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })
  const terminalRef = useRef<TerminalHandler>(null)

  const install = useCallback(() => {
    if (!terminalRef.current) return
    terminalRef.current.handleInput('npm i @3rdweb/sdk\n')
    terminalRef.current.focus()
  }, [terminalRef])

  return (
    <div className="dbk-editor-wrapper">
      <div className="control-wrapper">
        <button className="run-btn" onClick={install}>Install</button>
      </div>
      <Terminal
        ref={terminalRef}
        lightTheme={false}
        devbook={devbook}
        height="100px"
      />
    </div>
  )
}

export default DevbookTerminal