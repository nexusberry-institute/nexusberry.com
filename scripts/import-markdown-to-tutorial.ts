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
const QUIZ_PATH = `${LECTURE_FOLDER}/quiz.md`
const TUTORIAL_TITLE = 'Semantic HTML & Accessibility Cheatsheet'
const TUTORIAL_SLUG = 'semantic-html-accessibility-cheatsheet'
const QUIZ_TITLE = 'Lecture 2: Semantic HTML & Accessibility Quiz'
const QUIZ_SLUG = 'lecture-2-semantic-html-accessibility-quiz'

// --- QUIZ PARSER ---

interface ParsedQuestion {
  questionText: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const ANSWER_LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }

function parseQuizMarkdown(markdown: string): ParsedQuestion[] {
  // Split into question blocks by "## Question N"
  const questionBlocks = markdown.split(/^## Question \d+/m).slice(1)

  return questionBlocks.map((block, i) => {
    const lines = block.trim().split('\n')

    // Find the **Question:** line
    const questionIdx = lines.findIndex((l) => l.startsWith('**Question:**'))
    if (questionIdx === -1) throw new Error(`Question ${i + 1}: missing **Question:** line`)
    const questionText = lines[questionIdx]!.replace('**Question:**', '').trim()

    // Collect options (lines starting with "- A)", "- B)", etc.)
    const options: string[] = []
    for (const line of lines) {
      const optMatch = line.match(/^- [A-D]\) (.+)/)
      if (optMatch) options.push(optMatch[1]!)
    }
    if (options.length !== 4) throw new Error(`Question ${i + 1}: expected 4 options, got ${options.length}`)

    // Find **Answer:** line and extract letter
    const answerLine = lines.find((l) => l.startsWith('**Answer:**'))
    if (!answerLine) throw new Error(`Question ${i + 1}: missing **Answer:** line`)
    const answerLetter = answerLine.match(/\*\*Answer:\*\*\s*([A-D])\)/)?.[1]
    if (!answerLetter) throw new Error(`Question ${i + 1}: could not parse answer letter`)
    const correctAnswer = ANSWER_LETTER_TO_INDEX[answerLetter]!

    // Find **Explanation:** line and grab everything after it until end of block
    const explanationIdx = lines.findIndex((l) => l.startsWith('**Explanation:**'))
    if (explanationIdx === -1) throw new Error(`Question ${i + 1}: missing **Explanation:** line`)
    const explanation = lines
      .slice(explanationIdx)
      .join('\n')
      .replace('**Explanation:**', '')
      .trim()

    return { questionText, options, correctAnswer, explanation }
  })
}

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

  const quizMd = readFileSync(
    path.resolve(__dirname, '..', QUIZ_PATH),
    'utf-8',
  )
  console.log(`Read ${quizMd.length} chars from ${QUIZ_PATH}`)

  // 2. Init Payload (connects to DB)
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  // 3. Convert markdown → Lexical JSON using custom converter
  const cheatsheetJSON = convertMarkdownToLexicalJSON(cheatsheetMd)
  console.log(`Cheatsheet → Lexical JSON (${(cheatsheetJSON as any).root.children.length} blocks)`)

  const assignmentJSON = convertMarkdownToLexicalJSON(assignmentMd)
  console.log(`Assignment → Lexical JSON (${(assignmentJSON as any).root.children.length} blocks)`)

  // 4. Parse quiz markdown and create QuizQuestion documents
  const parsedQuestions = parseQuizMarkdown(quizMd)
  console.log(`Parsed ${parsedQuestions.length} quiz questions`)

  const questionIds: number[] = []
  for (let i = 0; i < parsedQuestions.length; i++) {
    const q = parsedQuestions[i]!
    const textJSON = convertMarkdownToLexicalJSON(q.questionText)
    const explanationJSON = convertMarkdownToLexicalJSON(q.explanation)

    const created = await payload.create({
      collection: 'quiz-questions',
      data: {
        text: textJSON as any,
        options: q.options.map((opt) => ({ option: opt })),
        correctAnswer: q.correctAnswer,
        explanation: explanationJSON as any,
      },
      overrideAccess: true,
    })
    questionIds.push(created.id)
    console.log(`  Created QuizQuestion ${i + 1}/10 (ID: ${created.id})`)
  }

  // 5. Upsert Quiz document
  const existingQuiz = await payload.find({
    collection: 'quizzes',
    where: { slug: { equals: QUIZ_SLUG } },
    limit: 1,
    overrideAccess: true,
  })

  let quizId: number
  if (existingQuiz.docs.length > 0) {
    const doc = existingQuiz.docs[0]!
    await payload.update({
      collection: 'quizzes',
      id: doc.id,
      data: { title: QUIZ_TITLE, questions: questionIds },
      overrideAccess: true,
    })
    quizId = doc.id
    console.log(`Updated Quiz ID ${quizId}`)
  } else {
    const created = await payload.create({
      collection: 'quizzes',
      data: {
        title: QUIZ_TITLE,
        slug: QUIZ_SLUG,
        questions: questionIds,
      },
      overrideAccess: true,
    })
    quizId = created.id
    console.log(`Created Quiz ID ${quizId}`)
  }

  // 6. Upsert Tutorial: update if exists, create if not (now includes quiz link)
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
      data: {
        content: cheatsheetJSON as any,
        assignment: assignmentJSON as any,
        quiz: quizId,
      },
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
        content: cheatsheetJSON as any,
        assignment: assignmentJSON as any,
        quiz: quizId,
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
