import { queryContact } from '@/apis'
import ContactInfo from '@/components/ContactInfo'
import { ErrorCodeMap } from '@/config'
import { useThemeToken } from '@/hooks'
import type { Contact } from '@/typings'
import { Card, Flex, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ContactDetail() {
  const { id } = useParams()
  const [contact, setContact] = useState<Contact>()
  const { token } = useThemeToken()
  const [messageApi, messageContextHolder] = message.useMessage()

  const getContactInfo = () => {
    if (!id) return
    queryContact(id)
      .then((res) => {
        if (res) {
          setContact(res)
        }
      })
      .catch((error) => {
        const errorCode = error.message as string
        messageApi.error(ErrorCodeMap[errorCode])
      })
  }

  useEffect(() => {
    getContactInfo()
  }, [id])

  if (!contact) return null

  return (
    <Flex style={{ height: '100%' }} align="center" justify="center">
      {messageContextHolder}
      <Card style={{ margin: token.marginLG, width: '100%', maxWidth: 1200 }}>
        <ContactInfo contact={contact} refresh={getContactInfo} />
      </Card>
    </Flex>
  )
}

export default ContactDetail
