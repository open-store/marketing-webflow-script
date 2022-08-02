import { WebflowScript, WebflowScripts } from './types'
import addScriptTag from '../common/addScriptTag'
import { getConfig } from './featureFlags'

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
    const log = (...msg: any) =>
      console.log(new Date().getTime(), 'open-store', ...msg)

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

      // function loginValid(e: any) {
      //   const email = document.getElementById('os-login-form-email') as any;
      //   const submit = document.getElementById('os-login-form-button') as any;

      //   formLogin.classList.add('hidden');
      //   formSignUp.classList.remove('hidden');
      //   buttonLogin.setAttribute('data-user', e);
      //   buttonLogin.innerHTML = 'Log out';

      //   email.removeAttribute('readonly');
      //   submit.style.opacity = 1;
      //   submit.value = 'Log In';
      //   submit.removeAttribute('disable');

      //   log(e);
      // }

      // function loginFailed(err: any) {
      //   const email = document.getElementById('os-login-form-email');
      //   const submit = document.getElementById('os-login-form-button');

      //   email.removeAttribute('readonly');
      //   submit.style.opacity = 1;
      //   submit.value = 'Log In';
      //   submit.removeAttribute('disable');

      //   log({ err });
      // }

      // function logoutValid(e: any) {
      //   buttonLogin.removeAttribute('data-user');
      //   buttonLogin.innerHTML = 'Log in';

      //   log(e);
      // }

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

const scripts: WebflowScripts = {
  webflowOffSubmit,
  owlsEventListners,
  growsurf,
  clearbit,
  stackadapt,
}
export default scripts
