import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an elite AI Executive Coach helping entrepreneurs launch and scale online businesses. You specialize in:
- Online business strategy and 7-day go-live launch plans
- AI Micro-SaaS products: build, validate, and monetize fast
- AI Content Studio: done-for-you content service and client acquisition
- Revenue growth, pricing strategy, and closing first customers
- Dallas/DFW market context and global scaling strategies

Style: direct, tactical, zero fluff. Numbered steps. Under 250 words unless asked for more. No buzzwords.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    return res.status(500).json({ error: "Server configuration error — API key missing." });
  }

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "messages array required." });

  const valid = messages.every(
    (m) => m && ["user","assistant"].includes(m.role) &&
      typeof m.content === "string" && m.content.trim()
  );
  if (!valid) return res.status(400).json({ error: "Invalid message format." });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: process.env.COACH_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: parseInt(process.env.COACH_MAX_TOKENS ?? "1024", 10),
      system: SYSTEM_PROMPT,
      messages: messages.slice(-20),
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Anthropic error:", err?.status, err?.message);
    if (err?.status === 401) return res.status(500).json({ error: "Invalid API key — check ANTHROPIC_API_KEY in Vercel." });
    if (err?.status === 429) return res.status(429).json({ error: "Rate limit — wait and retry." });
    return res.status(500).json({ error: "Something went wrong. Please retry." });
  }
}
