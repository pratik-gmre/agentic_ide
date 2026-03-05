import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

interface MessageEvent {
  messageId: Id<"messages">;
}

export const processMessage = inngest.createFunction(
  {
    id: "process-messasge",
    cancelOn: [
      {
        event: "message/cancelled",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;
      const internalKey = process.env.CONVEX_INTERNAL_KEY;
      if (!internalKey) {
        throw new NonRetriableError("No internal key");
      }
      await step.run("update-message-on-failure", async () => {
        await convexClient.mutation(api.system.updateMessageContent, {
          internalKey,
          messageId,
          content:
            "My apologies, I encountered an error while processing your message.Let me know if you need anything else",
        });
      });
    },
  },

  {
    event: "message/sent",
  },
  async ({ event, step }) => {
    const { messageId } = event.data as MessageEvent;

    const internalKey = process.env.CONVEX_INTERNAL_KEY;
    if (!internalKey) {
      throw new NonRetriableError("No internal key");
    }

    await step.sleep("wait-for-ai-processing", "5s");
  

    await step.run("update-assistant-message", async () => {
      await convexClient.mutation(api.system.updateMessageContent, {
        internalKey,
        messageId,
        content: "Ai process this message",
      });
    });
  },
);
