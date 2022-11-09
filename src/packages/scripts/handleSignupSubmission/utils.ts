import * as Yup from 'yup'

// https://stackoverflow.com/a/68002755
// Yup's email validation is very strict and requires https:// in front of the route
// We're adding that for them so this validation is a bit more relaxed
export const URL_REGEX =
  /^((ftp|http|https):\/\/)?(www\.)?(?!.*(ftp|http|https|www\.))[a-zA-Z0-9_-][.a-zA-Z0-9_-]*[a-zA-Z0-9](\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?(?:\/)?$/gm

export const SIGNUP_FORM_EMAIL_SCHEMA = Yup.object().shape({
  emailAddress: Yup.string()
    .trim()
    .matches(/^([^+])*$/g)
    .email()
    .max(150)
    .required(),
})

export const SIGNUP_FORM_STORE_URL_SCHEMA = Yup.object().shape({
  storeUrl: Yup.string().trim().matches(URL_REGEX).required(),
})
