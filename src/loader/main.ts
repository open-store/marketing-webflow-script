import { STATIC_BUCKET_URL } from './constants'
import addScriptTag from '../common/addScriptTag'

export default async function main() {
  let jsonResponse: Record<string, string>

  try {
    const response = await fetch(`${STATIC_BUCKET_URL}loader/tags.gz.json`, {
      cache: 'no-store', // Disable caching tags file for every request.
    })
    jsonResponse = await response.json()
  } catch (_err) {
    throw new Error('LOADER: failed to fetch and parse tags')
  }

  const tag = jsonResponse?.latest

  if (!tag) {
    throw new Error('LOADER: missing package tag information')
  }

  addScriptTag('AppPackage', `${STATIC_BUCKET_URL}packages/${tag}.gz.js`)
}
