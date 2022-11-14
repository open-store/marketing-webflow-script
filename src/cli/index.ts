import path from 'path'
import { log } from 'console'
import { promises as fsPromise } from 'fs'
import { makeS3Client, uploadFileToS3 } from './awsS3Client'
import { v4 as uuidv4 } from 'uuid'
import {execSync} from 'child_process'
async function main() {
  log('Running: marketing-webflow-script CLI')

  log('Deploying build scripts to S3')
  const s3Client = makeS3Client()
  const pathToDist = path.resolve(__dirname, '..', '..', 'dist')
  const pathToEsbuild = path.resolve(pathToDist, 'esbuild')
  const pathToCompressedLoader = path.resolve(pathToEsbuild, 'loader', 'index.gz.js')
  const pathToCompressedPackages = path.resolve(pathToEsbuild, 'packages', 'index.gz.js')
  const pathToPackagesTags = path.resolve(pathToDist, 'tags.json')
  const pathToCompressedPackagesTags = path.resolve(pathToDist, 'tags.gz.json')
  const tag = uuidv4()

  const loaderUrl = await uploadFileToS3({
    client: s3Client,
    filePath: pathToCompressedLoader,
    destPath: 'loader/index.gz.js',
  })
  log(`Uploaded loader bundle to: '${loaderUrl}'`)

  const packagesUrl = await uploadFileToS3({
    client: s3Client,
    filePath: pathToCompressedPackages,
    destPath: `packages/${tag}.gz.js`,
  })
  log(`Uploaded packages bundle to: '${packagesUrl}'`)

  log(`Tagging current release to version: '${tag}'`)
  log(`Writing to file: '${pathToPackagesTags}'`)
  await fsPromise.writeFile(pathToPackagesTags, JSON.stringify({ latest: tag }))
  execSync(`gzip -c -9 ${pathToPackagesTags} > ${pathToCompressedPackagesTags}`)

  const tagsUrl = await uploadFileToS3({
    client: s3Client,
    filePath: pathToCompressedPackagesTags,
    destPath: 'loader/tags.gz.json',
    contentType: 'application/json'
  })
  log(`Uploaded tags to: '${tagsUrl}'`)

  log('Done')
}

main()
