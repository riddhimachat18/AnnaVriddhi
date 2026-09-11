import { C, radius, shadow } from "../tokens";
import { Card, IconBadge, Badge, PageHeader, Btn } from "../components/ui";
import type { Screen } from "../tokens";

export default function Recommendation({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <PageHeader
        title="Recommendation"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={<Badge color={C.amber} bg={C.amberTint} size="lg">⏱ Act within 10 days</Badge>}
      />

      {/* Hero recommendation card */}
      <Card
        hover={false}
        style={{
          background: `linear-gradient(135deg, ${C.sageTint} 0%, #d8ead9 100%)`,
          border: `1px solid ${C.sage}33`,
          padding: "36px 36px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
          <IconBadge bg={`${C.sage}22`} size={72}>◈</IconBadge>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.sage, marginBottom: 8 }}>
              Harvest window
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 700,
                color: C.sageDeep,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: 12,
                margin: 0,
              }}
            >
              Harvest your wheat between
              <br />
              <span style={{ color: C.sage }}>Nov 22–24</span> for best returns.
            </h2>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            background: "rgba(255,255,255,0.7)",
            borderRadius: radius.lg,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(4px)",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 2 }}>Expected revenue impact vs. waiting</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.04em", lineHeight: 1 }}>
              +₹1,840
            </div>
            <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>per acre · based on current mandi price trends</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 6 }}>Confidence</div>
            <Badge color={C.sage} bg={`${C.sage}22`} size="lg">High — 87%</Badge>
          </div>
        </div>
      </Card>

      {/* Reasoning breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { icon: "◈", color: C.sage, bg: C.sageTint, label: "Maturity", value: "88%", detail: "Days-to-maturity + canopy indicators" },
          { icon: "◉", color: C.blue, bg: C.blueTint, label: "Weather window", value: "Clear", detail: "5 consecutive dry days forecast" },
          { icon: "₹", color: C.amber, bg: C.amberTint, label: "Mandi price trend", value: "↑ Rising", detail: "₹2,240/qtl · +₹80 this week" },
        ].map(({ icon, color, bg, label, value, detail }) => (
          <Card key={label} style={{ textAlign: "center", padding: "24px 20px" }}>
            <IconBadge bg={bg} size={44} borderRadius={12}>{icon}</IconBadge>
            <div style={{ marginTop: 12, fontSize: 12, color: C.inkMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color, marginTop: 4, letterSpacing: "-0.02em" }}>{value}</div>
            <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 4, lineHeight: 1.5 }}>{detail}</div>
          </Card>
        ))}
      </div>

      {/* What happens if you wait */}
      <Card hover={false} style={{ padding: "24px 28px", marginBottom: 20, borderLeft: `4px solid ${C.amber}` }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>!</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>What happens if you wait past Nov 26?</div>
            <div style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.65 }}>
              A low-pressure weather system is forecast from Nov 27. Unseasonal rain at harvest stage increases lodging risk (estimated 8–12% yield reduction) and downgrades produce quality from Grade A to Grade B — a price drop of ₹140–190/qtl. Combined, that's an estimated ₹1,200–1,600 loss per acre vs. harvesting on schedule.
            </div>
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <Card hover={false} style={{ padding: "24px 28px", marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Pre-harvest checklist</div>
        {[
          { done: true, item: "Moisture meter check — grain moisture ≤ 14%" },
          { done: true, item: "Harvester booking confirmed — contact Harinder (98112 XXXXX)" },
          { done: false, item: "Gunny bags arranged — need ~80 bags for 2.5 acres" },
          { done: false, item: "Mandi registration slip ready" },
          { done: false, item: "Transport arranged for Nov 22 morning" },
        ].map(({ done, item }) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: done ? "none" : `2px solid ${C.line}`,
                background: done ? C.sage : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {done ? "✓" : ""}
            </div>
            <span style={{ fontSize: 13, color: done ? C.inkMuted : C.ink, textDecoration: done ? "line-through" : "none" }}>{item}</span>
          </div>
        ))}
      </Card>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12 }}>
        <Btn variant="primary" size="lg" onClick={() => navigate("harvest-window")}>
          □ View full harvest plan →
        </Btn>
        <Btn variant="secondary" size="lg">
          ⊞ Send to my WhatsApp
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => navigate("dashboard")}>
          Skip for now
        </Btn>
      </div>
    </div>
  );
}
