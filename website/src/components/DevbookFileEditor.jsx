import React, {
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

function DevbookFileEditor({
  language,
  filepath,
  children: initialContent,
}) {
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

  useEffect(function updateInitialContent() {
    updateContent(initialContent)
  }, [
    initialContent,
    updateContent,
  ])

  return (
    <div className="dbk-editor-wrapper">
      <DevbookEditor
        filepath={filepath}
        language={language}
        initialContent={initialContent}
        onContentChange={updateContent}
      />
    </div>
  )
}

export default DevbookFileEditor
