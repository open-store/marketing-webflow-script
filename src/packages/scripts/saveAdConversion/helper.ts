import { parseCookie } from '../../utils/cookieUtils'
import {
  AdClickBrowserContext,
  AdPlatform,
  FacebookCookieProperties,
  IsAdConversionResult,
} from './types'

export function getFacebookCookieProperties(): FacebookCookieProperties {
  const cookies =
    typeof document.cookie === 'string' ? parseCookie(document.cookie) : {}

  return {
    fbc: cookies['_fbc'] || '',
    fbp: cookies['_fbp'] || '',
  }
}

export const getAdConversionFromHref: () => IsAdConversionResult = () => {
  try {
    const searchParams = new URL(window.location.href).searchParams
    const gclid = searchParams.get('gclid')
    const fbclid = searchParams.get('fbclid')
    const ttclid = searchParams.get('ttclid')

    if (gclid) {
      return {
        isConversion: true,
        clickId: gclid,
        platform: AdPlatform.GoogleAds,
      }
    } else if (fbclid) {
      const { fbp: facebookPixel } = getFacebookCookieProperties()
      return {
        isConversion: true,
        clickId: fbclid,
        platform: AdPlatform.FacebookAds,
        facebookPixel,
      }
    } else if (ttclid) {
      return {
        isConversion: true,
        clickId: ttclid,
        platform: AdPlatform.TikTokAds,
      }
    }
    return {
      isConversion: false,
    }
  } catch (e) {
    return {
      isConversion: false,
    }
  }
}

const getSegmentIds = () => {
  const cookies =
    typeof document.cookie === 'string' ? parseCookie(document.cookie) : {}
  return cookies['ajs_user_id']
    ? {
        anonymousId: cookies['ajs_anonymous_id'],
        leadId: cookies['ajs_user_id'],
      }
    : cookies['ajs_anonymous_id']
    ? { anonymousId: cookies['ajs_anonymous_id'] }
    : {}
}

export const getAdClickBrowserContext = (): AdClickBrowserContext => {
  return {
    ...getSegmentIds(),
    userAgent: navigator.userAgent,
  }
}
