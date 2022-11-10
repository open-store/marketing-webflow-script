import { WebflowScript, WebflowScripts } from './types'
import addScriptTag from '../common/addScriptTag'
import { getConfig } from './utils/featureFlags'
import { isBusinessPage, isHomePage, isProd, URLs } from './utils/pageChecks'
import { saveAdConversion } from './scripts/saveAdConversion'
import { handleSignupSubmission } from './scripts/handleSignupSubmission'
import { isAdBlockerDetected } from './scripts/detectAdBlocker'
import { bingScript } from './scripts/bingScript'
import { postalyticsScript } from './scripts/postalyticsScript'

const segmentOnPageLoad: WebflowScript = {
  requireFeatureFlag: 'webflow_script_segmentonpageload',
  handler: () => {
    const global: any = window
    // Do not enabled this script on homepage
    if (isHomePage()) {
      console.log("Skipping 'legacy-segmentOnPageLoad'")
      return
    }

    const removeQueryParams = (pathname: string) => pathname.split('?')[0]
    // This handler requires for `businessFormAndSegment` to load the Segment
    // script tag first. It does not load Segment on its own.
    const handleAnalytics = () => {
      global.analyticsOS.SegmentBrowser.identify()

      // Replacing old pageView event with custom one that does not fire legacy
      // events anymore.
      // global.analyticsOS.analytics.pageView(window.location.pathname)
      const parsedRoute = removeQueryParams(global.location.pathname)
      global.analyticsOS.SegmentBrowser.pageView(parsedRoute)
    }

    // Wait for analyticsOS to load first.
    const interval = setInterval(function () {
      if (
        global?.analyticsOS?.SegmentBrowser?.identify &&
        global?.analyticsOS?.analytics?.pageView
      ) {
        clearInterval(interval)
        handleAnalytics()
      }
    }, 250)
  },
}

const webflowOffSubmit: WebflowScript = {
  requireFeatureFlag: 'webflow_script_webflowoffsubmit',
  handler: () => {
    const $ = (window as any).$ || null
    const Webflow = (window as any).Webflow || []

    Webflow.push(function () {
      if ($) {
        $(document).off('submit')
      }
    })
  },
}

const businessPageHeaderButtons: WebflowScript = {
  requireFeatureFlag: 'webflow_script_business_page_header_buttons',
  handler: () => {
    if (!isBusinessPage()) {
      console.log("Skipping 'businessPageHeaderButtons'")
    }

    $(document).ready(() => {
      $('#os-offer-button').click(() => {
        $('#signup-emailAddress').focus()
      })

      $('#os-signup-button').click(() => {
        $('#signup-emailAddress').focus()
      })

      $('#os-login-button').click((evt) => {
        evt.preventDefault()
        const baseUrl = isProd()
          ? URLs.merchantOpenStore
          : window.location.origin
        window.location.href = `${baseUrl}/signin`
      })
    })
  },
}

const growsurf: WebflowScript = {
  requireFeatureFlag: 'webflow_script_growsur',
  handler: () => {
    const w: any = window

    if (w.location.search.indexOf('grsf') < 0) {
      return
    }
    // Read dynamic values config storage.
    // https://console.statsig.com/jRE7w34M1UUAn7AQKzWVC/dynamic_configs/webflow_config_growsurf
    const { campaignId, version } = getConfig('webflow_config_growsurf', [
      'campaignId',
      'version',
    ])

    // NOTE: this part of original snippet is just causing infinite loop as
    // `growsurf.init` will make API call and re-trigger `grsfReady` shortly
    // after. Commenting this one out until further investigation.
    // DOCS: https://docs.growsurf.com/integrate/javascript-web-api/api-reference#initialize-reinitialize-growsurf
    // window.addEventListener('grsfReady', () => {
    //   // eslint-disable-next-line
    //   ;(window as any)?.growsurf?.init?.()
    // })

    w.grsfSettings = { campaignId, version }
    const src =
      'https://app.growsurf.com/growsurf.js' + '?v=' + w.grsfSettings.version
    addScriptTag('GrowsurfScript', src, {
      attributes: { 'grsf-campaign': w.grsfSettings.campaignId },
    })
  },
}

const clearbit: WebflowScript = {
  requireFeatureFlag: 'webflow_script_clearbit',
  handler: () => {
    addScriptTag(
      'ClearbitScript',
      'https://tag.clearbitscripts.com/v1/pk_54489c9de5163c9627ecf9d256b0fbe0/tags.js',
    )
  },
}

const stackadapt: WebflowScript = {
  requireFeatureFlag: 'webflow_script_stackadapt',
  handler: () => {
    /*eslint-disable */
    ;(function (s: any, a: any, e: any, v: any) {
      if (s.saq) return
      const n: any = (s.saq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments)
      })
      if (!s._saq) s._saq = n
      n.push = n
      n.loaded = !0
      n.version = '1.0'
      n.queue = []
      const t: any = a.createElement(e)
      t.async = !0
      t.src = v
      const z: any = a.getElementsByTagName(e)[0]
      z.parentNode.insertBefore(t, z)
      /*eslint-enable */
    })(window, document, 'script', 'https://tags.srv.stackadapt.com/events.js')
    ;(window as any)?.saq('ts', '8wsDO1gLC2C5bNRbR1pcVg')
  },
}

