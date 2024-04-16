import { Flex, Radio, Typography } from 'antd'
import type { SettingConfig, SettingType } from '@/pages/SettingPage'
import { useThemeToken } from '@/hooks'

interface SettingProps {
  config: SettingType
}

function Setting({ config }: SettingProps) {
  console.log('✨  ~ Setting ~ config:', config)
  const { token } = useThemeToken()

  const renderSetting = (setting: SettingConfig) => {
    switch (setting.type) {
      case 'radio-group':
        return (
          <Radio.Group
            {...setting.props}
          />
        )
      default:
        return null
    }
  }

  return (
    <Flex vertical gap={12} style={{ padding: token.padding }}>
      <Flex vertical>
        <Typography.Title level={3}>{config.title}</Typography.Title>
        <Typography.Text>{config.content}</Typography.Text>
      </Flex>
      {config.settings.map((setting) => {
        return (
          <Flex vertical key={setting.key}>
            <Typography.Title level={5}>{setting.label}</Typography.Title>
            {renderSetting(setting)}
          </Flex>
        )
      })}
    </Flex>
  )
}

export default Setting
