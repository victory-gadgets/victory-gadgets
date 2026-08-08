import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env.local and add your Sanity project ID.',
  )
}

export default defineCliConfig({
  api: {projectId, dataset},
  deployment: {appId: 'e2os64ieo1yo93ioqh6g8jby'},
})
