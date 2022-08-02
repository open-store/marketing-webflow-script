export type WebflowScript = {
  requireFeatureFlag: string // Feature flag to enable and disable this script
  handler: () => void
}
export type WebflowScripts = Record<string, WebflowScript>
