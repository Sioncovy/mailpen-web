import type { RxJsonSchema } from 'rxdb'
import { createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import type { Chat, Message } from '@/typings'

export const mailpenDatabase = await createRxDatabase({
  name: 'mailpen',
  storage: getRxStorageDexie(),
})

const chatSchema: RxJsonSchema<Chat> = {
  version: 0,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    message: {
      type: 'object',
    },
    count: {
      type: 'number',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['_id', 'name', 'avatar', 'message', 'count', 'createdAt', 'updatedAt'],
}

const messageSchema: RxJsonSchema<Message> = {
  version: 0,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    content: {
      type: 'string',
    },
    type: {
      type: 'number',
    },
    sender: {
      type: 'string',
    },
    receiver: {
      type: 'string',
    },
    read: {
      type: 'boolean',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['_id', 'content', 'type', 'sender', 'receiver', 'read', 'createdAt', 'updatedAt'],
}

await mailpenDatabase.addCollections({
  chats: {
    schema: chatSchema,
  },
  messages: {
    schema: messageSchema,
  },
})
