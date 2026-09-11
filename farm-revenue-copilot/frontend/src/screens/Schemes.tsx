import { useState } from "react";
import { C, radius, shadow } from "../tokens";
import { Card, PageHeader, Badge, Btn, IconBadge } from "../components/ui";
import type { Screen } from "../tokens";

const schemes = [
  {
    id: 1,
    icon: "◊",
    name: "PMFBY — Pradhan Mantri Fasal Bima Yojana",
    category: "Crop Insurance",
    value: "₹2,400",
    valueSub: "est. insurance cover for this plot",
    deadline: "Nov 30, 2024",
    daysLeft: 16,
    urgency: "soon" as const,
    eligible: true,
    desc: "Comprehensive crop insurance against natural calamities, pests, and diseases. Premium: ₹260 (2% of sum insured).",
  },
  {
    id: 2,
    icon: "∆",
    name: "Soil Health Card Scheme — Nutrient Subsidy",
    category: "Input Subsidy",
    value: "₹1,800",
    valueSub: "fertilizer subsidy for your soil profile",
    deadline: "Mar 15, 2025",
    daysLeft: 121,
    urgency: "normal" as const,
    eligible: true,
    desc: "Subsidised fertilizer supply based on SHC soil test results. Your N deficiency makes you priority eligible.",
  },
  {
    id: 3,
    icon: "₹",
    name: "PM-KISAN — Direct Income Support",
    category: "Income Support",
    value: "₹2,000",
    valueSub: "per installment (2 remaining this year)",
    deadline: "Dec 31, 2024",
    daysLeft: 47,
    urgency: "normal" as const,
    eligible: true,
    desc: "₹6,000/year direct benefit transfer in 3 equal installments of ₹2,000.",
  },
  {
    id: 4,
    icon: "◐",
    name: "KCC — Kisan Credit Card (Interest Subvention)",
    category: "Credit",
    value: "4% interest",
    valueSub: "vs. 9–14% market rate for short-term credit",
    deadline: "Ongoing",
    daysLeft: 999,
    urgency: "low" as const,
    eligible: false,
    desc: "Flexible working capital for farm inputs at subsidised interest. Requires KCC card — apply at your nearest cooperative bank.",
  },
];

const urgencyColors = {
  soon: { color: C.rust, bg: C.rustTint, label: "Deadline soon" },
  normal: { color: C.amber, bg: C.amberTint, label: "Apply soon" },
  low: { color: C.inkMuted, bg: C.bg, label: "Ongoing" },
};

export default function Schemes({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const scheme = schemes.find((s) => s.id === selected)!;
    const uc = urgencyColors[scheme.urgency];
    return (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <PageHeader
          title={scheme.name}
          subtitle={scheme.category}
          back="Schemes"
          onBack={() => setSelected(null)}
          actions={<Badge color={uc.color} bg={uc.bg}>{scheme.daysLeft < 999 ? `${scheme.daysLeft} days left` : "Ongoing"}</Badge>}
        />

        {/* Value hero */}
        <Card
          hover={false}
          style={{
            background: `linear-gradient(135deg, ${C.sageTint}, #d4e8d6)`,
            border: `1px solid ${C.sage}33`,
            padding: "28px 32px",
            marginBottom: 16,
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 52 }}>{scheme.icon}</span>
          <div>
            <div style={{ fontSize: 12, color: C.inkMuted, fontWeight: 600, marginBottom: 4 }}>Benefit for your farm</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.03em" }}>{scheme.value}</div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 2 }}>{scheme.valueSub}</div>
          </div>
        </Card>

        {/* Eligibility */}
        <Card hover={false} style={{ padding: "24px", marginBottom: 16, borderLeft: `4px solid ${scheme.eligible ? C.sage : C.amber}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
            {scheme.eligible ? "✓ You are eligible" : "! Eligibility pending"}
          </div>
          <p style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.65, margin: 0 }}>
            {scheme.eligible
              ? `Based on your farm profile (2.5 acres, Karnal district, Kharif wheat), you meet all eligibility criteria for ${scheme.name}.`
              : "You may be eligible but need to complete KCC card application first. Visit your nearest cooperative bank."}
          </p>
        </Card>

        {/* Documents checklist */}
        <Card hover={false} style={{ padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 14 }}>Required documents</div>
          {[
            { done: true, doc: "Aadhaar card", note: "Linked to farm account" },
            { done: true, doc: "Land records / Khasra number", note: "Plot A registered" },
            { done: true, doc: "Bank account (PM-KISAN linked)", note: "Account verified" },
            { done: false, doc: "Crop sowing certificate", note: "From village patwari — obtain before deadline" },
            { done: false, doc: "Soil Health Card copy", note: "SHC issued 2022 — may need renewal" },
          ].map(({ done, doc, note }) => (
            <div key={doc} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}`, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: done ? C.sage : "transparent", border: done ? "none" : `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                {done ? "✓" : ""}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: done ? C.inkMuted : C.ink, textDecoration: done ? "line-through" : "none" }}>{doc}</div>
                <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 1 }}>{note}</div>
              </div>
            </div>
          ))}
        </Card>

        <Btn variant="primary" size="lg" fullWidth>⊗ How to apply → PM portal</Btn>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Government Schemes"
        subtitle="Matched to your farm profile — Karnal, 2.5 ac, Wheat"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge color={C.rust} bg={C.rustTint}>1 deadline soon</Badge>
            <Badge color={C.sage} bg={C.sageTint}>3 eligible</Badge>
          </div>
        }
      />

      {/* Total value banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.sageDeep}, #2a3d2c)`,
          borderRadius: radius.xl,
          padding: "20px 28px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: `${C.sageTint}88`, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total available benefits</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>₹8,400</div>
          <div style={{ fontSize: 12, color: `${C.sageTint}88`, marginTop: 4 }}>across 3 eligible schemes this season</div>
        </div>
        <div style={{ fontSize: 48, opacity: 0.7 }}>▦</div>
      </div>

      {/* Scheme cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {schemes.map((scheme) => {
          const uc = urgencyColors[scheme.urgency];
          return (
            <Card
              key={scheme.id}
              style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start", opacity: scheme.eligible ? 1 : 0.7 }}
              onClick={() => setSelected(scheme.id)}
            >
              <span style={{ fontSize: 36, flexShrink: 0 }}>{scheme.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 4, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{scheme.name}</div>
                  {!scheme.eligible && <Badge color={C.amber} size="sm">Check eligibility</Badge>}
                </div>
                <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 8 }}>{scheme.desc}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge color={C.sage} bg={C.sageTint} size="sm">{scheme.category}</Badge>
                  <Badge color={uc.color} bg={uc.bg} size="sm">
                    {scheme.daysLeft < 999 ? `⌚ ${scheme.daysLeft} days left` : "Ongoing"}
                  </Badge>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.02em" }}>{scheme.value}</div>
                <div style={{ fontSize: 10, color: C.inkMuted, marginTop: 2, maxWidth: 120, lineHeight: 1.4 }}>{scheme.valueSub}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: C.sage, fontWeight: 600 }}>View details →</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
