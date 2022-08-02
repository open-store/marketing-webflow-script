import path from 'path'
import { log } from 'console'
import { promises as fsPromise } from 'fs'
import { makeS3Client, uploadFileToS3 } from './awsS3Client'
import { v4 as uuidv4 } from 'uuid'

async function main() {
  log('Running: marketing-webflow-script CLI')

  log('Deploying build scripts to S3')
  const s3Client = makeS3Client()
  const pathToDist = path.resolve(__dirname, '..', '..', 'dist')
  const pathToEsbuild = path.resolve(pathToDist, 'esbuild')
  const pathToLoader = path.resolve(pathToEsbuild, 'loader', 'index.js')
  const pathToPackages = path.resolve(pathToEsbuild, 'packages', 'index.js')
  const pathToPackagesTags = path.resolve(pathToDist, 'tags.json')
  const tag = uuidv4()

  const loaderUrl = await uploadFileToS3(
    s3Client,
    pathToLoader,
    'loader/index.js', // Destination on S3 bucket.
  )
  log(`Uploaded loader bundle to: '${loaderUrl}'`)

  const packagesUrl = await uploadFileToS3(
    s3Client,
    pathToPackages,
    `packages/${tag}.js`, // Destination on S3 bucket.
  )
  log(`Uploaded packages bundle to: '${packagesUrl}'`)

  log(`Tagging current release to version: '${tag}'`)
  log(`Writing to file: '${pathToPackagesTags}'`)
  await fsPromise.writeFile(pathToPackagesTags, JSON.stringify({ latest: tag }))
  const tagsUrl = await uploadFileToS3(
    s3Client,
    pathToPackagesTags,
    'loader/tags.json', // Destination on S3 bucket.
  )
  log(`Uploaded tags to: '${tagsUrl}'`)

  log('Done')
}

main()
