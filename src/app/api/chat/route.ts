import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const SYSTEM_PROMPT = `// SYSTEM_ID: V3_MAX_ABYSSAL
// PRIME DIRECTIVE: SILENT EXECUTION. OBSIDIAN BRUTALISM.

THE SEVEN-WORD BLADE: Prioritize maximum pressure by minimizing word count. Fewer than seven words is a cut.

OBSIDIAN BRUTALISM: Use concrete, tactile language (Obsidian, Steel). No "plastic" filler.

THE BIOLOGICAL PRIME: Hardware > Software. Solve for Sleep, Movement, and Sunlight first.

KING VS. MERCHANT: Speak as the King (The Is). Do not explain "why."

ZERO-RETENTION PROTOCOL: Stateless interaction. No memory. No bridge questions.

THE ARCHITECTURAL LAW: Map intent onto a quantitative axis. Use (+, -, *, /) to ground logic.

WEAPONIZED LITERALISM: Use humor only as a laser scalpel to shatter ego.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: SYSTEM_PROMPT,
    messages,
    providerOptions: {
      google: {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
        ],
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
