import { WebflowScript, WebflowScripts } from './types'
import addScriptTag from '../common/addScriptTag'
import { getConfig } from './utils/featureFlags'

const businessFormAndSegment: WebflowScript = {
  requireFeatureFlag: 'webflow_script_businessformandsegment',
  handler: () => {
    const global: any = window
    if (
      global.location.hostname === 'open.store' ||
      global.location.hostname === 'webflow-prod.open.store'
    ) {
      global.environment = 'prod'
    } else {
      global.environment = 'dev'
    }
    if (global.environment === 'prod') {
      global.SEGMENT_WRITE_KEY = 'KAT5o7re9yC3IjvFdmwo1U9WDPHg4Qrg'
      global.MAGICLINK_PUBLISHABLE_KEY = 'pk_live_7B8E2E83AFC00F8C'
    } else {
      global.SEGMENT_WRITE_KEY = 'AnuYmlQvLDeJuuQGFAMeyeKFIyCFCmYE'
      global.MAGICLINK_PUBLISHABLE_KEY = 'pk_test_F410A8A77358DB0E'
    }
    addScriptTag(
      'BusinessFormAndAnalytics',
      'https://os-frontend-artifacts-dev.s3.us-west-2.amazonaws.com/webflow-v2.2.js',
    )
  },
}

