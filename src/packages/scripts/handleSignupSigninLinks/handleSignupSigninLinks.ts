import { WebflowScript } from '../../types'
import { isHomePage, isProd, URLs } from '../../utils/pageChecks'

const handleSignupSigninLinks: WebflowScript = {
  requireFeatureFlag: 'webflow_script_handle_signup_signin_links',
  handler: () => {
    if (!isHomePage()) {
      console.log('Skipping handleSignupSigninLinks')
    }

    // new form handling
    $('.signuplink').each(function () {
      const signupLink = $(this)
      signupLink.click(function (evt) {
        evt.preventDefault()

        const signupBaseUrl = isProd()
          ? URLs.merchantOpenStore
          : window.location.origin
        const searchParams = new URL(window.location.href).searchParams.toString()

        window.location.href = `${signupBaseUrl}/signup${searchParams ? `?${searchParams}` : ''}`
      })
    })

    $('.signinlink').each(function () {
      const signinLink = $(this)
      signinLink.click(function (evt) {
        evt.preventDefault()

        const signinBaseUrl = isProd()
          ? URLs.merchantOpenStore
          : window.location.origin
        const searchParams = new URL(window.location.href).searchParams.toString()

        window.location.href = `${signinBaseUrl}/signin${searchParams ? `?${searchParams}` : ''}`
      })
    })
  },
}

export default handleSignupSigninLinks
