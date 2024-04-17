import { request } from '@/hooks'

export async function uploadFile(file: File): Promise<{ url: string }> {
  return request.post('/files', { file }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
