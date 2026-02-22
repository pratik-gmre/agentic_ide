import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processMessage } from "@/features/conversations/inngest/process-message";
// import { helloWorld } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
 processMessage
  ],
});