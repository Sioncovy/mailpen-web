import { useLocation } from 'react-router-dom'
import ChatSider from './ChatSider'
import ContactSider from './ContactSider'
import SettingSider from './SettingSider'

function Sider() {
  const { pathname } = useLocation()

  const siderMap: { [key: string]: JSX.Element } = {
    '/chat': <ChatSider />,
    '/contact': <ContactSider />,
    '/setting': <SettingSider />,
  }

  return siderMap[pathname] || '什么都没有呢'
}

export default Sider
