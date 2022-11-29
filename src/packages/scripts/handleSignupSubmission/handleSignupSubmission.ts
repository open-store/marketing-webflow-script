import { WebflowScript } from '../../types'
import { isProd, URLs } from '../../utils/pageChecks'
import { SIGNUP_FORM_EMAIL_SCHEMA, SIGNUP_FORM_STORE_URL_SCHEMA } from './utils'

const handleSignupSubmission: WebflowScript = {
  requireFeatureFlag: 'webflow_script_handle_signup_form_submission',
  handler: () => {
    // === Custom Form Handling ===

    // unbind webflow form handling
    $(document).off('submit')

    // new form handling
    $('.signupform').each(function () {
      const signupForm = $(this)
      signupForm.submit(function (evt) {
        evt.preventDefault()
        const form = $(this)
        const submitButton = form.find('.signupbutton')
        const errorMessage = form.find('.signuperrormessage')
        const emailAddress = form.find('.signupemailaddress').val()
        const storeUrl = form.find('.signupstoreurl').val()

        // Reset error message first
        errorMessage?.html('')

        if (!SIGNUP_FORM_EMAIL_SCHEMA.isValidSync({ emailAddress })) {
          errorMessage?.html('Enter a valid email')
          return false
        }

        if (!SIGNUP_FORM_STORE_URL_SCHEMA.isValidSync({ storeUrl })) {
          errorMessage?.html('Enter a valid URL')
          return false
        }

        // Disable button to prevent double submission
        const originalText = submitButton.val()
        submitButton.prop('disabled', true)
        submitButton.val('Loading....')

        const signupBaseUrl = isProd()
          ? URLs.merchantOpenStore
          : window.location.origin
        const searchParams = new URL(window.location.href).searchParams
        searchParams.set(
          'emailAddress',
          encodeURIComponent(emailAddress as string),
        )
        searchParams.set('storeUrl', encodeURIComponent(storeUrl as string))

        window.location.href = `${signupBaseUrl}/signup?${searchParams.toString()}`
        // Reset button state
        submitButton.prop('disabled', false)
        submitButton.val(originalText as string)
        return false
      })
    })
  },
}

export default handleSignupSubmission
