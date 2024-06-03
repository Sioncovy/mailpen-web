import forge from 'node-forge'
import CryptoJS from 'crypto-js'

export const generateRSAKeyPair = () => {
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({
    bits: 2048,
    e: 0x10001
  })

  const privateKeyPem = forge.pki.privateKeyToPem(privateKey)
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey)

  return { privateKeyPem, publicKeyPem }
}

// 解密RSA加密的AES密钥
export const decryptRSAEncryptedAESKey = (encryptedAesKeyBase64: string) => {
  const privateKeyPem = localStorage.getItem('privateKey')
  if (!privateKeyPem) return ''
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
  const encryptedAesKey = forge.util.decode64(encryptedAesKeyBase64)
  const aesKey = privateKey.decrypt(encryptedAesKey, 'RSA-OAEP', {
    md: forge.md.sha256.create()
  })
  return aesKey
}

export const encryptMessage = (message: string) => {
  const aesKey = localStorage.getItem('aesKey')
  if (!aesKey) return ''
  return CryptoJS.AES.encrypt(message, aesKey).toString()
}

export const decryptMessage = (ciphertext: string) => {
  const aesKey = localStorage.getItem('aesKey')
  if (!aesKey) return ''
  const bytes = CryptoJS.AES.decrypt(ciphertext, aesKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}
