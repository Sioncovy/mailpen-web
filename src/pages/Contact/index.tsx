import ContactSider from '@/components/Sider/ContactSider'
import MainLayout from '@/layouts/MainLayout'

function Contact(props: any) {
  return (
    <MainLayout>
      <ContactSider />
      {props.children}
    </MainLayout>
  )
}

export default Contact
