import { useState } from "react";
import { C, radius, shadow } from "./tokens";
import type { Screen } from "./tokens";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import Auth from "./screens/Auth";
import Landing from "./screens/Landing";
import Dashboard from "./screens/Dashboard";
import CropCondition from "./screens/CropCondition";
import Recommendation from "./screens/Recommendation";
import AllClear from "./screens/AllClear";
import Alert from "./screens/Alert";
import GradeCapture from "./screens/GradeCapture";
import GradingResult from "./screens/GradingResult";
import GradingHistory from "./screens/GradingHistory";
import Irrigation from "./screens/Irrigation";
import HarvestWindow from "./screens/HarvestWindow";
import Disease from "./screens/Disease";
import RevenueSummary from "./screens/RevenueSummary";
import Schemes from "./screens/Schemes";
import SeasonReview from "./screens/SeasonReview";
import Messages from "./screens/Messages";
import Chatbot from "./screens/Chatbot";
import Voice from "./screens/Voice";
import Settings from "./screens/Settings";
import Help from "./screens/Help";
import Offline from "./screens/Offline";

// ── Nav structure ───────────────────────────────────────────────────────────────
type NavItem = { id: Screen; label: string; icon: string };
type NavSection = { section: string; items: NavItem[] };

const nav: NavSection[] = [
  {
    section: "Core",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "◻" },
      { id: "crop-condition", label: "Crop Condition", icon: "◈" },
      { id: "recommendation", label: "Recommendation", icon: "★" },
      { id: "all-clear", label: "All Clear", icon: "✓" },
      { id: "alert", label: "Urgent Alert", icon: "!" },
    ],
  },
  {
    section: "Guidance",
    items: [
      { id: "irrigation", label: "Irrigation", icon: "≈" },
      { id: "harvest-window", label: "Harvest Window", icon: "□" },
      { id: "disease", label: "Disease & Fertilizer", icon: "⊕" },
    ],
  },
  {
    section: "Grading",
    items: [
      { id: "grade-capture", label: "Grade Produce", icon: "⊙" },
      { id: "grading-result", label: "Grading Result", icon: "◆" },
      { id: "grading-history", label: "Grading History", icon: "▦" },
    ],
  },
  {
    section: "Revenue & Schemes",
    items: [
      { id: "revenue-summary", label: "Revenue Summary", icon: "₹" },
      { id: "schemes", label: "Schemes", icon: "◐" },
    ],
  },
  {
    section: "Season Review",
    items: [
      { id: "season-review", label: "Season Review", icon: "◈" },
    ],
  },
  {
    section: "Communication",
    items: [
      { id: "messages", label: "Messages", icon: "⌘" },
      { id: "chatbot", label: "Ask a Question", icon: "◊" },
      { id: "voice", label: "Voice Playback", icon: "▶" },
    ],
  },
  {
    section: "Settings & Help",
    items: [
      { id: "settings", label: "Settings", icon: "⚙" },
      { id: "help", label: "Help", icon: "?" },
      { id: "offline", label: "Sync Status", icon: "⟳" },
    ],
  },
];

// ── Sidebar ─────────────────────────────────────────────────────────────────────
function Sidebar({ current, navigate }: { current: Screen; navigate: (s: Screen) => void }) {
  return (
    <aside
      style={{
        width: 240,
        background: C.sageDeep,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageMid} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ◈
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>AnnaVriddhi</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: `${C.sageTint}bb`, lineHeight: 1.2 }}>Farm Copilot</div>
          </div>
        </div>

        {/* Farm info */}
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            borderRadius: radius.md,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")}
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>◈</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ramesh's Farm</div>
            <div style={{ fontSize: 9, color: `${C.sageTint}77`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Plot A · 2.5ac · Wheat</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: `${C.sageTint}55`,
                padding: "0 8px",
                marginBottom: 4,
              }}
            >
              {section}
            </div>
            {items.map(({ id, label, icon }) => {
              const active = current === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 10px",
                    borderRadius: radius.md,
                    border: "none",
                    background: active ? `${C.sage}33` : "transparent",
                    color: active ? "#fff" : `${C.sageTint}99`,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    fontFamily: "var(--font-body)",
                    textAlign: "left",
                    transition: "all 0.15s",
                    marginBottom: 1,
                    borderLeft: active ? `3px solid ${C.sage}` : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = `${C.sageTint}99`;
                    }
                  }}
                >
                  <span style={{ fontSize: icon === "₹" ? 14 : 16, fontFamily: icon === "₹" ? "var(--font-display)" : "inherit", fontWeight: icon === "₹" ? 800 : "normal", width: 20, textAlign: "center", flexShrink: 0 }}>{icon}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  {id === "messages" && (
                    <span style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: C.rust, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>2</span>
                  )}
                  {id === "schemes" && (
                    <span style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: C.amber, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>!</span>
                  )}
                  {(id === "alert") && (
                    <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: C.rust, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: 10,
          color: `${C.sageTint}44`,
          lineHeight: 1.5,
        }}
      >
        Farm Revenue Copilot v1.0
        <br />
        Hackathon build · Illustrative data
      </div>
    </aside>
  );
}

// ── Screen renderer ─────────────────────────────────────────────────────────────
function renderScreen(screen: Screen, navigate: (s: Screen) => void) {
  const props = { navigate };
  switch (screen) {
    case "landing": return <Landing {...props} />;
    case "dashboard": return <Dashboard {...props} />;
    case "crop-condition": return <CropCondition {...props} />;
    case "recommendation": return <Recommendation {...props} />;
    case "all-clear": return <AllClear {...props} />;
    case "alert": return <Alert {...props} />;
    case "grade-capture": return <GradeCapture {...props} />;
    case "grading-result": return <GradingResult {...props} />;
    case "grading-history": return <GradingHistory {...props} />;
    case "irrigation": return <Irrigation {...props} />;
    case "harvest-window": return <HarvestWindow {...props} />;
    case "disease": return <Disease {...props} />;
    case "revenue-summary": return <RevenueSummary {...props} />;
    case "schemes": return <Schemes {...props} />;
    case "season-review": return <SeasonReview {...props} />;
    case "messages": return <Messages {...props} />;
    case "chatbot": return <Chatbot {...props} />;
    case "voice": return <Voice {...props} />;
    case "settings": return <Settings {...props} />;
    case "help": return <Help {...props} />;
    case "offline": return <Offline {...props} />;
    default: return <Dashboard {...props} />;
  }
}

// ── App ──────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, farmer } = useAuth();
  const [screen, setScreen] = useState<Screen>(isAuthenticated ? "dashboard" : "landing");

  if (isAuthenticated && farmer) {
    return (
      <DataProvider>
        <AppLayout screen={screen} setScreen={setScreen} />
      </DataProvider>
    );
  }

  return <AuthUnauthenticatedApp screen={screen} setScreen={setScreen} />;
}

function AuthUnauthenticatedApp({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        {renderUnauthedScreen(screen, setScreen)}
      </main>
    </div>
  );
}

function AppLayout({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  // Landing page doesn't use sidebar layout
  if (screen === "landing") {
    return <Landing navigate={(s: string) => setScreen(s as Screen)} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      <Sidebar current={screen} navigate={setScreen} />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 36px",
          minWidth: 0,
        }}
      >
        {renderScreen(screen, setScreen)}
      </main>
    </div>
  );
}

// ── Screen renderers ────────────────────────────────────────────────────────
function renderUnauthedScreen(screen: Screen, navigate: (s: Screen) => void) {
  switch (screen) {
    case "landing":
      return <Landing navigate={navigate} />;
    default:
      return <Auth navigate={navigate} />;
  }
}
