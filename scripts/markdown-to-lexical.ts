// @ts-nocheck – standalone utility script; strict indexed-access checks are unhelpful here
/**
 * Custom Markdown → Lexical JSON converter
 *
 * Handles GFM tables, fenced code blocks, horizontal rules, headings,
 * lists (ordered/unordered), paragraphs, and inline formatting (bold,
 * italic, inline code).
 *
 * Returns a complete Lexical EditorState JSON object ready for PayloadCMS.
 */

// ─── Lexical node helpers ────────────────────────────────────────────

interface LexicalText {
  type: 'text'
  version: 1
  detail: 0
  format: number // 0=plain, 1=bold, 2=italic, 16=code
  mode: 'normal'
  style: ''
  text: string
}

interface LexicalLinebreak {
  type: 'linebreak'
  version: 1
}

type InlineNode = LexicalText | LexicalLinebreak

interface LexicalParagraph {
  type: 'paragraph'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  textFormat: 0
  textStyle: ''
  children: InlineNode[]
}

interface LexicalHeading {
  type: 'heading'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  tag: string
  children: InlineNode[]
}

interface LexicalHR {
  type: 'horizontalrule'
  version: 1
}

interface LexicalBlock {
  type: 'block'
  version: 2
  fields: {
    id: string
    blockType: 'code'
    blockName: string
    language: string
    code: string
  }
}

interface LexicalTableCell {
  type: 'tablecell'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  headerState: number
  colSpan: 1
  rowSpan: 1
  backgroundColor: null
  children: [LexicalParagraph]
}

interface LexicalTableRow {
  type: 'tablerow'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  children: LexicalTableCell[]
}

interface LexicalTable {
  type: 'table'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  children: LexicalTableRow[]
}

interface LexicalListItem {
  type: 'listitem'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  value: number
  children: InlineNode[]
}

interface LexicalList {
  type: 'list'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  listType: 'bullet' | 'number'
  tag: 'ul' | 'ol'
  start: 1
  children: LexicalListItem[]
}

type BlockNode =
  | LexicalParagraph
  | LexicalHeading
  | LexicalHR
  | LexicalBlock
  | LexicalTable
  | LexicalList

// ─── Text node factory ───────────────────────────────────────────────

function textNode(text: string, format: number = 0): LexicalText {
  return {
    type: 'text',
    version: 1,
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
  }
}

function linebreakNode(): LexicalLinebreak {
  return { type: 'linebreak', version: 1 }
}

// ─── Inline markdown parsing ─────────────────────────────────────────

/**
 * Parse inline markdown (bold, italic, inline-code) into an array
 * of LexicalText nodes with appropriate format bitmasks.
 */
function parseInline(text: string): LexicalText[] {
  const nodes: LexicalText[] = []

  // Regex captures: bold+italic, bold, italic, inline-code, or plain text
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Add any plain text before this match
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)))
    }

    if (match[2] !== undefined) {
      // ***bold+italic***
      nodes.push(textNode(match[2], 3)) // 1 (bold) | 2 (italic)
    } else if (match[3] !== undefined) {
      // **bold**
      nodes.push(textNode(match[3], 1))
    } else if (match[4] !== undefined) {
      // *italic*
      nodes.push(textNode(match[4], 2))
    } else if (match[5] !== undefined) {
      // `code`
      nodes.push(textNode(match[5], 16))
    }

    lastIndex = match.index + match[0].length
  }

  // Trailing plain text
  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)))
  }

  // If nothing was parsed, return a single empty text node
  if (nodes.length === 0) {
    nodes.push(textNode(''))
  }

  return nodes
}

// ─── Block-level node builders ───────────────────────────────────────

function paragraphNode(children: InlineNode[]): LexicalParagraph {
  return {
    type: 'paragraph',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    children,
  }
}

function headingNode(tag: string, children: InlineNode[]): LexicalHeading {
  return {
    type: 'heading',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    children,
  }
}

function hrNode(): LexicalHR {
  return { type: 'horizontalrule', version: 1 }
}

let blockIdCounter = 0
function generateBlockId(): string {
  blockIdCounter++
  const timestamp = Date.now().toString(36)
  const counter = blockIdCounter.toString(36).padStart(4, '0')
  return `${timestamp}${counter}`
}

const SUPPORTED_LANGUAGES = new Set(['typescript', 'javascript', 'css', 'html'])

function mapLanguage(lang: string): string {
  const lower = (lang || '').toLowerCase()
  if (SUPPORTED_LANGUAGES.has(lower)) return lower
  // Map common aliases
  if (lower === 'ts' || lower === 'tsx') return 'typescript'
  if (lower === 'js' || lower === 'jsx') return 'javascript'
  if (lower === 'htm') return 'html'
  return 'typescript' // default fallback
}

