export function sizeFormatter(size: number) {
  if (size < 1024) {
    return `${size} B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

export function downloadFile(url: string, name?: string) {
  const a = document.createElement('a')
  a.href = url
  if (name) {
    a.download = name
  }
  a.click()
}
