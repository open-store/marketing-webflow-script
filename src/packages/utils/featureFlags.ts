import statsig from 'statsig-js'
import { STATSIG_API_KEY } from '../constants'
import { captureError } from './errorTracking'

export async function initializeFeatureFlags(): Promise<void> {
  try {
    await statsig.initialize(STATSIG_API_KEY)
  } catch (_err) {
    // Allow to proceed without crushing the app but log the error in Sentry.
    captureError(new Error('Failed to initialize feature flagging'))
  }
}

export function checkGate(name: string): boolean {
  try {
    return statsig.checkGate(name)
  } catch (_err) {
    // Allow to proceed without crushing the app but log the error in Sentry.
    captureError(new Error('Failed to retrieve feature flag'))
    return false
  }
}

export type Config = Record<string, string>
export function getConfig(name: string, keys: string[]): Config {
  const res: Config = {}
  const config = statsig.getConfig(name)

  for (const key of keys) {
    const value = config.get(key, null)

    if (!value) {
      throw new Error(`Failed to read dynamic value config: '${key}'`)
    }

    res[key] = value
  }

  return res
}
