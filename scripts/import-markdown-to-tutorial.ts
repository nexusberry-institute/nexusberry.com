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
const LECTURE_FOLDER = 'public/frontend-react/lecture-2'
const CHEATSHEET_PATH = `${LECTURE_FOLDER}/cheatsheet.md`
const ASSIGNMENT_PATH = `${LECTURE_FOLDER}/assignment.md`
const TUTORIAL_TITLE = 'Semantic HTML & Accessibility Cheatsheet'
const TUTORIAL_SLUG = 'semantic-html-accessibility-cheatsheet'

async function main() {
  // 1. Read markdown files
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const cheatsheetMd = readFileSync(
    path.resolve(__dirname, '..', CHEATSHEET_PATH),
    'utf-8',
  )
  console.log(`Read ${cheatsheetMd.length} chars from ${CHEATSHEET_PATH}`)

  const assignmentMd = readFileSync(
    path.resolve(__dirname, '..', ASSIGNMENT_PATH),
    'utf-8',
  )
  console.log(`Read ${assignmentMd.length} chars from ${ASSIGNMENT_PATH}`)

  // 2. Init Payload (connects to DB)
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  // 3. Convert markdown → Lexical JSON using custom converter
  const cheatsheetJSON = convertMarkdownToLexicalJSON(cheatsheetMd)
  console.log(`Cheatsheet → Lexical JSON (${(cheatsheetJSON as any).root.children.length} blocks)`)

  const assignmentJSON = convertMarkdownToLexicalJSON(assignmentMd)
  console.log(`Assignment → Lexical JSON (${(assignmentJSON as any).root.children.length} blocks)`)

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
      data: { content: cheatsheetJSON as any, assignment: assignmentJSON as any },
      overrideAccess: true,
    })
    console.log(`Updated tutorial ID ${doc.id}`)
  } else {
    const created = await payload.create({
      collection: 'tutorials',
      data: {
        title: TUTORIAL_TITLE,
        slug: TUTORIAL_SLUG,
        content: cheatsheetJSON as any,
        assignment: assignmentJSON as any,
      },
      overrideAccess: true,
    })
    console.log(`Created tutorial ID ${created.id}`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
