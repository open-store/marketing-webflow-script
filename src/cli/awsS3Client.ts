import fs from 'fs'
import path from 'path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  AWS_SECRET_KEY,
  AWS_ACCESS_KEY,
  AWS_WEBFLOW_SCRIPT_S3_BUCKET,
  AWS_REGION,
} from './constants'

export function makeS3Client() {
  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  })
}

export function getStorageUrl(
  bucket: string,
  region: string,
  fileName: string,
): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`
}

export async function uploadFileToS3(
  client: S3Client,
  filePath: string,
  destPath?: string,
) {
  const fileStream = fs.createReadStream(filePath)
  const fileKey = destPath || path.basename(filePath)

  await client.send(
    new PutObjectCommand({
      Bucket: AWS_WEBFLOW_SCRIPT_S3_BUCKET,
      Key: fileKey,
      Body: fileStream,
      ACL: 'public-read',
    }),
  )

  return getStorageUrl(AWS_WEBFLOW_SCRIPT_S3_BUCKET, AWS_REGION, fileKey)
}
