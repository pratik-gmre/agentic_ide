import { convexClient } from "@/lib/convex-client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import z from "zod";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export async function POST(request: Request) {
  try {
    const userId = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message } = requestSchema.parse(body);

    const internalKey = process.env.CONVEX_INTERNAL_KEY;
    if (!internalKey) {
      return NextResponse.json(
        { error: "Internal key not found" },
        { status: 500 },
      );
    }

    const conversation = await convexClient.query(
      api.system.getConversationById,
      { internalKey, conversationId: conversationId as Id<"conversations"> }
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const projectId = conversation.projectId;

    await convexClient.mutation(api.system.createMessage, {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
      projectId,
      role: "user",
      content: message,
    });

    const assistantMessageId = await convexClient.mutation(
      api.system.createMessage,
      {
        internalKey,
        conversationId: conversationId as Id<"conversations">,
        projectId,
        role: "assistant",
        content: "",
        status: "processing",
      },
    );

    return NextResponse.json({
      success: true,
      eventId: 0,
      messageId: assistantMessageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
