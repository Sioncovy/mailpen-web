import type { ColorPickerProps, RadioGroupProps, SwitchProps } from 'antd'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Setting from '@/components/Setting'
import SettingSider from '@/components/Sider/SettingSider'
import { useAppStore } from '@/hooks'
import MainLayout from '@/layouts/MainLayout'
import { MessageSpecialType, Theme } from '@/typings'

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

export interface SwitchConfigProp extends CommonConfigProps {
  type: 'switch'
  props: SwitchProps
}

export type SettingConfig =
  | RadioGroupConfigProp
  | ColorPickerConfigProp
  | SwitchConfigProp

export interface SettingType {
  title: string
  key: string
  content: string
  settings: SettingConfig[]
}

export enum SettingKeys {
  theme = 'theme',
  account = 'account',
  security = 'security',
  about = 'about'
}

function SettingPage() {
  const { name } = useParams()
  const [
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    // layoutColor,
    // setLayoutColor,
    special,
    setSpecial,
    chatMsgPreview,
    setChatMsgPreview,
    newMsgPreview,
    setNewMsgPreview
  ] = useAppStore((state) => [
    state.theme,
    state.setTheme,
    state.primaryColor,
    state.setPrimaryColor,
    // state.layoutColor,
    // state.setLayoutColor,
    state.special,
    state.setSpecial,
    state.chatMsgPreview,
    state.setChatMsgPreview,
    state.newMsgPreview,
    state.setNewMsgPreview
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
    },
    security: {
      title: '安全设置',
      key: 'SecuritySetting',
      content: '更改账号的安全设置',
      settings: [
        {
          type: 'switch',
          key: 'new-message-preview',
          label: '会话消息预览',
          props: {
            checked: newMsgPreview,
            onChange(checked) {
              setNewMsgPreview(checked)
            },
            checkedChildren: '开',
            unCheckedChildren: '关'
          }
        },
        {
          type: 'switch',
          key: 'chat-message-view',
          label: '会话中隐藏消息内容',
          props: {
            checked: !chatMsgPreview,
            onChange(checked) {
              setChatMsgPreview(!checked)
            },
            checkedChildren: '开',
            unCheckedChildren: '关'
          }
        },
        {
          type: 'radio-group',
          key: 'special',
          label: '消息类型',
          props: {
            value: special,
            onChange(e) {
              setSpecial(e.target.value)
            },
            options: [
              {
                label: '正常消息',
                value: MessageSpecialType.Normal
              },
              {
                label: '阅后即焚',
                value: MessageSpecialType.BurnAfterReading
              },
              {
                label: '限时消息',
                value: MessageSpecialType.BurnAfterTime
              }
            ]
          }
        }
      ]
    },
    about: {
      title: '关于',
      key: 'AboutSetting',
      content: '关于应用的相关信息',
      settings: []
    }
  }

  const page = useMemo(() => {
    const keys = Object.values(SettingKeys) as string[]
    console.log('✨  ~ page ~ keys:', keys)
    const isCorrect = Boolean(name && keys.includes(name))
    console.log('✨  ~ page ~ isCorrect:', isCorrect)
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
