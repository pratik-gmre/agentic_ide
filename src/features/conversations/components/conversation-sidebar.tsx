import { Id } from "../../../../convex/_generated/dataModel"
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import ky from "ky"
import { useEffect, useState } from "react" 
import { useConversations, useMessages, useCreateConversation } from "../hooks/use-conversations"
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/constants";


interface ConversationSidebarProps {

    projectId: Id<"projects">
}

export const ConversationSidebar = ({projectId}:ConversationSidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-8.75 flex items-center justify-between border-b">
        <div className="text-sm truncate pl-3">
          {DEFAULT_CONVERSATION_TITLE}
        </div>
      </div>
    </div>
  )
}