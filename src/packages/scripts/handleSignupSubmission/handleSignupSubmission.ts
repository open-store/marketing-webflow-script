import { WebflowScript } from '../../types'
import { isProd, URLs } from '../../utils/pageChecks'
import { SIGNUP_FORM_VALIDATION_SCHEMA } from './utils'

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
        // The Id of the container has to be set on the two parent above
        // Webflow does not support parametrizing ID of a symbol (reusuable component), so
        // the id override needs to happen on one level above
        const id = form.parent().parent().attr('id')

        /**
         * Use id to locate the corresponding element in the group to support
         * multiple forms
         */
        const submitButton = $(`div#${id} .signupbutton`)
        const errorMessage = $(`div#${id} .signuperrormessage`)
        const emailAddress = $(`div#${id} .signupemailaddress`).val()
        const storeUrl = $(`div#${id} .signupstoreurl`).val()

        // Reset error message first
        errorMessage?.html('')

        if (
          SIGNUP_FORM_VALIDATION_SCHEMA.isValidSync({ emailAddress, storeUrl })
        ) {
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
        } else {
          // Show error messages if validation fails
          errorMessage?.html('Invalid email or website')
          return false
        }
      })
    })
  },
}

export default handleSignupSubmission
