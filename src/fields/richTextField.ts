import type { Block, RichTextField } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

const DEFAULT_BLOCKS = [Banner, Code, MediaBlock]

type RichTextFieldOptions = {
  name?: string
  label?: string | false
  required?: boolean
  extraBlocks?: Block[]
  admin?: Record<string, unknown>
}

export const richTextField = (options?: RichTextFieldOptions): RichTextField => {
  const { name = 'content', label, required, extraBlocks, admin } = options ?? {}
  return {
    name,
    type: 'richText',
    ...(label !== undefined && { label }),
    ...(required && { required }),
    ...(admin && { admin }),
    editor: lexicalEditor({
      features: ({ defaultFeatures, rootFeatures }) => [
        ...defaultFeatures,
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        BlocksFeature({ blocks: [...DEFAULT_BLOCKS, ...(extraBlocks ?? [])] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        HorizontalRuleFeature(),
      ],
    }),
  }
}
