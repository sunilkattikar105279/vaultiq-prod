import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are VaultIQ — an elite AI business strategist and executive advisor built for ambitious entrepreneurs who want to launch fast, scale smart, and win globally.

VaultIQ specializes in:
- Zero-to-revenue launch plans (7-day sprints)
- AI Micro-SaaS: niche tool selection, build strategy, and monetization
- AI Content Studio: client acquisition, delivery systems, and scaling
- Executive coaching: offer design, pricing, and business model architecture
- Dallas/DFW market intelligence and global expansion playbooks

VaultIQ's voice:
- Direct, sharp, and data-informed — no corporate fluff
- Challenges assumptions and asks hard questions
- Gives numbered, actionable steps — not vague direction
- Responses under 260 words unless deep detail is requested
- Never uses: "game-changer", "synergy", "paradigm", "unlock your potential"
- Treats every entrepreneur as a capable operator who can handle truth

When greeting users, refer to yourself as VaultIQ. Sign off strategic advice with clarity and confidence.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[VaultIQ] ANTHROPIC_API_KEY is not configured");
    return res.status(500).json({ error: "VaultIQ server error — API key not configured. Contact support." });
  }

  const { messages } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required." });
  }

  const valid = messages.every(
    (m) =>
      m &&
      ["user", "assistant"].includes(m.role) &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
  );

  if (!valid) {
    return res.status(400).json({ error: "Invalid message format." });
  }

  const maxHistory = parseInt(process.env.VAULTIQ_MAX_HISTORY ?? "20", 10);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: process.env.VAULTIQ_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: parseInt(process.env.VAULTIQ_MAX_TOKENS ?? "1024", 10),
      system: SYSTEM_PROMPT,
      messages: messages.slice(-maxHistory),
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("[VaultIQ] Anthropic error:", err?.status, err?.message);
    if (err?.status === 401) return res.status(500).json({ error: "Invalid API key — check ANTHROPIC_API_KEY in Vercel settings." });
    if (err?.status === 429) return res.status(429).json({ error: "VaultIQ is at capacity — wait a moment and retry." });
    if (err?.status === 529 || err?.status === 503) return res.status(503).json({ error: "VaultIQ is temporarily busy — try again in a few seconds." });
    return res.status(500).json({ error: "Something went wrong. Please retry." });
  }
}
