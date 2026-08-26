import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (_req: Request, context: Context) => {
  const key = context.params.key
  if (!key) return new Response('Not found', { status: 404 })

  const store = getStore('aerous-app-images')
  const blob = await store.get(key, { type: 'arrayBuffer' })
  if (!blob) return new Response('Not found', { status: 404 })

  const meta = await store.getMetadata(key)
  const contentType = (meta?.metadata?.contentType as string) || 'application/octet-stream'

  return new Response(blob, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config = {
  path: '/api/image/:key',
}
