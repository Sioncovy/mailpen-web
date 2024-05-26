import { request } from '@/hooks'
import type { Contact, Request } from '@/typings'

export async function queryContactList(): Promise<Contact[]> {
  return request.get('/contacts')
}

export async function queryRequestList(): Promise<Request[]> {
  return request.get('/contacts/requests')
}

export async function createRequest({
  friendId,
  reason = '申请添加为好友'
}: {
  friendId: string
  reason?: string
}): Promise<null> {
  return request.post('/contacts/requests', {
    friendId,
    reason
  })
}

export async function approveRequest({
  requestId
}: {
  requestId: string
}): Promise<null> {
  return request.post(`/contacts/requests/${requestId}/approve`)
}

export async function rejectRequest({
  requestId
}: {
  requestId: string
}): Promise<null> {
  return request.post(`/contacts/requests/${requestId}/reject`)
}

export async function queryContact(id: string): Promise<Contact> {
  return request.get(`/contacts/${id}`)
}

export async function updateContact(
  id: string,
  data: Partial<Contact>
): Promise<Contact> {
  return request.put(`/contacts/${id}`, data)
}

export async function deleteContact(id: string): Promise<null> {
  return request.delete(`/contacts/${id}`)
}
