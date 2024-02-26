import { useLocation } from 'react-router-dom'
import ChatSider from './ChatSider'
import ContactSider from './ContactSider'
import SettingSider from './SettingSider'

function Sider() {
  const { pathname } = useLocation()
  const route = pathname.split('/')[1]

  const siderMap: { [key: string]: JSX.Element } = {
    chat: <ChatSider />,
    contact: <ContactSider />,
    setting: <SettingSider />,
  }

  return siderMap[route] || '什么都没有呢'
}

export default Sider
