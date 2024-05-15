import type { GlobalToken } from 'antd'
import { theme } from 'antd'
import { useRef } from 'react'
import { useAppStore } from '@/hooks'

export function useThemeToken() {
  const { token } = theme.useToken()
  const tokenRef = useRef<GlobalToken>(token)
  tokenRef.current = token
  const currentTheme = useAppStore((state) => state.theme)

  return { token, tokenRef, theme: currentTheme }
}
