import { C, radius, shadow } from "../tokens";
import { Card, PageHeader, Badge, Btn, IconBadge } from "../components/ui";
import type { Screen } from "../tokens";

function GradeBadge({ grade, size = 140 }: { grade: "A" | "B" | "C"; size?: number }) {
  const configs = {
    A: { color: C.sage, bg: C.sageTint, shadow: `${C.sage}30`, label: "Premium" },
    B: { color: C.amber, bg: C.amberTint, shadow: `${C.amber}30`, label: "Standard" },
    C: { color: C.rust, bg: C.rustTint, shadow: `${C.rust}30`, label: "Below grade" },
  };
  const c = configs[grade];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${c.bg}, ${c.bg}88)`,
        border: `3px solid ${c.color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 8px 32px ${c.shadow}, 0 0 0 6px ${c.color}18`,
        flexShrink: 0,
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontSize: size * 0.48, fontWeight: 800, color: c.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{grade}</div>
      <div style={{ fontSize: size * 0.12, fontWeight: 700, color: c.color, marginTop: 2, letterSpacing: "0.04em", textTransform: "uppercase" }}>{c.label}</div>
    </div>
  );
}

export default function GradingResult({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div>
      <PageHeader
        title="Grading Result"
        subtitle="Batch #14 · Wheat · 14 Nov 2024"
        back="Grade Produce"
        onBack={() => navigate("grade-capture")}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={() => navigate("grading-history")}>View history</Btn>
            <Btn variant="primary">⊞ Share result</Btn>
          </div>
        }
      />

      {/* Hero result */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, marginBottom: 20, alignItems: "stretch" }}>
        <Card
          hover={false}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 40px",
            background: `linear-gradient(135deg, ${C.sageTint} 0%, #d4e8d6 100%)`,
            border: `1px solid ${C.sage}33`,
            gap: 20,
          }}
        >
          <GradeBadge grade="A" size={160} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.03em" }}>92 / 100</div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 4 }}>Quality score</div>
          </div>
        </Card>

        <Card hover={false} style={{ padding: "28px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 20 }}>Quality signal breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "▭", label: "Grain size uniformity", score: 94, color: C.sage, detail: "Very consistent sizing — <5% variance" },
              { icon: "🎨", label: "Colour & ripeness", score: 91, color: C.sage, detail: "Golden yellow — optimal ripeness index" },
              { icon: "🔍", label: "Surface quality", score: 88, color: C.sage, detail: "Minimal blemishes — 2.3% defect area" },
              { icon: "≈", label: "Moisture est.", score: 96, color: C.sage, detail: "13.8% — within FAO spec of ≤14%" },
            ].map(({ icon, label, score, color, detail }) => (
              <div key={label}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{label}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color }}>{score}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 1 }}>{detail}</div>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: C.line, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Price impact & market */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.inkMuted, fontWeight: 700, marginBottom: 8 }}>Market price — Grade A</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.03em" }}>₹2,240</div>
          <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>per quintal · Karnal Mandi today</div>
          <Badge color={C.sage} bg={C.sageTint} size="sm">↑ ₹80 from last week</Badge>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.inkMuted, fontWeight: 700, marginBottom: 8 }}>Vs. Grade B price</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: C.sage, letterSpacing: "-0.03em" }}>+₹420</div>
          <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>extra per quintal for Grade A</div>
          <Badge color={C.sage} bg={C.sageTint} size="sm">For your ~12 qtl batch</Badge>
        </Card>
        <Card style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.inkMuted, fontWeight: 700, marginBottom: 8 }}>Batch revenue est.</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.03em" }}>₹26,880</div>
          <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>for 12 quintals at Grade A rate</div>
          <Badge color={C.amber} bg={C.amberTint} size="sm">Sell within 3 days for best price</Badge>
        </Card>
      </div>

      {/* Improvement tips */}
      <Card hover={false} style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 16 }}>How to improve further next season</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: "⊕", title: "Address nitrogen gap", detail: "N at 58 kg/ha limited grain weight. +20% urea at tillering could push score to 96+." },
            { icon: "≈", title: "Time irrigation better", detail: "Late-season irrigation 10 days before harvest reduces grain shrivelling by est. 4–6%." },
            { icon: "◈", title: "Harvest timing", detail: "This batch was 1 day early — grain moisture still at 13.8%. Waiting 1 more day could +1–2 pts." },
          ].map(({ icon, title, detail }) => (
            <div key={title} style={{ background: C.bg, borderRadius: radius.md, padding: "16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.55 }}>{detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
