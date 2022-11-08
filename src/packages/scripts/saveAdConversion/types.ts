export type AdClick = {
  platform: string
  clickId: string
  facebookPixel?: string
} & BrowserContext

export enum AdPlatform {
  GoogleAds = 'google_ads',
  FacebookAds = 'facebook_ads',
  TikTokAds = 'tiktok_ads',
}

export type IsAdConversionResult = {
  isConversion: boolean
  clickId?: string
  platform?: AdPlatform
  facebookPixel?: string
}

export type BrowserContext = {
  anonymousId?: string
  leadId?: string
  userAgent?: string
  clientIp?: string
}

export interface FacebookCookieProperties {
  fbc?: string
  fbp?: string
}
