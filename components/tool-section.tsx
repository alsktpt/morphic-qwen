'use client'

import * as React from 'react'
import { UseChatHelpers } from '@ai-sdk/react'

import type { ToolPart, UIDataTypes, UIMessage, UITools } from '@/lib/types/ai'

import FetchSection from './fetch-section'
import { QuestionConfirmation } from './question-confirmation'
import { SearchSection } from './search-section'
import { ToolTodoDisplay } from './tool-todo-display'

interface ToolSectionProps {
  tool: ToolPart
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  status?: UseChatHelpers<UIMessage<unknown, UIDataTypes, UITools>>['status']
  addToolResult?: (params: { toolCallId: string; result: any }) => void
  addToolOutput?: (params: { tool: string; toolCallId: string; output: any }) => void
  onQuerySelect: (query: string) => void
  borderless?: boolean
  isFirst?: boolean
  isLast?: boolean
}

export function ToolSection({
  tool,
  isOpen,
  onOpenChange,
  status,
  addToolResult,
  addToolOutput,
  onQuerySelect,
  borderless = false,
  isFirst = false,
  isLast = false
}: ToolSectionProps) {
  // Debug: Log tool rendering with count
  const renderCount = React.useRef(0)
  renderCount.current++

  if (tool.type === 'tool-askQuestion') {
    console.log(`[ToolSection] askQuestion render #${renderCount.current}:`, {
      state: tool.state,
      hasAddToolOutput: !!addToolOutput,
      toolCallId: tool.toolCallId
    })
  }
  // Special handling for ask_question tool
  if (tool.type === 'tool-askQuestion') {
    // When waiting for user input - use addToolOutput for client-side tools
    if (
      (tool.state === 'input-streaming' || tool.state === 'input-available') &&
      addToolOutput
    ) {
      return (
        <QuestionConfirmation
          toolInvocation={tool as ToolPart<'askQuestion'>}
          onConfirm={(toolCallId, approved, response) => {
            addToolOutput({
              tool: 'askQuestion',
              toolCallId,
              output: approved
                ? response
                : {
                    declined: true,
                    skipped: response?.skipped,
                    message: 'User declined this question'
                  }
            })
          }}
        />
      )
    }

    // When result is available, display the result
    if (tool.state === 'output-available') {
      return (
        <QuestionConfirmation
          toolInvocation={tool as ToolPart<'askQuestion'>}
          onConfirm={() => {}} // Not used in result display mode
        />
      )
    }
  }

  switch (tool.type) {
    case 'tool-search':
      return (
        <SearchSection
          tool={tool as ToolPart<'search'>}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          status={status}
          borderless={borderless}
          isFirst={isFirst}
          isLast={isLast}
        />
      )
    case 'tool-fetch':
      return (
        <FetchSection
          tool={tool as ToolPart<'fetch'>}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          status={status}
          borderless={borderless}
          isFirst={isFirst}
          isLast={isLast}
        />
      )
    case 'tool-todoWrite':
      return (
        <ToolTodoDisplay
          tool="todoWrite"
          state={tool.state}
          input={tool.input}
          output={tool.output}
          errorText={tool.errorText}
          toolCallId={tool.toolCallId}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          borderless={borderless}
          isFirst={isFirst}
          isLast={isLast}
        />
      )
    default:
      return null
  }
}
