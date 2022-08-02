import 'dotenv/config'

const { env } = process

function getEnvVar(key: string): string {
  const envVar = env[key]
  if (!envVar) {
    throw new Error(`Missing required environment variable: '${key}'`)
  }
  return envVar
}

export const AWS_SECRET_KEY = getEnvVar('AWS_SECRET_KEY')
export const AWS_ACCESS_KEY = getEnvVar('AWS_ACCESS_KEY')
export const AWS_WEBFLOW_SCRIPT_S3_BUCKET =
  env.AWS_WEBFLOW_SCRIPT_S3_BUCKET ?? 'marketing-webflow-script-bucket'
export const AWS_REGION = env.AWS_REGION ?? 'us-west-2'
