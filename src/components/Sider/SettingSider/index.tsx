import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

function SettingSider() {
  const navigate = useNavigate()
  return (
    <Menu
      items={[
        {
          key: 'theme',
          label: '主题',
          onClick: () => navigate('/setting/theme')
        },
        // {
        //   key: 'account',
        //   label: '账号',
        //   onClick: () => navigate('/setting/account')
        // },
        {
          key: 'security',
          label: '安全',
          onClick: () => navigate('/setting/security')
        },
        {
          key: 'about',
          label: '关于',
          onClick: () => navigate('/setting/about')
        }
      ]}
    />
  )
}

export default SettingSider
