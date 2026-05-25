import { useState, useRef, useEffect } from "react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const BRAND = {
  name:     "VaultIQ",
  tagline:  "Your AI Business Strategist",
  sub:      "Launch fast · Scale smart · Win globally",
  initials: "VQ",
  // Indigo-to-violet primary, warm neutrals
  primary:   "#4F46E5",   // indigo-600
  primaryHov:"#4338CA",   // indigo-700
  primaryMut:"#C7D2FE",   // indigo-200
  aiAvBg:    "#EEF2FF",   // indigo-50
  aiAvClr:   "#4338CA",   // indigo-700
  usrAvBg:   "#FDF4FF",   // purple-50
  usrAvClr:  "#7E22CE",   // purple-800
  bg:        "#F9F8FF",   // near-white with indigo tint
  surface:   "#FFFFFF",
  border:    "#E5E7EB",
  borderSub: "#F3F4F6",
  textPri:   "#111827",
  textSec:   "#6B7280",
  textTer:   "#9CA3AF",
  msgUser:   "#F5F3FF",   // violet-50
  accent:    "#4F46E5",
};

const QUICK_PROMPTS = [
  "Which business should I launch first as a Dallas entrepreneur?",
  "Give me my exact next 3 moves to make money this week.",
  "Write my LinkedIn launch post for VaultIQ.",
  "How do I land my first AI Content Studio client today?",
  "What's the best niche for my AI Micro-SaaS?",
  "Build me a 7-day revenue sprint plan.",
];

const INITIAL = {
  role: "assistant",
  content:
    "Hey — I'm VaultIQ, your AI business strategist.\n\nI'm built for entrepreneurs who move fast. You've got three businesses in motion — an Executive Coach platform, an AI Micro-SaaS, and an AI Content Studio — and a 7-day window to first revenue.\n\nLet's not waste time. What's the first thing you want to crack?",
};

export default function Home() {
  const [messages, setMessages] = useState([INITIAL]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res  = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages(messages);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  const canSend = input.trim().length > 0 && !loading;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
          background: ${BRAND.bg};
          color: ${BRAND.textPri};
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 2px; }

        /* Typing animation */
        @keyframes blink {
          0%, 80%, 100% { opacity: .2; transform: scale(.75); }
          40%           { opacity: 1;  transform: scale(1);   }
        }
        .viq-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${BRAND.textTer};
          animation: blink 1.3s infinite;
        }
        .viq-dot:nth-child(2) { animation-delay: .2s; }
        .viq-dot:nth-child(3) { animation-delay: .4s; }

        /* Prompt chips */
        .viq-chip {
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid ${BRAND.border};
          background: ${BRAND.surface};
          cursor: pointer;
          color: ${BRAND.textSec};
          white-space: nowrap;
          transition: all .15s;
          font-weight: 500;
        }
        .viq-chip:hover:not(:disabled) {
          background: ${BRAND.aiAvBg};
          border-color: ${BRAND.primaryMut};
          color: ${BRAND.primary};
        }
        .viq-chip:disabled { opacity: .45; cursor: not-allowed; }

        /* Send button */
        .viq-send {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: none;
          background: ${BRAND.primary};
          color: #fff;
          font-size: 17px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: background .15s;
        }
        .viq-send:disabled { background: ${BRAND.primaryMut}; cursor: not-allowed; }
        .viq-send:not(:disabled):hover { background: ${BRAND.primaryHov}; }

        /* Textarea */
        textarea { font-family: inherit; }
        textarea:focus { outline: none; border-color: ${BRAND.primary} !important; box-shadow: 0 0 0 2px ${BRAND.primaryMut}; }

        /* Logo mark gradient */
        .viq-logomark {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, ${BRAND.primary} 0%, #7C3AED 100%);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800;
          letter-spacing: -.5px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(79,70,229,.35);
        }

        /* Pulse on live dot */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .4; }
        }
        .viq-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* ── Page ── */}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>

        {/* ── Shell ── */}
        <div style={{ width: "100%", maxWidth: 720, height: "90vh", display: "flex", flexDirection: "column", background: BRAND.surface, borderRadius: 20, border: `1px solid ${BRAND.border}`, overflow: "hidden", boxShadow: "0 8px 40px rgba(79,70,229,.10), 0 2px 8px rgba(0,0,0,.06)" }}>

          {/* ── Header ── */}
          <header style={{ padding: "14px 20px", borderBottom: `1px solid ${BRAND.borderSub}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: BRAND.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="viq-logomark">VQ</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.textPri, letterSpacing: "-.3px" }}>
                  {BRAND.name}
                </div>
                <div style={{ fontSize: 11, color: BRAND.textSec, marginTop: 1, fontWeight: 500 }}>
                  {BRAND.sub}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: BRAND.textSec, padding: "5px 12px", borderRadius: 20, border: `1px solid ${BRAND.border}`, background: BRAND.bg, fontWeight: 500 }}>
              <div className="viq-live-dot" />
              Active
            </div>
          </header>

          {/* ── Messages ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 18 }}>

            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>

                  {/* Avatar */}
                  {isUser ? (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, marginTop: 2, background: BRAND.usrAvBg, color: BRAND.usrAvClr }}>You</div>
                  ) : (
                    <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, marginTop: 2, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff", letterSpacing: "-.3px" }}>VQ</div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: "76%",
                    padding: "11px 15px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 13.5,
                    lineHeight: 1.72,
                    background: isUser ? BRAND.msgUser : BRAND.surface,
                    border: `1px solid ${isUser ? "#DDD6FE" : BRAND.border}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: BRAND.textPri,
                    boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,.04)",
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff" }}>VQ</div>
                <div style={{ padding: "13px 16px", borderRadius: "16px 16px 16px 4px", border: `1px solid ${BRAND.border}`, background: BRAND.surface, display: "flex", gap: 5, alignItems: "center" }}>
                  <span className="viq-dot" /><span className="viq-dot" /><span className="viq-dot" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, fontSize: 12, color: "#991B1B", display: "flex", alignItems: "center", gap: 10 }}>
                <span>⚠ {error}</span>
                <button
                  onClick={() => { setError(null); sendMessage(messages[messages.length - 1]?.content); }}
                  style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 6, border: "1px solid #FECACA", background: "#fff", color: "#991B1B", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>
                  Retry
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Quick prompts ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px", borderTop: `1px solid ${BRAND.borderSub}`, background: BRAND.bg }}>
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} className="viq-chip" disabled={loading} onClick={() => sendMessage(q)}>
                {q.length > 46 ? q.slice(0, 46) + "…" : q}
              </button>
            ))}
          </div>

          {/* ── Input ── */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${BRAND.border}`, display: "flex", gap: 8, alignItems: "flex-end", background: BRAND.surface }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(e); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask VaultIQ anything…"
              rows={1}
              disabled={loading}
              style={{
                flex: 1,
                resize: "none",
                border: `1px solid ${BRAND.border}`,
                borderRadius: 11,
                padding: "9px 13px",
                fontSize: 13.5,
                background: BRAND.bg,
                color: BRAND.textPri,
                lineHeight: 1.55,
                minHeight: 40,
                maxHeight: 120,
                transition: "border-color .15s, box-shadow .15s",
              }}
            />
            <button className="viq-send" onClick={() => sendMessage()} disabled={!canSend} aria-label="Send to VaultIQ">
              ↑
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
