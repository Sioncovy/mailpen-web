import type { RxCollection, RxDatabase, RxJsonSchema } from 'rxdb'
import { addRxPlugin, createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import type { Chat, Message } from '@/typings'

addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)

type ChatCollection = RxCollection<Chat>
type MessageCollection = RxCollection<Message>

interface MailpenDatabaseCollections {
  chats: ChatCollection
  messages: MessageCollection
}

export const mailpenDatabase = await createRxDatabase<RxDatabase<MailpenDatabaseCollections>>({
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
    pinned: {
      type: 'boolean',
    },
  },
  required: ['_id', 'name', 'avatar', 'message', 'count', 'createdAt', 'updatedAt', 'pinned'],
} as const

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
} as const

await mailpenDatabase.addCollections({
  chats: {
    schema: chatSchema,
  },
  messages: {
    schema: messageSchema,
  },
})
