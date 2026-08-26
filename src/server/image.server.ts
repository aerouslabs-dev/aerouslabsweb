import { getStore } from '@netlify/blobs'

function store() {
  return getStore('aerous-app-images')
}

export async function saveImage(key: string, data: ArrayBuffer, contentType: string) {
  const s = store()
  await s.set(key, data, { metadata: { contentType } })
}

export async function getImage(key: string) {
  const s = store()
  const blob = await s.get(key, { type: 'arrayBuffer' })
  if (!blob) return null
  const meta = await s.getMetadata(key)
  return { data: blob, contentType: (meta?.metadata?.contentType as string) || 'application/octet-stream' }
}

export async function deleteImage(key: string) {
  await store().delete(key)
}
