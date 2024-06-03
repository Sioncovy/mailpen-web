import { io } from 'socket.io-client'
import { REACT_APP_API } from '@/config'

export const socket = io(REACT_APP_API, {
  transports: ['websocket'],
  autoConnect: true
})
