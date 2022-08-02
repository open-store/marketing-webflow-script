import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import { CaptureConsole } from '@sentry/integrations'
import { SENTRY_DSN_KEY } from './constants'

export function initializeErrorTracking(): void {
  Sentry.init({
    dsn: SENTRY_DSN_KEY,
    integrations: [
      new BrowserTracing(),
      new CaptureConsole({
        levels: ['error'],
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // release: '1.0.0',
    // environment: 'prod',
    // maxBreadcrumbs: 50
  })
}

export function addErrorTrackingBreadcrumb(message: string): void {
  Sentry.addBreadcrumb({
    message,
    category: 'default',
    level: 'info',
  })
}

export function captureError(
  err: Error | unknown,
  traceMessage?: string,
): void {
  Sentry.captureException(
    err,
    traceMessage ? { extra: { traceMessage } } : undefined,
  )
}
