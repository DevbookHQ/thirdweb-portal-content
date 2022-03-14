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
  Terminal
} from '@devbookhq/ui'

export { Language } from '@devbookhq/ui'

const libImport = `
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

`
const packagejson = `{
  "name": "thirdweb",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}`

const MemoizedEditor = memo(Editor)

function DevbookRunnableCode({
  language,
  children: initialCode,
}) {
  const { stdout, stderr, status, runCmd, fs } = useDevbook({ debug: true, env: 'dbk-dev-env', config: { domain: 'dev.usedevbook.com' } })
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
    const finalCode = libImport + code
    fs.write('/package.json', packagejson).then(() => {
      fs.write('/index.js', finalCode).then(() => {
        console.log('DONE!!!!!!!')
        runCmd('node /index.js')
      })
    })
  }, [
    status,
    setIsLoading,
    code,
    runCmd,
    fs,
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
