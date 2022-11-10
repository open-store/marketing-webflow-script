import addScriptTag from '../../../common/addScriptTag'
import { WebflowScript } from '../../types'

const plausibleScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_plausible_script',
  handler: () => {
    const src = 'https://plausible.io/js/script.js'
    addScriptTag('PlausibleScript', src, {
      defer: true,
      attributes: { 'data-domain': window.location.host },
    })
  },
}

export default plausibleScript
