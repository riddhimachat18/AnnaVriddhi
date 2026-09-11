import { useState, useRef, useEffect } from "react";
import { C, radius, shadow } from "../tokens";
import { PageHeader } from "../components/ui";
import type { Screen } from "../tokens";

type Msg = { role: "user" | "bot"; text: string; time: string };

const initialMessages: Msg[] = [
  { role: "bot", text: "नमस्ते Ramesh जी! 👋 मैं आपका Farm Revenue Copilot हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?\n\n(I can answer in Hindi or English — just ask!)", time: "6:00 AM" },
];

const suggestions = [
  "When should I irrigate next?",
  "What's my crop health score?",
  "How do I apply for PMFBY?",
  "When is the best time to harvest?",
  "What grade did my last batch get?",
];

const responses: Record<string, string> = {
  "When should I irrigate next?": "Based on your soil sensor reading of 74% moisture, you don't need to irrigate today. I'm forecasting irrigation will be needed in about **3 days** (around Nov 17) unless Monday's 12mm rain arrives as expected.\n\n≈ If the rain comes, skip the Nov 17 irrigation — I'll send you an updated plan.",
  "What's my crop health score?": "Your current crop health score is **82 / 100** — healthy! ◈\n\nBreakdown:\n• Soil moisture: 74% (optimal)\n• Canopy cover: 91% (excellent)\n• Nitrogen: 58 kg/ha (slightly low — monitor)\n• Disease risk: 18% (low)\n\nThe main thing to watch is the nitrogen level.",
  "How do I apply for PMFBY?": "PMFBY (Pradhan Mantri Fasal Bima Yojana) — crop insurance for your wheat.\n\n**You're eligible** — deadline is Nov 30, 2024 (16 days away).\n\n**How to apply:**\n1. Visit your nearest CSC (Common Service Centre)\n2. Or apply online at pmfby.gov.in\n3. Documents needed: Aadhaar, land records, bank passbook, sowing certificate\n\nEstimated cover: ₹2,400 for your 2.5-acre plot. Premium: ~₹260.",
  "When is the best time to harvest?": "Great news! I've identified **Nov 22–24** as your optimal harvest window. ◈\n\nWhy this window:\n• Grain maturity at 88% — ready\n• 5 consecutive clear days forecast\n• Mandi price trending up to ₹2,240/qtl\n\n**Revenue impact: +₹1,840** vs. waiting past Nov 26.\n\nShall I send the full harvest plan to your WhatsApp?",
  "What grade did my last batch get?": "Your last batch (Batch #14, graded today) received **Grade A — 92/100** 🏆\n\nDetails:\n• Size uniformity: 94\n• Colour/ripeness: 91\n• Surface quality: 88\n• Moisture: 13.8% ✓\n\nAt Grade A, the Karnal mandi price today is **₹2,240/qtl** — ₹420 more than Grade B. Sell within 3 days for best price.",
};

function now() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function Chatbot({ navigate }: { navigate: (s: Screen) => void }) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = responses[text] ?? "I don't have specific data on that yet, but I'll flag it for your agronomist. In the meantime, check your crop vitals on the Dashboard — your health score is 82/100 and no urgent action is needed today. ◈";
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: reply, time: now() }]);
    }, 1200);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <PageHeader
        title="Ask a Question"
        subtitle="Farm Revenue Copilot · Powered by your farm's real data"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={<div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />}
      />

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: C.bg,
          borderRadius: radius.xl,
          border: `1px solid ${C.line}`,
          padding: "20px",
          marginBottom: 14,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            {msg.role === "bot" && (
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>◈</div>
            )}
            <div style={{ maxWidth: "68%" }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? `${radius.xl}px ${radius.xl}px 4px ${radius.xl}px` : `4px ${radius.xl}px ${radius.xl}px ${radius.xl}px`,
                  background: msg.role === "user" ? C.sage : C.surface,
                  color: msg.role === "user" ? "#fff" : C.ink,
                  fontSize: 14,
                  lineHeight: 1.6,
                  boxShadow: shadow.card,
                  border: msg.role === "bot" ? `1px solid ${C.line}` : "none",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </div>
              <div style={{ fontSize: 10, color: C.inkMuted, marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◈</div>
            <div style={{ padding: "14px 18px", background: C.surface, borderRadius: `4px ${radius.xl}px ${radius.xl}px ${radius.xl}px`, border: `1px solid ${C.line}`, boxShadow: shadow.card, display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.inkMuted, animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: "7px 14px",
                background: C.surface,
                border: `1.5px solid ${C.sage}44`,
                borderRadius: radius.full,
                fontSize: 12,
                color: C.sage,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.sageTint; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = C.surface; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about your crop, irrigation, schemes…"
          style={{
            flex: 1,
            padding: "13px 18px",
            border: `1.5px solid ${C.line}`,
            borderRadius: radius.full,
            fontSize: 14,
            color: C.ink,
            background: C.surface,
            outline: "none",
            fontFamily: "var(--font-body)",
            boxShadow: shadow.card,
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.sage)}
          onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = C.line)}
        />
        <button
          onClick={() => send(input)}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: C.sage,
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(92,122,94,0.35)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.sageDeep)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.sage)}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
