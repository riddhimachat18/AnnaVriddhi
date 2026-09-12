import { useState, useEffect } from "react";
import { C, radius, shadow } from "../tokens";
import { Card, IconBadge, Badge, PageHeader, Btn } from "../components/ui";
import type { Screen } from "../tokens";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { getRecommendations } from "../api/recommendations";

export default function Recommendation({ navigate }: { navigate: (s: Screen) => void }) {
  const { farmer } = useAuth();
  const { currentCrop } = useData();
  const isDemoAccount = localStorage.getItem('is_demo_account') === 'true';
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [currentCrop?.id, isDemoAccount]);

  const loadRecommendations = async () => {
    if (isDemoAccount) {
      // Demo data
      setRecommendations([{
        id: 'demo-1',
        type: 'harvest',
        priority: 'high',
        title: 'Harvest your wheat between Nov 22–24',
        body: 'Maturity indicators strong. Mandi prices trending up this week. Weather clear through Nov 22.',
        revenue_impact_inr: 1840,
        confidence: 87,
      }]);
      setLoading(false);
      return;
    }

    if (!currentCrop?.id) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getRecommendations(currentCrop.id);
      setRecommendations(data || []);
    } catch (err: any) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <PageHeader
          title="Recommendation"
          back="Dashboard"
          onBack={() => navigate("dashboard")}
        />
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 14, color: C.inkMuted }}>Loading recommendations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <PageHeader
          title="Recommendation"
          back="Dashboard"
          onBack={() => navigate("dashboard")}
        />
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 14, color: C.rust, marginBottom: 12 }}>{error}</div>
          <Btn variant="primary" onClick={loadRecommendations}>Retry</Btn>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <PageHeader
          title="Recommendation"
          back="Dashboard"
          onBack={() => navigate("dashboard")}
        />
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>★</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
            No Recommendations Yet
          </div>
          <div style={{ fontSize: 14, color: C.inkMuted, marginBottom: 24 }}>
            {!currentCrop 
              ? "Set up your crop to receive personalized recommendations"
              : "Your crop is being analyzed. Check back soon for recommendations."}
          </div>
          <Btn variant="primary" onClick={() => navigate("dashboard")}>
            Back to Dashboard
          </Btn>
        </div>
      </div>
    );
  }

  const topRec = recommendations[0];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <PageHeader
        title="Recommendation"
        back="Dashboard"
        onBack={() => navigate("dashboard")}
        actions={
          <Badge color={C.amber} bg={C.amberTint} size="lg">
            {topRec.priority === 'high' ? '⏱ High Priority' : 'Action Available'}
          </Badge>
        }
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
              <span style={{ color: C.sage }}>
                {isDemoAccount ? 'Nov 22–24' : topRec.title}
              </span>{isDemoAccount ? ' for best returns.' : ''}
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
            <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 2 }}>Expected revenue impact</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, color: C.sageDeep, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {topRec.revenue_impact_inr ? `+₹${topRec.revenue_impact_inr}` : '—'}
            </div>
            <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>
              {isDemoAccount ? 'per acre · based on current mandi price trends' : 'estimated benefit'}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 6 }}>Confidence</div>
            <Badge color={C.sage} bg={`${C.sage}22`} size="lg">
              {topRec.confidence ? `${topRec.confidence}%` : 'Medium'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Recommendation details */}
      <Card hover={false} style={{ padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 12 }}>Details</div>
        <p style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.65, margin: 0 }}>
          {topRec.body || 'Follow this recommendation to optimize your crop management.'}
        </p>
      </Card>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12 }}>
        <Btn variant="primary" size="lg" onClick={() => navigate("dashboard")}>
          Back to Dashboard
        </Btn>
        {recommendations.length > 1 && (
          <Btn variant="secondary" size="lg">
            View All ({recommendations.length}) →
          </Btn>
        )}
      </div>
    </div>
  );
}
