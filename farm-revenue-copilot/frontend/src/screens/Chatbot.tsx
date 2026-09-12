import { useState, useRef, useEffect, useCallback } from "react";
import { C, radius, shadow } from "../tokens";
import { PageHeader } from "../components/ui";
import type { Screen } from "../tokens";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

type Msg = { role: "user" | "bot"; text: string; time: string; error?: boolean };

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Contextual suggestions based on whether the farmer has crops
const SUGGESTIONS_WITH_CROPS = [
  "Should I irrigate today?",
  "How is my crop doing?",
  "Any pest threats I should know about?",
  "When should I harvest?",
  "Which government schemes am I eligible for?",
];

const SUGGESTIONS_NEW_FARMER = [
  "How do I start growing wheat?",
  "What's the best crop for Kharif season?",
  "How do I apply for Kisan Credit Card?",
  "What is soil pH and why does it matter?",
  "How to prevent common crop diseases?",
];

function now() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatText(text: string) {
  // Bold **text** and render line breaks
  return text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
  );
}

export default function Chatbot({ navigate }: { navigate: (s: Screen) => void }) {
  const { farmer } = useAuth();
  const { currentCrop } = useData();
  const isDemoAccount = localStorage.getItem("is_demo_account") === "true";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const farmerName = farmer?.name?.split(" ")[0] || "Farmer";
  const suggestions = currentCrop ? SUGGESTIONS_WITH_CROPS : SUGGESTIONS_NEW_FARMER;

  // Build greeting once on mount
  useEffect(() => {
    const greeting: Msg = {
      role: "bot",
      text: `नमस्ते ${farmerName} जी! 👋 I'm your Agri Advisor — powered by AI and your farm's real data.\n\nAsk me anything about your crops, irrigation, pest management, harvest timing, or government schemes. I'll answer based on your actual farm context.\n\n(मैं Hindi और English दोनों में जवाब दे सकता हूँ!)`,
      time: now(),
    };
    setMessages([greeting]);
  }, [farmerName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;

      const userMsg: Msg = { role: "user", text: text.trim(), time: now() };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setTyping(true);

      try {
        let botText = "";

        if (isDemoAccount) {
          // Demo account: call backend with demo farmer ID
          botText = await callAdvisorAPI("demo-farmer-001", text.trim());
        } else if (farmer?.id) {
          // Real user: call backend with actual farmer ID
          botText = await callAdvisorAPI(farmer.id, text.trim());
        } else {
          botText =
            "Please complete your farm profile first so I can give you personalised advice based on your crops and location.";
        }

        setMessages((m) => [...m, { role: "bot", text: botText, time: now() }]);
      } catch (err) {
        console.error("[Chatbot] API error:", err);
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "माफ़ करें, मैं अभी जवाब नहीं दे पा रहा हूँ। कृपया दोबारा कोशिश करें।\n\nSorry, I couldn't respond right now. Please try again.",
            time: now(),
            error: true,
          },
        ]);
      } finally {
        setTyping(false);
        inputRef.current?.focus();
      }
    },
    [farmer?.id, isDemoAccount, typing]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <PageHeader
        title="Agri Advisor"
        subtitle="AI-powered · Powered by your farm's real data · Gemini"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
              }}
            />
            <span style={{ fontSize: 11, color: C.inkMuted, fontWeight: 600 }}>AI Online</span>
          </div>
        }
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
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: C.sageTint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  border: `1px solid ${C.sage}33`,
                }}
              >
                ◈
              </div>
            )}
            <div style={{ maxWidth: "72%" }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius:
                    msg.role === "user"
                      ? `${radius.xl}px ${radius.xl}px 4px ${radius.xl}px`
                      : `4px ${radius.xl}px ${radius.xl}px ${radius.xl}px`,
                  background: msg.role === "user"
                    ? C.sage
                    : msg.error
                      ? C.rustTint
                      : C.surface,
                  color: msg.role === "user" ? "#fff" : C.ink,
                  fontSize: 14,
                  lineHeight: 1.65,
                  boxShadow: shadow.card,
                  border: msg.role === "bot"
                    ? `1px solid ${msg.error ? C.rust + "33" : C.line}`
                    : "none",
                  whiteSpace: "pre-line",
                }}
              >
                {formatText(msg.text)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.inkMuted,
                  marginTop: 4,
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: C.sageTint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                border: `1px solid ${C.sage}33`,
              }}
            >
              ◈
            </div>
            <div
              style={{
                padding: "14px 18px",
                background: C.surface,
                borderRadius: `4px ${radius.xl}px ${radius.xl}px ${radius.xl}px`,
                border: `1px solid ${C.line}`,
                boxShadow: shadow.card,
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.sageMid,
                    animation: `advisor-bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions — shown until user has sent 2+ messages */}
      {messages.filter((m) => m.role === "user").length < 2 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={typing}
              style={{
                padding: "7px 14px",
                background: C.surface,
                border: `1.5px solid ${C.sage}44`,
                borderRadius: radius.full,
                fontSize: 12,
                color: C.sage,
                fontWeight: 600,
                cursor: typing ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-body)",
                opacity: typing ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!typing)
                  (e.currentTarget as HTMLElement).style.background = C.sageTint;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = C.surface;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="Ask about your crop, irrigation, schemes, pests…"
          disabled={typing}
          style={{
            flex: 1,
            padding: "13px 18px",
            border: `1.5px solid ${C.line}`,
            borderRadius: radius.full,
            fontSize: 14,
            color: C.ink,
            background: typing ? "#f8f8f6" : C.surface,
            outline: "none",
            fontFamily: "var(--font-body)",
            boxShadow: shadow.card,
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.sage)}
          onBlur={(e) =>  ((e.target as HTMLInputElement).style.borderColor = C.line)}
        />
        <button
          onClick={() => send(input)}
          disabled={typing || !input.trim()}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: typing || !input.trim() ? C.inkMuted : C.sage,
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: typing || !input.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: typing ? "none" : "0 4px 14px rgba(92,122,94,0.35)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!typing && input.trim())
              (e.currentTarget as HTMLElement).style.background = C.sageDeep;
          }}
          onMouseLeave={(e) => {
            if (!typing && input.trim())
              (e.currentTarget as HTMLElement).style.background = C.sage;
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes advisor-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

// ── API helper ────────────────────────────────────────────────────────────────

async function callAdvisorAPI(farmerId: string, message: string): Promise<string> {
  const res = await fetch(`${API_BASE}/advisor/${encodeURIComponent(farmerId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Advisor API error ${res.status}`);
  }

  const data = await res.json();
  return data.response as string;
}
