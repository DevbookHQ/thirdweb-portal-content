import React, {
  useState,
  memo,
  useCallback,
  useEffect,
} from 'react'

import {
  useDevbook,
  DevbookStatus,
  Env,
} from '@devbookhq/sdk'
import {
  Editor,
  Spinner,
  Output,
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

const libImport = `
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

`

const MemoizedEditor = memo(Editor)

function DevbookRunnableCode({
  language,
  children: initialCode,
}) {
  const { stdout, stderr, status, runCode, runCmd } = useDevbook({ debug: true, env: Env.ThirdwebNode })
  const [code, setCode] = useState(initialCode)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (stdout.length > 0 || stderr.length > 0) {
      setIsLoading(false)
    }
  }, [stdout, stderr])

  const run = useCallback(() => {
    if (status !== DevbookStatus.Connected) return
    setIsLoading(true)
    runCode(libImport + code)
  }, [
    code,
    runCode,
    status,
  ])

  return (
    <div className="dbk-editor-wrapper">
      <div className="control-wrapper">
        <button className="run-btn" onClick={run}>Run</button>
        {isLoading &&
          <div className="spin-wrapper">
            <Spinner />
          </div>
        }
      </div>
      <MemoizedEditor
        language={language}
        initialContent={initialCode}
        onContentChange={setCode}
      />
      {(stdout.length > 0 || stderr.length > 0) && (
        <div style={{ paddingTop: '4px' }}>
          <Output
            stdout={stdout}
            stderr={stderr}
            height={200}
          />
        </div>
      )}
    </div>
  )
}

export default DevbookRunnableCode
