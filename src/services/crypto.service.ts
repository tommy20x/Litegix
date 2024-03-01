import CryptoJS from 'crypto-js'

const SecretKey = 'xJpNWjRRIqCc7rdxVdms01lcHzdrH6s9'

export default {
  encrypt: (text: string) => {
    return CryptoJS.AES.encrypt(text, SecretKey).toString()
  },
  decrypt: (hash: string) => {
    return CryptoJS.AES.decrypt(hash, SecretKey).toString(CryptoJS.enc.Utf8)
  },
}
