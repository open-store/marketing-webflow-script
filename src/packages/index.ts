/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import { initializeFeatureFlags, checkGate } from './utils/featureFlags'
import {
  initializeErrorTracking,
  addErrorTrackingBreadcrumb,
  captureError,
} from './utils/errorTracking'
import scripts from './scripts'

async function main() {
  initializeErrorTracking()

  addErrorTrackingBreadcrumb('Initializing feature flags')
  await initializeFeatureFlags()

  // Disable all injected scripts with single feature gate.
  addErrorTrackingBreadcrumb('Checking main application feature gate')
  if (!checkGate('webflow_marketing_all_scripts')) {
    return
  }

  addErrorTrackingBreadcrumb('Running all scripts')
  runAllScripts()
}

function runAllScripts() {
  Object.keys(scripts).forEach((scriptName) => {
    const { handler, requireFeatureFlag } = scripts[scriptName]

    try {
      // Check for specific feature flag per package script.
      if (checkGate(requireFeatureFlag)) {
        addErrorTrackingBreadcrumb(`Running script: '${scriptName}'`)
        console.log(`Loader: '${scriptName}'`)
        handler()
      }
    } catch (err) {
      captureError(err, `Failed at script: '${scriptName}'`)
    }
  })
}

main()
