import { Id } from "../../../../convex/_generated/dataModel";
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
  PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import ky from "ky";
import { useEffect, useState } from "react";
import {
  useConversations,
  useMessages,
  useCreateConversation,
  useConversation,
} from "../hooks/use-conversations";
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/constants";
import { Button } from "@/components/ui/button";
import { CopyIcon, HistoryIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
}

export const ConversationSidebar = ({
  projectId,
}: ConversationSidebarProps) => {
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);

  const [input, setInput] = useState("");
  const createConversation = useCreateConversation();

  const conversations = useConversations(projectId);

  const activeConversationId =
    selectedConversationId ?? conversations?.[0]?._id ?? null;
  const activeConversation = useConversation(activeConversationId);

  const conversationMessages = useMessages(activeConversationId);
  const isProcessing = conversationMessages?.some(
    (msg) => msg.status === "processing",
  );

  const handleCreateConversation = async () => {
    try {
      const newconversationId = await createConversation({
        projectId,
        title: DEFAULT_CONVERSATION_TITLE,
      });
      setSelectedConversationId(newconversationId);
      return newconversationId;
    } catch (error) {
      toast.error("Unable to create new conversation");
      return null;
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    try {
      if (isProcessing && !message.text) {
        // await handleCancel()
        setInput("");
        return;
      }

      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = await handleCreateConversation();
        if (!conversationId) {
          return;
        }
      }
      try {
        await ky.post("/api/messages", {
          json: {
            conversationId,
            message: message.text,
          },
        });
      } catch (error) {
        toast.error("Failed to sent message");

      }
    } catch (error) {
      toast.error("Unable to create new conversation");

    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-8.75 flex items-center justify-between border-b">
        <div className="text-sm truncate pl-3">
          {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
        </div>
        <div className="flex items-center px-1 gap-1">
          <Button size={"icon-xs"} variant={"highlight"}>
            <HistoryIcon className="size-3.5" />
          </Button>
          <Button
            size={"icon-xs"}
            variant={"highlight"}
            onClick={handleCreateConversation}
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
      </div>
      <Conversation className="flex-1">
        <ConversationContent>
          {conversationMessages?.map((message, messageIndex) => (
            <Message key={message._id} from={message.role}>
              <MessageContent>
                {" "}
                {message.status === "processing" ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderIcon className="size-4 animate-spin" />
                    <span>Thinking..</span>
                  </div>
                ) : (
                  <MessageResponse>{message.content}</MessageResponse>
                )}{" "}
              </MessageContent>
              {message.role === "assistant" &&
                message.status === "completed" &&
                messageIndex === (conversationMessages?.length ?? 0) - 1 && (
                  <MessageActions>
                    <MessageAction
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                      }}
                    >
                      <CopyIcon className="size-3" />
                    </MessageAction>
                  </MessageActions>
                )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="p-3">
        <PromptInput onSubmit={handleSubmit} className="mt-2 rounded-full">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask me anything.."
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              disabled={isProcessing}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              disabled={isProcessing ? false : !input}
              status={isProcessing ? "streaming" : undefined}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