const datadogRum: WebflowScript = {
  requireFeatureFlag: 'webflow_datadog_rum',
  handler: () => {
    /*eslint-disable */
    ;(function (h: any, o: any, u: any, n: any, d: any) {
      h = h[d] = h[d] || {
        q: [],
        onReady: function (c: any) {
          h.q.push(c)
        },
      }
      d = o.createElement(u)
      d.async = 1
      d.src = n
      n = o.getElementsByTagName(u)[0]
      n.parentNode.insertBefore(d, n)
    })(
      window,
      document,
      'script',
      'https://www.datadoghq-browser-agent.com/datadog-rum-v4.js',
      'DD_RUM',
    )
    // @ts-ignore
    DD_RUM.onReady(function () {
      // @ts-ignore
      DD_RUM.init({
        clientToken: 'pubc69fea4df0af75f8d047a90c290b3c08',
        applicationId: '3edb7113-40a5-4ea6-a664-c19664f64146',
        site: 'datadoghq.com',
        service: 'webflow.open.store',
        env: 'production',
        version: '1.0.0',
        sampleRate: 100,
        premiumSampleRate: 100,
        trackInteractions: true,
        defaultPrivacyLevel: 'allow',
        trackSessionAcrossSubdomains: true,
      })
      // @ts-ignore
      DD_RUM.startSessionReplayRecording()
    })
    /*eslint-enable */
  },
}

const hubspotScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_hubspot',
  handler: () => {
    addScriptTag('hs-script-loader', '//js-na1.hs-scripts.com/19951416.js', {
      defer: true,
    })
  },
}

const segmentInitScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_segment_init',
  handler: () => {
    // Only enabled this script on homepage
    if (!isHomePage()) {
      console.log("Skipping 'segmentInitScript'")
      return
    }

    // Copied from https://app.segment.com/os-prod/sources/open-store/overview
    /*eslint-disable */
    // @ts-ignore
    !(function () {
      // @ts-ignore
      var analytics = (window.analytics = window.analytics || [])
      if (!analytics.initialize)
        if (analytics.invoked)
          window.console &&
            console.error &&
            console.error('Segment snippet included twice.')
        else {
          analytics.invoked = !0
          analytics.methods = [
            'trackSubmit',
            'trackClick',
            'trackLink',
            'trackForm',
            'pageview',
            'identify',
            'reset',
            'group',
            'track',
            'ready',
            'alias',
            'debug',
            'page',
            'once',
            'off',
            'on',
            'addSourceMiddleware',
            'addIntegrationMiddleware',
            'setAnonymousId',
            'addDestinationMiddleware',
          ]
          // @ts-ignore
          analytics.factory = function (e) {
            return function () {
              var t = Array.prototype.slice.call(arguments)
              t.unshift(e)
              analytics.push(t)
              return analytics
            }
          }
          for (var e = 0; e < analytics.methods.length; e++) {
            var key = analytics.methods[e]
            analytics[key] = analytics.factory(key)
          }
          // @ts-ignore
          analytics.load = function (key, e) {
            var t = document.createElement('script')
            t.type = 'text/javascript'
            t.async = !0
            t.src =
              'https://cdn.segment.com/analytics.js/v1/' +
              key +
              '/analytics.min.js'
            var n = document.getElementsByTagName('script')[0]
            // @ts-ignore
            n.parentNode.insertBefore(t, n)
            analytics._loadOptions = e
          }
          analytics._writeKey = 'KAT5o7re9yC3IjvFdmwo1U9WDPHg4Qrg'
          analytics.SNIPPET_VERSION = '4.15.3'
          analytics.load('KAT5o7re9yC3IjvFdmwo1U9WDPHg4Qrg')
          analytics.page()
        }
    })()
    /*eslint-enable */
  },
}

const segmentAfterInitScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_segment_after_init',
  handler: () => {
    const global: any = window
    // Only enabled this script on homepage
    if (!isHomePage()) {
      console.log("Skipping 'segmentAfterInitScript'")
      return
    }

    const handleAnalytics = async () => {
      const props =
        global.location.search.indexOf('email') >= 0 &&
        global.location.search.indexOf('utm_source') >= 0
          ? {
              initial_query_string:
                global.location.pathname + global.location.search,
            }
          : {}

      global.analytics.identify(props)

      const parsedRoute = global.location.pathname
      global.analytics.pageview(parsedRoute)

      const adBlockerDetected = await isAdBlockerDetected()
      global.analytics.identify({
        ['ad_blocker_detected']: adBlockerDetected,
      })
    }

    // Wait for analyticsOS to load first.
    const interval = setInterval(async function () {
      if (global?.analytics?.identify && global?.analytics?.pageview) {
        clearInterval(interval)
        await handleAnalytics()
      }
    }, 250)
  },
}

const scripts: WebflowScripts = {
  segmentOnPageLoad,
  webflowOffSubmit,
  businessPageHeaderButtons,
  growsurf,
  clearbit,
  stackadapt,
  datadogRum,
  hubspotScript,
  segmentInitScript,
  segmentAfterInitScript,
  saveAdConversion,
  handleSignupSubmission,
  bingScript,
  postalyticsScript,
}
export default scripts
