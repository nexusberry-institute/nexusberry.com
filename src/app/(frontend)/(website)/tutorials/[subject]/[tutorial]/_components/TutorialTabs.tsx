'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichText } from '@payloadcms/richtext-lexical/react'
import QuizSection from './QuizSection'
import CodeViewer from './CodeViewer'
import PresentationViewer from './PresentationViewer'
import type { Quiz } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  content?: DefaultTypedEditorState | null
  quiz?: Quiz | null
  assignment?: DefaultTypedEditorState | null
  codeUrl?: string | null
  presentationUrl?: string | null
}

type TabConfig = {
  id: string
  label: string
  icon: React.ReactNode
}

const CheatsheetIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const QuizIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const AssignmentIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

const CodeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const PresentationIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

export default function TutorialTabs({ content, quiz, assignment, codeUrl, presentationUrl }: Props) {
  const tabs: TabConfig[] = []

  if (content) tabs.push({ id: 'cheatsheet', label: 'Cheatsheet', icon: CheatsheetIcon })
  if (quiz) tabs.push({ id: 'quiz', label: 'Quiz', icon: QuizIcon })
  if (assignment) tabs.push({ id: 'assignment', label: 'Assignment', icon: AssignmentIcon })
  if (codeUrl) tabs.push({ id: 'code', label: 'Code', icon: CodeIcon })
  if (presentationUrl) tabs.push({ id: 'presentation', label: 'Presentation', icon: PresentationIcon })

  if (tabs.length === 0) return null

  return (
    <section className="padding-x max-w-5xl mx-auto pb-16 md:pb-20">
      <Tabs defaultValue={tabs[0]!.id} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-4 py-2 text-sm"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {content && (
          <TabsContent value="cheatsheet" className="mt-6">
            <RichText data={content} className="prose md:prose-md max-w-none" />
          </TabsContent>
        )}

        {quiz && (
          <TabsContent value="quiz" className="mt-6">
            <QuizSection quiz={quiz} />
          </TabsContent>
        )}

        {assignment && (
          <TabsContent value="assignment" className="mt-6">
            <RichText data={assignment} className="prose md:prose-md max-w-none" />
          </TabsContent>
        )}

        {codeUrl && (
          <TabsContent value="code" className="mt-6">
            <CodeViewer url={codeUrl} />
          </TabsContent>
        )}

        {presentationUrl && (
          <TabsContent value="presentation" className="mt-6">
            <PresentationViewer url={presentationUrl} />
          </TabsContent>
        )}
      </Tabs>
    </section>
  )
}
