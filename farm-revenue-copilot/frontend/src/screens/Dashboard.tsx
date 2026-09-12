import { C, shadow, radius } from "../tokens";
import { Card, GaugeBar, IconBadge, Badge, StatTile, SectionLabel, Btn } from "../components/ui";
import type { Screen } from "../tokens";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export default function Dashboard({ navigate }: { navigate: (s: Screen) => void }) {
  const { farmer } = useAuth();
  const { currentCrop, cropHealth, topRecommendations, loading } = useData();
  const isDemoAccount = localStorage.getItem('is_demo_account') === 'true';

  // Show loading state
  if (loading && !isDemoAccount) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 16, color: C.inkMuted }}>Loading your dashboard...</div>
      </div>
    );
  }

  // For demo account, use hardcoded values
  const farmInfo = isDemoAccount ? {
    farmerName: "Ramesh Kumar",
    plotName: "Plot A",
    area: "2.5 acres",
    cropName: "Wheat",
    season: "Kharif 2024"
  } : {
    farmerName: farmer?.name || "Farmer",
    plotName: currentCrop ? "Active Crop" : "No Crop",
    area: currentCrop?.area_ac ? `${currentCrop.area_ac} acres` : "—",
    cropName: currentCrop?.crop_name || "No crop planted",
    season: "Current Season"
  };

  // Use actual data for real users, demo data for demo account
  const soilMoisture = isDemoAccount ? 74 : (cropHealth?.soil_moisture_pct || 0);
  const temperature = isDemoAccount ? 26 : (cropHealth?.ambient_temp_c || 0);
  const diseaseRisk = isDemoAccount ? "Low" : (cropHealth?.disease_risk_level || "Unknown");
  const cropHealthScore = isDemoAccount ? 82 : (cropHealth?.health_score || 0);

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
            <Badge color={C.sage} bg={C.sageTint}>{farmInfo.season}</Badge>
          </div>
          <div style={{ fontSize: 12, color: C.inkMuted }}>
            {farmInfo.farmerName}'s Farm · {farmInfo.plotName} · {farmInfo.area} · {farmInfo.cropName}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: C.inkMuted }}>Thu, 14 Nov 2024</div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("messages")}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.surface, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: shadow.sm }}>⌘</div>
            <div style={{ position: "absolute", top: -3, right: -3, width: 18, height: 18, borderRadius: 999, background: C.rust, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          </div>
        </div>
      </div>

      {/* Stat tiles row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <StatTile 
          icon="≈" 
          iconBg={C.blueTint} 
          label="Soil Moisture" 
          value={soilMoisture > 0 ? `${soilMoisture}%` : "—"} 
          sub={soilMoisture > 0 ? "Optimal range 65–80%" : "No data available"} 
          color={C.blue} 
        />
        <StatTile 
          icon="▲" 
          iconBg={C.amberTint} 
          label="Temperature" 
          value={temperature > 0 ? `${temperature}°C` : "—"} 
          sub={temperature > 0 ? `Feels like ${temperature + 2}°C` : "No data available"} 
          color={C.amber} 
        />
        <StatTile 
          icon="◈" 
          iconBg={C.sageTint} 
          label="Rain forecast" 
          value={isDemoAccount ? "None" : "—"} 
          sub={isDemoAccount ? "Next 5 days clear" : "Weather data loading..."} 
          color={C.sage} 
        />
        <StatTile 
          icon="⊕" 
          iconBg={C.sageTint} 
          label="Disease risk" 
          value={diseaseRisk} 
          sub={diseaseRisk !== "Unknown" ? "Based on latest scan" : "No data available"} 
          color={C.sageDeep} 
        />
      </div>

      {/* Main content: gauges + recommendation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>
        {/* Gauges */}
        <Card style={{ padding: "24px 28px" }} hover={false}>
          <SectionLabel>Crop vitals — 7 day trend</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { 
                label: "Soil moisture", 
                value: isDemoAccount ? 74 : (soilMoisture || 0), 
                color: C.blue, 
                icon: "≈", 
                trend: isDemoAccount ? "+3% from yesterday" : (soilMoisture > 0 ? "Current reading" : "No data") 
              },
              { 
                label: "Crop health index", 
                value: isDemoAccount ? 82 : (cropHealthScore || 0), 
                color: C.sage, 
                icon: "◈", 
                trend: isDemoAccount ? "Stable" : (cropHealthScore > 0 ? "Based on recent data" : "No data") 
              },
              { 
                label: "Nitrogen level (N)", 
                value: isDemoAccount ? 58 : (cropHealth?.nitrogen_pct || 0), 
                color: C.amber, 
                icon: "⊕", 
                trend: isDemoAccount ? "Below optimal — monitor" : (cropHealth?.nitrogen_pct ? "Current level" : "No data") 
              },
              { 
                label: "Disease probability", 
                value: isDemoAccount ? 18 : 0, 
                color: C.rust, 
                icon: "!", 
                trend: isDemoAccount ? "Low risk" : "No data" 
              },
              { 
                label: "Canopy cover", 
                value: isDemoAccount ? 91 : (cropHealth?.canopy_cover_pct || 0), 
                color: C.sageDeep, 
                icon: "○", 
                trend: isDemoAccount ? "On track for stage" : (cropHealth?.canopy_cover_pct ? "Current reading" : "No data") 
              },
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
          {(isDemoAccount || (topRecommendations && topRecommendations.length > 0)) ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconBadge bg={C.amberTint} size={52}>⊙</IconBadge>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>
                    {isDemoAccount ? "Harvest in 8–10 days" : (topRecommendations[0]?.title || "Check recommendations")}
                  </div>
                  <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>
                    {isDemoAccount ? "Optimal price window opening" : (topRecommendations[0]?.type || "Action needed")}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.6, margin: 0 }}>
                {isDemoAccount 
                  ? "Maturity indicators strong. Mandi prices trending up this week. Weather clear through Nov 22. Earlier harvest risks lower grade; later risks weather exposure."
                  : (topRecommendations[0]?.body || "View details for more information")
                }
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
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: C.sageDeep, letterSpacing: "-0.02em" }}>
                  {isDemoAccount ? "+₹1,840" : (topRecommendations[0]?.revenue_impact_inr ? `+₹${topRecommendations[0].revenue_impact_inr}` : "—")}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="primary" fullWidth onClick={() => navigate("recommendation")}>View plan →</Btn>
                <Btn variant="secondary" fullWidth>Later</Btn>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 14, color: C.inkMuted, marginBottom: 12 }}>No recommendations yet</div>
              <div style={{ fontSize: 12, color: C.inkMuted }}>Plant a crop to receive personalized recommendations</div>
            </div>
          )}
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
