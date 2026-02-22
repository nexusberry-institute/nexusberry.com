/**
 * Script to import a markdown file into a Tutorial document's richText (Lexical) field
 *
 * Usage: npx tsx --env-file=.env.local scripts/import-markdown-to-tutorial.ts
 */

import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { convertMarkdownToLexicalJSON } from './markdown-to-lexical'

// --- CONFIGURATION ---
const MARKDOWN_FILE_PATH = 'public/frontend-react/lecture-2/cheatsheet.md'
const TUTORIAL_TITLE = 'Semantic HTML & Accessibility Cheatsheet'
const TUTORIAL_SLUG = 'semantic-html-accessibility-cheatsheet'

async function main() {
  // 1. Read markdown
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const markdown = readFileSync(
    path.resolve(__dirname, '..', MARKDOWN_FILE_PATH),
    'utf-8',
  )
  console.log(`Read ${markdown.length} chars from ${MARKDOWN_FILE_PATH}`)

  // 2. Init Payload (connects to DB)
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  // 3. Convert markdown → Lexical JSON using custom converter
  const lexicalJSON = convertMarkdownToLexicalJSON(markdown)
  console.log(`Converted to Lexical JSON (${(lexicalJSON as any).root.children.length} blocks)`)

  // 4. Upsert: update if exists, create if not
  const existing = await payload.find({
    collection: 'tutorials',
    where: { slug: { equals: TUTORIAL_SLUG } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const doc = existing.docs[0]!
    await payload.update({
      collection: 'tutorials',
      id: doc.id,
      data: { content: lexicalJSON as any },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Updated tutorial ID ${doc.id}`)
  } else {
    const created = await payload.create({
      collection: 'tutorials',
      data: {
        title: TUTORIAL_TITLE,
        slug: TUTORIAL_SLUG,
        content: lexicalJSON as any,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`Created tutorial ID ${created.id}`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
