import { queryContactList } from '@/apis'
import ContactSider from '@/components/Sider/ContactSider'
import { socket, useAppStore } from '@/hooks'
import MainLayout from '@/layouts/MainLayout'
import { useEffect } from 'react'

function Contact(props: any) {
  const [setContactList] = useAppStore((state) => [state.setContactList])

  const getContactList = () => {
    queryContactList().then((res) => {
      if (res) setContactList(res)
    })
  }

  useEffect(() => {
    socket.on('onDeleteContact', getContactList)
    return () => {
      socket.off('onDeleteContact', getContactList)
    }
  }, [])

  return (
    <MainLayout>
      <ContactSider />
      {props.children}
    </MainLayout>
  )
}

export default Contact
