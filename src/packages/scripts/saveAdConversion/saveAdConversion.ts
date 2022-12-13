import { WebflowScript } from '../../types'
import { getBrowserContext, getAdConversionFromHref } from './helper'

const saveAdConversion: WebflowScript = {
  requireFeatureFlag: 'webflow_script_save_ad_conversion',
  handler: () => {
    const { isConversion, ...adConversionParams } = getAdConversionFromHref()
    if (isConversion) {
      const browserContext = getBrowserContext()
      const adConversion = {
        ...adConversionParams,
        ...browserContext,
      }

      const url = `https://merchant.open.store/api/ad-click`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adConversion),
      })
    }
  },
}

export default saveAdConversion