function codeBlockNode(language: string, lines: string[]): LexicalBlock {
  return {
    type: 'block',
    version: 2,
    fields: {
      id: generateBlockId(),
      blockType: 'code',
      blockName: '',
      language: mapLanguage(language),
      code: lines.join('\n'),
    },
  }
}

function tableNode(
  headerCells: string[],
  bodyRows: string[][],
): LexicalTable {
  const rows: LexicalTableRow[] = []

  // Header row
  rows.push({
    type: 'tablerow',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: headerCells.map(
      (cell): LexicalTableCell => ({
        type: 'tablecell',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        headerState: 1, // ROW header
        colSpan: 1,
        rowSpan: 1,
        backgroundColor: null,
        children: [paragraphNode(parseInline(cell.trim()))],
      }),
    ),
  })

  // Body rows
  for (const row of bodyRows) {
    rows.push({
      type: 'tablerow',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: row.map(
        (cell): LexicalTableCell => ({
          type: 'tablecell',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          headerState: 0,
          colSpan: 1,
          rowSpan: 1,
          backgroundColor: null,
          children: [paragraphNode(parseInline(cell.trim()))],
        }),
      ),
    })
  }

  return {
    type: 'table',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: rows,
  }
}

function listNode(
  items: string[],
  ordered: boolean,
): LexicalList {
  return {
    type: 'list',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    listType: ordered ? 'number' : 'bullet',
    tag: ordered ? 'ol' : 'ul',
    start: 1,
    children: items.map(
      (item, i): LexicalListItem => ({
        type: 'listitem',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        value: i + 1,
        children: parseInline(item),
      }),
    ),
  }
}

// ─── Table parsing helper ────────────────────────────────────────────

function parseTableRow(line: string): string[] {
  // Remove leading/trailing pipes and split
  let trimmed = line.trim()
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1)
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1)
  return trimmed.split('|')
}

function isSeparatorRow(line: string): boolean {
  // A row of dashes and pipes: |---|---|---| or |:---|:---:|---:|
  return /^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(line.trim())
}

// ─── Main converter ──────────────────────────────────────────────────

export function convertMarkdownToLexicalJSON(markdown: string) {
  const lines = markdown.split('\n').map((l) => l.replace(/\r$/, ''))
  const blocks: BlockNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // ── Blank line → skip
    if (line.trim() === '') {
      i++
      continue
    }

    // ── Fenced code block (``` or ~~~)
    const codeMatch = line.match(/^(`{3,}|~{3,})(\w*)/)
    if (codeMatch) {
      const fence = codeMatch[1]
      const lang = codeMatch[2] || ''
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith(fence)) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push(codeBlockNode(lang, codeLines))
      continue
    }

    // ── Horizontal rule: ---, ***, ___ (at least 3)
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push(hrNode())
      i++
      continue
    }

    // ── Heading: # through ######
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const content = headingMatch[2]
      blocks.push(headingNode(`h${level}`, parseInline(content)))
      i++
      continue
    }

    // ── GFM table: starts with a pipe-delimited row followed by a separator row
    if (
      line.trim().includes('|') &&
      i + 1 < lines.length &&
      isSeparatorRow(lines[i + 1])
    ) {
      const headerCells = parseTableRow(line)
      i += 2 // skip header + separator
      const bodyRows: string[][] = []
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        lines[i].trim().includes('|')
      ) {
        bodyRows.push(parseTableRow(lines[i]))
        i++
      }
      blocks.push(tableNode(headerCells, bodyRows))
      continue
    }

    // ── Unordered list: - item or * item
    if (/^[\-\*]\s+/.test(line.trim())) {
      const items: string[] = []
      while (
        i < lines.length &&
        /^[\-\*]\s+/.test(lines[i].trim()) &&
        lines[i].trim() !== ''
      ) {
        items.push(lines[i].trim().replace(/^[\-\*]\s+/, ''))
        i++
      }
      blocks.push(listNode(items, false))
      continue
    }

    // ── Ordered list: 1. item
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = []
      while (
        i < lines.length &&
        /^\d+\.\s+/.test(lines[i].trim()) &&
        lines[i].trim() !== ''
      ) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push(listNode(items, true))
      continue
    }

    // ── Paragraph (default)
    // Collect contiguous non-blank, non-special lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^(`{3,}|~{3,})/) &&
      !lines[i].match(/^#{1,6}\s/) &&
      !/^(\*{3,}|-{3,}|_{3,})\s*$/.test(lines[i].trim()) &&
      !(
        lines[i].trim().includes('|') &&
        i + 1 < lines.length &&
        isSeparatorRow(lines[i + 1])
      ) &&
      !/^[\-\*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      blocks.push(paragraphNode(parseInline(paraLines.join(' '))))
    } else {
      // Safety: force advance to prevent infinite loop on unrecognised lines
      i++
    }
  }

  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: blocks,
    },
  }
}
