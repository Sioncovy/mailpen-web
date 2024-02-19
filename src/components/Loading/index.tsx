import type { CSSProperties } from 'react'
import { Spin } from 'antd'
import { useThemeToken } from '@/hooks'

interface PageLoadingProps {
  height?: CSSProperties['height']
  padding?: CSSProperties['padding']
  tip?: string
}

function Loading(props: PageLoadingProps) {
  const { token } = useThemeToken()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: props.height || '100%',
        padding: props.padding || 32,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Spin></Spin>
        {props.tip && (
          <span
            style={{
              marginTop: 6,
              color: token.colorPrimary,
              fontSize: 12,
            }}
          >
            {props.tip}
          </span>
        )}
      </div>
    </div>
  )
}

export default Loading
