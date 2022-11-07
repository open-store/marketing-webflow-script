import { WebflowScript } from '../../types'
import { getAdClickBrowserContext, getAdConversionFromHref } from './helper'

const saveAdConversion: WebflowScript = {
  requireFeatureFlag: 'webflow_script_save_ad_conversion',
  handler: () => {
    const { isConversion, ...adConversionParams } = getAdConversionFromHref()
    if (isConversion) {
        const adClickBrowserContext = getAdClickBrowserContext()
        const adConversion = {
          ...adConversionParams,
          ...adClickBrowserContext
        }

        const url = `${window.location.origin}/api/ad-click`
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adConversion)
        })
    }
  },
}

export default saveAdConversion
