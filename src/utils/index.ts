// export function uploadFile(file: File, key: string) {
//   const token = localStorage.getItem(UPLOAD_TOKEN_KEY)
//   if (!token)
//     return null

//   const observer = {
//     next(res: any) {
//       console.log('upload next', res)
//     },
//     error(err: any) {
//       console.log('upload error', res)
//     },
//     complete(res: any) {
//       console.log('upload complete', res)
//     },
//   }

//   const putExtra = {
//     // fname: 'qiniu.txt',
//     // mimeType: 'text/plain',
//     // customVars: { 'x:test': 'qiniu' },
//     // metadata: { 'x-qn-meta': 'qiniu' },
//   }

//   const config = {
//     // useCdnDomain: true,
//     // region: qiniu.region.z2,
//   }

//   const observable = qiniu.upload(file, key, token, putExtra, config)

//   const subscription = observable.subscribe(observer)
//   console.log('✨  ~ uploadFile ~ subscription:', subscription)
// }

export function createObjectURL(file: File) {
  return URL.createObjectURL(file)
}
