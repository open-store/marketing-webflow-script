import { WebflowScript } from '../../types'
import { SIGNUP_FORM_VALIDATION_SCHEMA } from './utils'

const handleSignupSubmission: WebflowScript = {
  requireFeatureFlag: 'webflow_script_handle_signup_form_submission',
  handler: () => {
    // === Custom Form Handling ===

    // unbind webflow form handling
    $(document).off('submit')

    // new form handling
    $('#signup-form').submit(function (evt) {
      evt.preventDefault()
      const submitButton = $('#signup-button')
      const errorMessage = $('#signup-errorMessage')
      const emailAddress = $('#signup-emailAddress').val()
      const storeUrl = $('#signup-storeUrl').val()

      // Reset error message first
      errorMessage.html('')

      if (
        SIGNUP_FORM_VALIDATION_SCHEMA.isValidSync({ emailAddress, storeUrl })
      ) {
        // Disable button to prevent double submission
        const originalText = submitButton.val()
        submitButton.prop('disabled', true)
        submitButton.val('Loading....')
        const signupBaseUrl = 'http://localhost:3000/signup'
        const searchParams = new URL(window.location.href).searchParams
        searchParams.set(
          'emailAddress',
          encodeURIComponent(emailAddress as string),
        )
        searchParams.set('storeUrl', encodeURIComponent(storeUrl as string))

        // Reset button state
        submitButton.prop('disabled', false)
        submitButton.val(originalText as string)
        window.location.href = `${signupBaseUrl}?${searchParams.toString()}`
        return false
      } else {
        // Show error messages if validation fails
        errorMessage.html('Invalid email or website')
        return false
      }
    })
  },
}

export default handleSignupSubmission