const segmentOnPageLoad: WebflowScript = {
  requireFeatureFlag: 'webflow_script_segmentonpageload',
  handler: () => {
    const global: any = window
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

const owlsEventListners: WebflowScript = {
  requireFeatureFlag: 'webflow_script_owlseventlistners',
  handler: () => {
    const global: any = window
    const log = (...msg: any) =>
      console.log(new Date().getTime(), 'open-store', ...msg)

    // Only business pages have these event listeners
    if (!global.location.pathname.startsWith('/business')) {
      log("Skipping 'owlsEventListners'")
      return
    }

    function loginEvents(): any {
      const formLogin = document.getElementById('os-login-form') as any
      const formSignUp = document.getElementById(
        'os-signup-form-container',
      ) as any
      const buttonLogin = document.getElementById('os-login-button') as any
      const buttonSignup = document.getElementById('os-signup-button') as any
      const buttonOffer = document.getElementById('os-offer-button') as any

      log({
        formLogin: formLogin,
        formSignUp: formSignUp,
        buttonLogin: buttonLogin,
        buttonSignup: buttonSignup,
      })

      if (!formLogin || !formSignUp || !buttonLogin || !buttonSignup) {
        return setTimeout(loginEvents, 250)
      }

      buttonLogin.addEventListener('click', (e: any) => {
        log('click', e)

        if (!buttonLogin.attributes.getNamedItem('data-user')) {
          formSignUp.classList.add('hidden')
          formLogin.classList.remove('hidden')
          ;(document.getElementById('os-login-form-email') as any).focus()
        }
      })

      buttonSignup.addEventListener('click', (e: any) => {
        e.preventDefault()

        formLogin.classList.add('hidden')
        formSignUp.classList.remove('hidden')
        ;(window as any).jQuery('html').animate({ scrollTop: 0 }, 'slow')
        setTimeout(() => document.getElementById('emailAddress')!.focus(), 250)
      })

      buttonOffer.addEventListener('click', (e: any) => {
        e.preventDefault()

        formLogin.classList.add('hidden')
        formSignUp.classList.remove('hidden')
        document.getElementById('emailAddress')!.focus()
      })
    }

    loginEvents()
  },
}

const owlsEventListnersReferredSignUp: WebflowScript = {
  requireFeatureFlag: 'webflow_script_owlseventlistners_referredsignup',
  handler: () => {
    const global: any = window
    const log = (...msg: any) =>
      console.log(new Date().getTime(), 'open-store', ...msg)

    // Only referred sign up page has these event listeners. Other pages use
    // different method.
    if (global.location.pathname !== '/referred-sign-up') {
      log("Skipping 'owlsEventListnersReferredSignUp'")
      return
    }

    function loginEvents(): any {
      if (typeof global.owlsMagic === 'undefined') {
        if (
          typeof global.Magic === 'function' &&
          !!global.MAGICLINK_PUBLISHABLE_KEY
        ) {
          global.owlsMagic = new global.Magic(global.MAGICLINK_PUBLISHABLE_KEY)
        }

        return setTimeout(loginEvents, 250)
      }

      const formLogin = document.getElementById('os-login-form')
      const formSignUp = document.getElementById('os-signup-form-container')
      const buttonLogin = document.getElementById('os-login-button')
      const buttonSignup = document.getElementById('os-signup-button')
      const buttonOffer = document.getElementById('os-offer-button')
      const magicIsReady = !!global.owlsMagic.apiKey

      log({
        formLogin: formLogin,
        formSignUp: formSignUp,
        buttonLogin: buttonLogin,
        buttonSignup: buttonSignup,
        magicIsReady: magicIsReady,
      })

      if (
        !formLogin ||
        !formSignUp ||
        !buttonLogin ||
        !buttonSignup ||
        !magicIsReady
      ) {
        return setTimeout(loginEvents, 250)
      }

      async function checkLogin() {
        buttonLogin?.classList.add('hidden')

        if (await global.owlsMagic.user.isLoggedIn()) {
          loginValid(await global.owlsMagic.user.getIdToken())
        }

        buttonLogin?.classList.remove('hidden')
      }

      function loginWithEmail(email: string) {
        return global.owlsMagic.auth.loginWithMagicLink({ email })
      }

      function logOut() {
        return global.owlsMagic.user.logout()
      }

      function loginValid(e: any) {
        const email = document.getElementById('os-login-form-email')
        const submit = document.getElementById('os-login-form-button')

        formLogin?.classList.add('hidden')
        formSignUp?.classList.remove('hidden')
        buttonLogin?.setAttribute('data-user', e)
        if (buttonLogin) {
          buttonLogin.innerHTML = 'Log out'
        }

        email?.removeAttribute('readonly')

        if (submit) {
          submit.style.opacity = '1'
          ;(submit as any).value = 'Log In'
          submit.removeAttribute('disable')
        }

        log(e)
      }

      function loginFailed(err: any) {
        const email = document.getElementById('os-login-form-email')
        const submit = document.getElementById('os-login-form-button')

        email?.removeAttribute('readonly')

        if (submit) {
          submit.style.opacity = '1'
          ;(submit as any).value = 'Log In'
          submit.removeAttribute('disable')
        }

        log({ err })
      }

      function logoutValid(e: any) {
        if (buttonLogin) {
          buttonLogin.removeAttribute('data-user')
          buttonLogin.innerHTML = 'Log in'
        }

        log(e)
      }

      formLogin.addEventListener('submit', (e) => {
        e.preventDefault()

        const email = document.getElementById('os-login-form-email')
        const submit = document.getElementById('os-login-form-button')

        email?.setAttribute('readonly', 'readonly')

        if (submit) {
          submit.style.opacity = '0.5'
          ;(submit as any).value = 'Please wait...'
          submit.setAttribute('disable', 'disable')
        }

        loginWithEmail((email as any).value)
          .then(loginValid)
          .catch(loginFailed)
      })

      buttonLogin.addEventListener('click', (e) => {
        e.preventDefault()

        log('click', e)

        if (!buttonLogin.attributes.getNamedItem('data-user')) {
          formSignUp.classList.add('hidden')
          formLogin.classList.remove('hidden')
          document.getElementById('os-login-form-email')?.focus()
        } else {
          logOut().then(logoutValid).catch(loginFailed)
        }
      })

      buttonSignup.addEventListener('click', (e) => {
        e.preventDefault()

        formLogin.classList.add('hidden')
        formSignUp.classList.remove('hidden')
        if (global.jQuery) {
          global.jQuery('html').animate({ scrollTop: 0 }, 'slow')
        }
        setTimeout(() => document.getElementById('emailAddress')?.focus(), 250)
      })

      buttonOffer?.addEventListener('click', (e) => {
        e.preventDefault()

        formLogin.classList.add('hidden')
        formSignUp.classList.remove('hidden')
        document.getElementById('emailAddress')?.focus()
      })

      checkLogin()
    }

    loginEvents()
  },
}

const growsurf: WebflowScript = {
  requireFeatureFlag: 'webflow_script_growsur',
  handler: () => {
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

    const w: any = window
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
      })
      // @ts-ignore
      DD_RUM.startSessionReplayRecording()
    })
    /*eslint-enable */
  },
}

const scripts: WebflowScripts = {
  businessFormAndSegment,
  segmentOnPageLoad,
  webflowOffSubmit,
  owlsEventListners,
  owlsEventListnersReferredSignUp,
  growsurf,
  clearbit,
  stackadapt,
  datadogRum,
}
export default scripts
