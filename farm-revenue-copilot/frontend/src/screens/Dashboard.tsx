import { C, shadow, radius } from "../tokens";
import { Card, GaugeBar, IconBadge, Badge, StatTile, SectionLabel, Btn } from "../components/ui";
import type { Screen } from "../tokens";

export default function Dashboard({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div>
      {/* Top header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: C.sageDeep, letterSpacing: "-0.02em" }}>
              AnnaVriddhi
            </div>
            <Badge color={C.sage} bg={C.sageTint}>Kharif 2024</Badge>
          </div>
          <div style={{ fontSize: 12, color: C.inkMuted }}>Ramesh's Farm · Plot A · 2.5 acres · Wheat</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: C.inkMuted }}>Thu, 14 Nov 2024</div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("messages")}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.surface, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: shadow.sm }}>⌘</div>
            <div style={{ position: "absolute", top: -3, right: -3, width: 18, height: 18, borderRadius: 999, background: C.rust, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          </div>
        </div>
      </div>

      {/* Status hero card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.sageTint} 0%, #d4e8d6 100%)`,
          borderRadius: radius.xxl,
          padding: "28px 32px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 24,
          border: `1px solid ${C.sage}33`,
          boxShadow: `0 4px 24px ${C.sage}18`,
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => navigate("all-clear")}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "none")}
      >
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, borderRadius: "50%", background: `${C.sage}12` }} />
        <div style={{ fontSize: 52 }}>✓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: C.sageDeep, letterSpacing: "-0.02em", marginBottom: 4 }}>
            All clear today — crop is healthy
          </div>
          <div style={{ fontSize: 13, color: C.inkMuted }}>
            Crop health score: <strong style={{ color: C.sageDeep }}>82 / 100</strong> · Last updated 2h ago
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.inkMuted, marginBottom: 4 }}>No action needed</div>
          <Badge color={C.sage} bg={`${C.sage}22`} size="lg">Doing nothing saves ₹420</Badge>
        </div>
      </div>

      {/* Stat tiles row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <StatTile icon="≈" iconBg={C.blueTint} label="Soil Moisture" value="74%" sub="Optimal range 65–80%" color={C.blue} />
        <StatTile icon="▲" iconBg={C.amberTint} label="Temperature" value="26°C" sub="Feels like 28°C" color={C.amber} />
        <StatTile icon="◈" iconBg={C.sageTint} label="Rain forecast" value="None" sub="Next 5 days clear" color={C.sage} />
        <StatTile icon="⊕" iconBg={C.sageTint} label="Disease risk" value="Low" sub="No anomaly detected" color={C.sageDeep} />
      </div>

      {/* Main content: gauges + recommendation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>
        {/* Gauges */}
        <Card style={{ padding: "24px 28px" }} hover={false}>
          <SectionLabel>Crop vitals — 7 day trend</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Soil moisture", value: 74, color: C.blue, icon: "≈", trend: "+3% from yesterday" },
              { label: "Crop health index", value: 82, color: C.sage, icon: "◈", trend: "Stable" },
              { label: "Nitrogen level (N)", value: 58, color: C.amber, icon: "⊕", trend: "Below optimal — monitor" },
              { label: "Disease probability", value: 18, color: C.rust, icon: "!", trend: "Low risk" },
              { label: "Canopy cover", value: 91, color: C.sageDeep, icon: "○", trend: "On track for stage" },
            ].map(({ label, value, color, icon, trend }) => (
              <div key={label}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{label}</span>
                  <span style={{ fontSize: 10, color: C.inkMuted, marginLeft: "auto" }}>{trend}</span>
                </div>
                <GaugeBar value={value} label="" color={color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendation card */}
        <Card
          style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}
          onClick={() => navigate("recommendation")}
        >
          <SectionLabel>Top recommendation</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconBadge bg={C.amberTint} size={52}>⊙</IconBadge>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>Harvest in 8–10 days</div>
              <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>Optimal price window opening</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.6, margin: 0 }}>
            Maturity indicators strong. Mandi prices trending up this week. Weather clear through Nov 22. Earlier harvest risks lower grade; later risks weather exposure.
          </p>
          <div
            style={{
              background: C.sageTint,
              borderRadius: radius.md,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: C.inkMuted, fontWeight: 500 }}>Expected revenue impact</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: C.sageDeep, letterSpacing: "-0.02em" }}>+₹1,840</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" fullWidth onClick={() => navigate("recommendation")}>View plan →</Btn>
            <Btn variant="secondary" fullWidth>Later</Btn>
          </div>
        </Card>
      </div>

      {/* Secondary action rows */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { icon: "⊙", bg: C.amberTint, label: "Grade your produce", sub: "Tap to capture a photo", badge: null, screen: "grade-capture" as Screen },
          { icon: "◐", bg: "#EAF0FD", label: "3 schemes may apply", sub: "₹8,400 in benefits available", badge: "1 expiring soon", screen: "schemes" as Screen },
          { icon: "≈", bg: C.blueTint, label: "Irrigation forecast", sub: "Next irrigation: in 3 days", badge: null, screen: "irrigation" as Screen },
          { icon: "◈", bg: C.sageTint, label: "Season review", sub: "Kharif 2024 · 78 days left", badge: null, screen: "season-review" as Screen },
        ].map(({ icon, bg, label, sub, badge, screen }) => (
          <Card
            key={label}
            style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}
            onClick={() => navigate(screen)}
          >
            <IconBadge bg={bg} size={44}>{icon}</IconBadge>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{label}</div>
              <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{sub}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {badge && <Badge color={C.rust} size="sm">{badge}</Badge>}
              <span style={{ color: C.inkMuted, fontSize: 18 }}>›</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
