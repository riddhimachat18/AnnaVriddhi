import { useState } from "react";
import { C, radius, shadow } from "../tokens";
import { PageHeader, Btn, Badge } from "../components/ui";
import type { Screen } from "../tokens";

export default function GradeCapture({ navigate }: { navigate: (s: Screen) => void }) {
  const [captured, setCaptured] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  function handleCapture() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      navigate("grading-result");
    }, 2000);
  }

  return (
    <div>
      <PageHeader
        title="Grade Produce"
        subtitle="Photograph your batch for instant quality grading"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={<Badge color={C.blue} bg={C.blueTint}>AI-powered · RGB analysis</Badge>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        {/* Camera viewfinder */}
        <div
          style={{
            background: "#0d1117",
            borderRadius: radius.xxl,
            overflow: "hidden",
            position: "relative",
            aspectRatio: "16/10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadow.lg,
          }}
        >
          {/* Simulated camera feed — wheat image */}
          <img
            src="https://images.unsplash.com/photo-1630873711080-aa3097d1da66?w=900&h=560&fit=crop&auto=format"
            alt="Camera view of wheat produce"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />

          {/* Guide frame overlay */}
          <div
            style={{
              position: "absolute",
              inset: "12%",
              border: "2px solid rgba(255,255,255,0.6)",
              borderRadius: radius.xl,
            }}
          >
            {/* Corner brackets */}
            {[
              { top: -2, left: -2, borderTop: "3px solid #fff", borderLeft: "3px solid #fff" },
              { top: -2, right: -2, borderTop: "3px solid #fff", borderRight: "3px solid #fff" },
              { bottom: -2, left: -2, borderBottom: "3px solid #fff", borderLeft: "3px solid #fff" },
              { bottom: -2, right: -2, borderBottom: "3px solid #fff", borderRight: "3px solid #fff" },
            ].map((style, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  ...style,
                }}
              />
            ))}
          </div>

          {/* Top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "16px 20px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>LIVE</span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Wheat · Batch #14</span>
          </div>

          {/* AI overlay when analyzing */}
          {analyzing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(13,17,23,0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{ width: 60, height: 60, border: `3px solid ${C.sage}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Analysing produce…</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Checking size · colour · surface quality</div>
            </div>
          )}

          {/* Guide text */}
          {!analyzing && (
            <div
              style={{
                position: "absolute",
                bottom: 80,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: radius.full,
                backdropFilter: "blur(4px)",
                whiteSpace: "nowrap",
              }}
            >
              Place produce within the frame
            </div>
          )}

          {/* Shutter button */}
          <button
            onClick={handleCapture}
            disabled={analyzing}
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#fff",
              border: "4px solid rgba(255,255,255,0.4)",
              cursor: analyzing ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              opacity: analyzing ? 0.5 : 1,
            }}
            onMouseEnter={(e) => !analyzing && ((e.currentTarget as HTMLElement).style.transform = "translateX(-50%) scale(1.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(-50%)")}
          >
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: analyzing ? C.inkMuted : C.sage }} />
          </button>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: C.surface,
              borderRadius: radius.xl,
              padding: "20px",
              border: `1px solid ${C.line}`,
              boxShadow: shadow.card,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 14 }}>Batch details</div>
            {[
              { label: "Crop", value: "Wheat" },
              { label: "Variety", value: "HD-3226" },
              { label: "Harvest date", value: "Today, Nov 14" },
              { label: "Est. quantity", value: "~120 kg" },
              { label: "Destination", value: "Karnal Mandi" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <span style={{ color: C.inkMuted }}>{label}</span>
                <span style={{ color: C.ink, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: C.sageTint,
              borderRadius: radius.xl,
              padding: "16px 18px",
              border: `1px solid ${C.sage}22`,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 8 }}>What we check</div>
            {[
              { icon: "▭", label: "Grain size & shape uniformity" },
              { icon: "🎨", label: "Colour consistency & ripeness" },
              { icon: "🔍", label: "Surface blemishes & foreign matter" },
              { icon: "≈", label: "Moisture content estimate" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, fontSize: 12, color: C.inkMuted }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>

          <Btn variant="secondary" fullWidth onClick={() => navigate("grading-history")}>
            ▦ View grading history
          </Btn>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
