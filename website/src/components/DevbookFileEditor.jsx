import React, {
  useState,
  useEffect,
  useCallback,
} from 'react'

import {
  useDevbook,
  DevbookStatus,
  Env,
} from '@devbookhq/sdk'
import {
  Editor as DevbookEditor,
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

const keys = `PRIVATE_KEY="3bbd78b9cfb8e87f101a2bd9656966fb0a655f3281f46eb445f9816ce6943ec1"
PROVIDER_NETWORK="https://rpc-mumbai.maticvigil.com"
TOKEN_MODULE_ADDRESS="0xd77FD55386D64617517ae814d146A54562B995De"
`

function DevbookFileEditor({
  language,
  filepath,
  children: initialContent,
}) {
  const [code, setCode] = useState(initialContent)
  const { fs, status } = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })

  const updateContent = useCallback(async content => {
    if (!fs) return
    if (status !== DevbookStatus.Connected) return
    if (!filepath) return

    try {
      await fs.write(filepath, content)
    } catch (err) {
      console.error(err)
    }
  }, [
    fs,
    status,
    filepath,
  ])

  const getKeys = useCallback(() => {
    setCode(keys)
    updateContent(keys)
  }, [setCode, updateContent])

  useEffect(function updateInitialContent() {
    updateContent(initialContent)
  }, [
    initialContent,
    updateContent,
  ])

  return (
    <div className="dbk-editor-wrapper">
      <div className="control-wrapper">
        <button className="run-btn" onClick={getKeys}>Get API keys</button>
      </div>
      <DevbookEditor
        filepath={filepath}
        language={language}
        initialContent={code}
        onContentChange={updateContent}
      />
    </div>
  )
}

export default DevbookFileEditor
