import type { ColorPickerProps, RadioGroupProps } from 'antd'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Setting from '@/components/Setting'
import SettingSider from '@/components/Sider/SettingSider'
import { useAppStore } from '@/hooks'
import MainLayout from '@/layouts/MainLayout'
import { Theme } from '@/typings'

export interface CommonConfigProps {
  key: string
  label: string
}

export interface RadioGroupConfigProp extends CommonConfigProps {
  type: 'radio-group'
  props?: RadioGroupProps
}

export interface ColorPickerConfigProp extends CommonConfigProps {
  type: 'color-picker'
  props: ColorPickerProps
}

export type SettingConfig = RadioGroupConfigProp | ColorPickerConfigProp

export interface SettingType {
  title: string
  key: string
  content: string
  settings: SettingConfig[]
}

export enum SettingKeys {
  theme = 'theme'
}

function SettingPage() {
  const { name } = useParams()
  const [
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    layoutColor,
    setLayoutColor
  ] = useAppStore((state) => [
    state.theme,
    state.setTheme,
    state.primaryColor,
    state.setPrimaryColor,
    state.layoutColor,
    state.setLayoutColor
  ])

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
                value: Theme.Light
              },
              {
                label: '深色',
                value: Theme.Dark
              }
            ],
            onChange(e) {
              setTheme(e.target.value)
            }
          }
        },
        {
          type: 'color-picker',
          key: 'primaryColor',
          label: '主题色',
          props: {
            value: primaryColor,
            onChange(color) {
              setPrimaryColor(color.toHexString())
            },
            showText: true,
            size: 'middle',
            style: {
              width: 'fit-content'
            }
          }
        }
        // {
        //   type: 'color-picker',
        //   key: 'backgroundColor',
        //   label: '背景色',
        //   props: {
        //     value: layoutColor,
        //     onChange(color) {
        //       setLayoutColor(color.toHexString())
        //     },
        //     showText: true,
        //     size: 'middle',
        //     style: {
        //       width: 'fit-content'
        //     }
        //   }
        // }
      ]
    },
    account: {
      title: '账号设置',
      key: 'AccountSetting',
      content: '更改账号的相关设置',
      settings: []
    }
  }

  const page = useMemo(() => {
    const keys = Object.values(SettingKeys) as string[]
    const isCorrect = Boolean(name && keys.includes(name))
    if (!name) return <></>

    return isCorrect ? (
      <Setting config={settingsMap[name]} />
    ) : (
      <div>请选择一个正确的设置项</div>
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
