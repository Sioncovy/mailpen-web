import type { RadioGroupProps } from 'antd'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Setting from '@/components/Setting'
import SettingSider from '@/components/Sider/SettingSider'
import MainLayout from '@/layouts/MainLayout'
import { Theme } from '@/typings'
import { useAppStore } from '@/hooks'

export interface CommonConfigProps {
  key: string
  label: string
}

export interface RadioGroupConfigProp extends CommonConfigProps {
  type: 'radio-group'
  props?: RadioGroupProps
}

export type SettingConfig = RadioGroupConfigProp

export interface SettingType {
  title: string
  key: string
  content: string
  settings: SettingConfig[]
}

export enum SettingKeys {
  theme = 'theme',
}

function SettingPage() {
  const { name } = useParams()
  const [theme, setTheme] = useAppStore(state => [state.theme, state.setTheme])
  console.log('✨  ~ SettingPage ~ theme:', theme)

  const settingsMap: {
    [key: string]: SettingType
  } = {
    theme: {
      title: '主题设置',
      key: 'ThemeSetting',
      content: '更改应用的主题风格',
      settings: [
        {
          type: 'radio-group',
          key: 'theme',
          label: '主题',
          props: {
            value: theme,
            options: [
              {
                label: '浅色',
                value: Theme.Light,
              },
              {
                label: '深色',
                value: Theme.Dark,
              },
            ],
            onChange(e) {
              setTheme(e.target.value)
            },
          },
        },
      ],
    },
  }

  const page = useMemo(() => {
    const keys = Object.values(SettingKeys) as string[]
    const isCorrect = Boolean(name && keys.includes(name))
    if (!name)
      return <></>

    return isCorrect
      ? <Setting config={settingsMap[name]} />
      : (
        <div>
          请选择一个正确的设置项
        </div>
        )
  }, [name, settingsMap])

  return (
    <MainLayout>
      <SettingSider />
      {page}
    </MainLayout>
  )
}

export default SettingPage
