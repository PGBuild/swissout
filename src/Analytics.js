import { useState, useEffect, useRef } from "react";
import { supabase, fetchStatsOrganisateur } from './supabase';

// ── MOCK DATA ──
const EVENTS = [
  { id: 1, titre: "Soirée Rooftop Bern", categorie: "soirees", date: "2025-04-03", statut: "approuve", color: "#BF5AF2" },
  { id: 2, titre: "Afterwork Genève", categorie: "soirees", date: "2025-04-10", statut: "approuve", color: "#7C3AED" },
  { id: 3, titre: "Trail Jura Express", categorie: "sports", date: "2025-04-18", statut: "approuve", color: "#64D2FF" },
  { id: 4, titre: "Street Food Basel", categorie: "street-food", date: "2025-04-25", statut: "en_attente", color: "#FF9F0A" },
];

const DAILY_VIEWS = [
  { day: "Lun", views: 42, clicks: 18, saves: 7, participations: 4 },
  { day: "Mar", views: 67, clicks: 31, saves: 12, participations: 8 },
  { day: "Mer", views: 55, clicks: 24, saves: 9, participations: 5 },
  { day: "Jeu", views: 89, clicks: 45, saves: 21, participations: 14 },
  { day: "Ven", views: 134, clicks: 72, saves: 38, participations: 22 },
  { day: "Sam", views: 198, clicks: 103, saves: 54, participations: 31 },
  { day: "Dim", views: 156, clicks: 84, saves: 41, participations: 24 },
];

const EVENT_STATS = [
  { id: 1, titre: "Soirée Rooftop Bern", views: 342, clicks: 187, saves: 94, participations: 67, color: "#BF5AF2" },
  { id: 2, titre: "Afterwork Genève", views: 289, clicks: 134, saves: 71, participations: 48, color: "#7C3AED" },
  { id: 3, titre: "Trail Jura Express", views: 198, clicks: 89, saves: 45, participations: 31, color: "#64D2FF" },
  { id: 4, titre: "Street Food Basel", views: 76, clicks: 23, saves: 12, participations: 5, color: "#FF9F0A" },
];

const AUDIENCE = [
  { label: "Hommes", value: 58, color: "#7C3AED" },
  { label: "Femmes", value: 42, color: "#BF5AF2" },
];

const AGE_GROUPS = [
  { label: "18-24", value: 31, color: "#A78BFA" },
  { label: "25-34", value: 44, color: "#7C3AED" },
  { label: "35-44", value: 16, color: "#5B21B6" },
  { label: "45+",   value: 9,  color: "#3B0764" },
];

const TOP_CITIES = [
  { city: "Genève", count: 187 },
  { city: "Berne", count: 143 },
  { city: "Zurich", count: 128 },
  { city: "Lausanne", count: 96 },
  { city: "Bâle", count: 74 },
];

const PERIODS = ["7 jours", "30 jours", "3 mois"];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:#07080A;color:#EEEEE8;font-family:'DM Sans',sans-serif;min-height:100vh}

:root{
  --accent:#7C3AED;--accent2:#A78BFA;
  --bg:#07080A;--s1:#0E0F11;--s2:#151618;--s3:#1C1E21;
  --bd:#1E2024;--bd2:#272A2F;
  --txt:#EEEEE8;--muted:#888;--faint:#444;
  --green:#30D158;--orange:#FF9F0A;--red:#FF3B2F;--blue:#0A84FF;
}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes countUp{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes chartGrow{from{height:0}to{height:var(--h)}}

.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh}

/* SIDEBAR */
.side{background:var(--s1);border-right:1px solid var(--bd);padding:24px 14px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh}
.side-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.5px;padding:0 8px;margin-bottom:3px}
.side-logo em{color:var(--accent);font-style:normal}
.side-sub{font-size:10px;color:var(--faint);letter-spacing:1px;text-transform:uppercase;padding:0 8px;margin-bottom:22px;font-family:'DM Mono',monospace}
.side-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.sn{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;transition:all 0.15s;border:1px solid transparent}
.sn:hover{background:var(--s2);color:var(--txt)}
.sn.active{background:var(--s2);border-color:var(--bd2);color:var(--txt);font-weight:600}
.sn-icon{font-size:15px;width:18px;text-align:center}
.side-av{display:flex;align-items:center;gap:9px;padding:11px 12px;background:var(--s2);border-radius:12px;margin-top:auto}
.av-icon{width:30px;height:30px;border-radius:9px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.av-name{font-size:11px;font-weight:600}
.av-role{font-size:9px;color:var(--faint);font-family:'DM Mono',monospace;margin-top:1px}

/* MAIN */
.main{padding:0}

/* TOPBAR */
.topbar{padding:22px 28px;border-bottom:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--bg);z-index:10;backdrop-filter:blur(12px)}
.topbar-left h1{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.3px}
.topbar-left p{font-size:12px;color:var(--faint);margin-top:2px}
.period-tabs{display:flex;gap:4px;background:var(--s1);border:1px solid var(--bd);border-radius:10px;padding:3px}
.ptab{padding:6px 13px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.15s;color:var(--faint);font-family:'DM Mono',monospace}
.ptab.active{background:var(--accent);color:#fff}
.ptab:hover:not(.active){background:var(--s2);color:var(--txt)}

.content{padding:24px 28px 60px}

/* STAT CARDS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.stat-card{background:var(--s1);border:1px solid var(--bd);border-radius:18px;padding:18px 20px;position:relative;overflow:hidden;transition:all 0.2s;animation:fadeUp 0.4s ease both}
.stat-card:hover{border-color:var(--bd2);transform:translateY(-2px)}
.stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.stat-card.purple::after{background:var(--accent)}
.stat-card.green::after{background:var(--green)}
.stat-card.orange::after{background:var(--orange)}
.stat-card.blue::after{background:var(--blue)}
.stat-card:nth-child(1){animation-delay:0s}
.stat-card:nth-child(2){animation-delay:0.06s}
.stat-card:nth-child(3){animation-delay:0.12s}
.stat-card:nth-child(4){animation-delay:0.18s}
.sc-icon{font-size:18px;margin-bottom:12px}
.sc-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--faint);font-family:'DM Mono',monospace;margin-bottom:6px}
.sc-val{font-family:'Syne',sans-serif;font-weight:800;font-size:32px;letter-spacing:-1.5px;line-height:1;animation:countUp 0.5s ease both}
.sc-change{display:flex;align-items:center;gap:4px;margin-top:8px;font-size:11px;font-weight:600;font-family:'DM Mono',monospace}
.sc-change.up{color:var(--green)}
.sc-change.down{color:var(--red)}
.sc-sub{font-size:11px;color:var(--faint);margin-top:2px}

/* CHART SECTION */
.section{background:var(--s1);border:1px solid var(--bd);border-radius:18px;padding:22px;margin-bottom:16px;animation:fadeUp 0.4s 0.2s ease both}
.section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.section-title{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;letter-spacing:-0.2px}
.section-sub{font-size:11px;color:var(--faint);margin-top:2px}
.chart-legend{display:flex;gap:14px}
.legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);font-family:'DM Mono',monospace}
.legend-dot{width:8px;height:8px;border-radius:50%}

/* BAR CHART */
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:160px;padding-bottom:24px;position:relative;border-bottom:1px solid var(--bd)}
.bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;position:relative}
.bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;gap:2px}
.bar{width:10px;border-radius:4px 4px 0 0;transition:opacity 0.2s;cursor:pointer;position:relative}
.bar:hover{opacity:0.8}
.bar-label{font-size:10px;color:var(--faint);font-family:'DM Mono',monospace;position:absolute;bottom:-20px;white-space:nowrap}

/* METRIC SELECTOR */
.metric-tabs{display:flex;gap:6px;margin-bottom:16px}
.mtab{padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid var(--bd);background:transparent;color:var(--faint);transition:all 0.15s;font-family:'DM Mono',monospace}
.mtab:hover{background:var(--s2);color:var(--txt)}
.mtab.active{border-color:var(--accent);background:rgba(124,58,237,0.1);color:var(--accent2)}

/* EVENT RANKINGS */
.event-rank{display:flex;flex-direction:column;gap:10px}
.er-item{display:flex;align-items:center;gap:14px;padding:13px 16px;background:var(--s2);border-radius:14px;transition:all 0.2s;cursor:pointer}
.er-item:hover{background:var(--s3);transform:translateX(2px)}
.er-rank{font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:var(--faint);width:24px;text-align:center;flex-shrink:0}
.er-rank.top{color:var(--accent2)}
.er-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.er-info{flex:1;min-width:0}
.er-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.er-meta{font-size:11px;color:var(--faint);font-family:'DM Mono',monospace}
.er-stats{display:flex;gap:12px;flex-shrink:0}
.er-stat{text-align:right}
.er-stat-val{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
.er-stat-lbl{font-size:9px;color:var(--faint);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.5px}
.er-bar-wrap{width:100%;height:3px;background:var(--bd2);border-radius:2px;margin-top:8px;overflow:hidden}
.er-bar{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.34,1.2,.64,1)}

/* TWO COL */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}

/* DONUT */
.donut-wrap{display:flex;align-items:center;gap:24px}
.donut{position:relative;width:120px;height:120px;flex-shrink:0}
.donut svg{transform:rotate(-90deg)}
.donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.donut-pct{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-1px}
.donut-sub{font-size:10px;color:var(--faint);font-family:'DM Mono',monospace}
.donut-legend{display:flex;flex-direction:column;gap:10px;flex:1}
.dl-item{display:flex;align-items:center;gap:8px}
.dl-color{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.dl-label{font-size:12px;font-weight:500;flex:1}
.dl-val{font-family:'Syne',sans-serif;font-weight:700;font-size:13px}

/* HORIZONTAL BARS */
.hbar-list{display:flex;flex-direction:column;gap:12px}
.hbar-item{display:flex;flex-direction:column;gap:5px}
.hbar-head{display:flex;justify-content:space-between;align-items:center}
.hbar-label{font-size:12px;font-weight:500}
.hbar-val{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted)}
.hbar-track{height:6px;background:var(--bd2);border-radius:3px;overflow:hidden}
.hbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));animation:barGrow 1s cubic-bezier(.34,1.2,.64,1) both}

/* CITIES */
.city-list{display:flex;flex-direction:column;gap:8px}
.city-item{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--s2);border-radius:12px}
.city-rank{font-size:11px;font-weight:700;color:var(--faint);font-family:'DM Mono',monospace;width:18px}
.city-name{flex:1;font-size:13px;font-weight:500}
.city-count{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:var(--accent2)}
.city-bar{flex:2;height:4px;background:var(--bd2);border-radius:2px;overflow:hidden}
.city-fill{height:100%;border-radius:2px;background:var(--accent);opacity:0.6}

/* TOOLTIP */
.tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#1A1C20;border:1px solid var(--bd2);border-radius:8px;padding:6px 10px;font-size:11px;white-space:nowrap;pointer-events:none;z-index:20;font-family:'DM Mono',monospace;color:var(--txt)}
`;

const METRICS = [
  { id: "views", label: "Vues", color: "#7C3AED" },
  { id: "clicks", label: "Clics", color: "#0A84FF" },
  { id: "saves", label: "Sauvés", color: "#FF9F0A" },
  { id: "participations", label: "Participations", color: "#30D158" },
];

function BarChart({ data, metric }) {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = Math.max(...data.map(d => d[metric]));
  const m = METRICS.find(x => x.id === metric);

  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const h = Math.round((d[metric] / maxVal) * 130);
        return (
          <div key={i} className="bar-group" style={{ position: "relative" }}>
            <div className="bar-wrap">
              <div
                className="bar"
                style={{
                  height: h,
                  background: m.color,
                  animationDelay: `${i * 0.05}s`,
                  animation: `chartGrow 0.6s ${i * 0.05}s ease both`,
                  "--h": `${h}px`,
                }}
                onMouseEnter={() => setTooltip({ idx: i, val: d[metric] })}
                onMouseLeave={() => setTooltip(null)}
              >
                {tooltip?.idx === i && (
                  <div className="tooltip">{d[metric]} {m.label.toLowerCase()}</div>
                )}
              </div>
            </div>
            <span className="bar-label">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function Donut({ segments, total }) {
  const r = 52, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E2024" strokeWidth="14" />
      {segments.map((s, i) => {
        const dash = (s.value / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("7 jours");
  const [metric, setMetric] = useState("views");
  const [tab, setTab] = useState("overview");
  const [realEvents, setRealEvents] = useState([]);
  const [realStats, setRealStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoadingStats(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch only this organizer's events
        let query = supabase
          .from('evenements')
          .select('id, titre, categorie, date_debut, statut');
        
        // If not admin, filter by organisateur_id
        if (user) {
          query = query.eq('organisateur_id', user.id);
        }
        
        const { data: events } = await query;
        
        if (events && events.length > 0) {
          setRealEvents(events);
          const ids = events.map(e => e.id);
          const stats = await fetchStatsOrganisateur(ids);
          setRealStats(stats);
        }
      } catch(e) { console.error(e); }
      setLoadingStats(false);
    }
    loadStats();
  }, []);

  // Compute real totals
  const realTotals = Object.values(realStats).reduce((acc, s) => ({
    views: acc.views + (s.views || 0),
    clicks: acc.clicks + (s.clicks || 0),
    saves: acc.saves + (s.saves || 0),
    participations: acc.participations + (s.participations || 0),
  }), { views: 0, clicks: 0, saves: 0, participations: 0 });

  // Build real EVENT_STATS
  const realEventStats = realEvents.map(e => ({
    id: e.id,
    titre: e.titre,
    views: realStats[e.id]?.views || 0,
    clicks: realStats[e.id]?.clicks || 0,
    saves: realStats[e.id]?.saves || 0,
    participations: realStats[e.id]?.participations || 0,
    color: "#7C3AED",
  }));

  const totals = {
    views: DAILY_VIEWS.reduce((a, d) => a + d.views, 0),
    clicks: DAILY_VIEWS.reduce((a, d) => a + d.clicks, 0),
    saves: DAILY_VIEWS.reduce((a, d) => a + d.saves, 0),
    participations: DAILY_VIEWS.reduce((a, d) => a + d.participations, 0),
  };

  const maxCity = Math.max(...TOP_CITIES.map(c => c.count));
  const maxER = Math.max(...EVENT_STATS.map(e => e[metric]));

  return (
    <>
      <style>{S}</style>
      <div className="app">

        {/* SIDEBAR */}
        <div className="side">
          <div className="side-logo">Swiss<em>Out</em></div>
          <div className="side-sub">Analytics</div>
          <div className="side-nav">
            {[["overview","📊","Vue d'ensemble"],["events","📅","Mes événements"],["audience","👥","Audience"],["cities","📍","Villes"]].map(([id,icon,label]) => (
              <div key={id} className={`sn${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
                <span className="sn-icon">{icon}</span>{label}
              </div>
            ))}
          </div>
          <div className="side-av">
            <div className="av-icon">G</div>
            <div>
              <div className="av-name">Giuseppe</div>
              <div className="av-role">Organisateur</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h1>{tab === "overview" ? "Vue d'ensemble" : tab === "events" ? "Mes événements" : tab === "audience" ? "Audience" : "Villes"}</h1>
              <p>Données en temps réel · SwissOut Analytics</p>
            </div>
            <div className="period-tabs">
              {PERIODS.map(p => (
                <div key={p} className={`ptab${period === p ? " active" : ""}`} onClick={() => setPeriod(p)}>{p}</div>
              ))}
            </div>
          </div>

          <div className="content">

            {/* OVERVIEW */}
            {tab === "overview" && (
              <>
                {/* STAT CARDS */}
                <div className="stats-grid">
                  {[
                    { label: "Vues totales", val: realTotals.views || totals.views, icon: "👁", color: "purple", change: "+18%", up: true },
                    { label: "Clics", val: realTotals.clicks || totals.clicks, icon: "🖱", color: "blue", change: "+24%", up: true },
                    { label: "Sauvegardés", val: realTotals.saves || totals.saves, icon: "♥", color: "orange", change: "+31%", up: true },
                    { label: "Participations", val: realTotals.participations || totals.participations, icon: "✓", color: "green", change: "+12%", up: true },
                  ].map((s, i) => (
                    <div key={i} className={`stat-card ${s.color}`}>
                      <div className="sc-icon">{s.icon}</div>
                      <div className="sc-label">{s.label}</div>
                      <div className="sc-val">{s.val.toLocaleString()}</div>
                      <div className={`sc-change ${s.up ? "up" : "down"}`}>
                        <span>{s.up ? "↑" : "↓"}</span>
                        <span>{s.change} vs semaine passée</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BAR CHART */}
                <div className="section">
                  <div className="section-head">
                    <div>
                      <div className="section-title">Activité par jour</div>
                      <div className="section-sub">Les 7 derniers jours</div>
                    </div>
                  </div>
                  <div className="metric-tabs">
                    {METRICS.map(m => (
                      <button key={m.id} className={`mtab${metric === m.id ? " active" : ""}`} onClick={() => setMetric(m.id)}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <BarChart data={DAILY_VIEWS} metric={metric} />
                </div>

                {/* EVENT RANKINGS */}
                <div className="section">
                  <div className="section-head">
                    <div>
                      <div className="section-title">Performance des événements</div>
                      <div className="section-sub">Classés par {METRICS.find(m2 => m2.id === metric)?.label.toLowerCase()}</div>
                    </div>
                    <div className="metric-tabs" style={{ marginBottom: 0 }}>
                      {METRICS.map(m => (
                        <button key={m.id} className={`mtab${metric === m.id ? " active" : ""}`} onClick={() => setMetric(m.id)}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="event-rank">
                    {(realEventStats.length > 0 ? realEventStats : EVENT_STATS).sort((a,b) => b[metric] - a[metric]).map((e, i) => (
                      <div key={e.id} className="er-item">
                        <div className={`er-rank${i === 0 ? " top" : ""}`}>#{i+1}</div>
                        <div className="er-dot" style={{ background: e.color }} />
                        <div className="er-info">
                          <div className="er-title">{e.titre}</div>
                          <div className="er-bar-wrap">
                            <div className="er-bar" style={{ width: `${(e[metric]/maxER)*100}%`, background: e.color }} />
                          </div>
                        </div>
                        <div className="er-stats">
                          <div className="er-stat">
                            <div className="er-stat-val" style={{ color: e.color }}>{e[metric]}</div>
                            <div className="er-stat-lbl">{METRICS.find(m2 => m2.id === metric)?.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* EVENTS TAB */}
            {tab === "events" && (
              <>
                <div className="stats-grid">
                  {[
                    { label: "Events actifs", val: 3, icon: "✅", color: "green" },
                    { label: "En attente", val: 1, icon: "⏳", color: "orange" },
                    { label: "Vues totales", val: 905, icon: "👁", color: "purple" },
                    { label: "Taux de clic", val: "45%", icon: "🖱", color: "blue" },
                  ].map((s, i) => (
                    <div key={i} className={`stat-card ${s.color}`}>
                      <div className="sc-icon">{s.icon}</div>
                      <div className="sc-label">{s.label}</div>
                      <div className="sc-val">{s.val}</div>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <div className="section-head">
                    <div className="section-title">Détail par événement</div>
                  </div>
                  <div className="metric-tabs">
                    {METRICS.map(m => (
                      <button key={m.id} className={`mtab${metric === m.id ? " active" : ""}`} onClick={() => setMetric(m.id)}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <div className="event-rank">
                    {(realEventStats.length > 0 ? realEventStats : EVENT_STATS).map((e, i) => (
                      <div key={e.id} className="er-item">
                        <div className="er-dot" style={{ background: e.color, width: 12, height: 12, borderRadius: "50%" }} />
                        <div className="er-info">
                          <div className="er-title">{e.titre}</div>
                          <div className="er-meta">
                            👁 {e.views} vues · 🖱 {e.clicks} clics · ♥ {e.saves} saves · ✓ {e.participations} participations
                          </div>
                          <div className="er-bar-wrap" style={{ marginTop: 8 }}>
                            <div className="er-bar" style={{ width: `${(e[metric]/maxER)*100}%`, background: e.color }} />
                          </div>
                        </div>
                        <div className="er-stat">
                          <div className="er-stat-val" style={{ color: e.color }}>{e[metric]}</div>
                          <div className="er-stat-lbl">{METRICS.find(m2 => m2.id === metric)?.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* AUDIENCE TAB */}
            {tab === "audience" && (
              <>
                <div className="two-col">
                  <div className="section" style={{ margin: 0 }}>
                    <div className="section-head">
                      <div className="section-title">Genre</div>
                    </div>
                    <div className="donut-wrap">
                      <div className="donut">
                        <Donut segments={AUDIENCE} total={100} />
                        <div className="donut-center">
                          <div className="donut-pct" style={{ color: "#7C3AED" }}>58%</div>
                          <div className="donut-sub">hommes</div>
                        </div>
                      </div>
                      <div className="donut-legend">
                        {AUDIENCE.map((a, i) => (
                          <div key={i} className="dl-item">
                            <div className="dl-color" style={{ background: a.color }} />
                            <span className="dl-label">{a.label}</span>
                            <span className="dl-val">{a.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="section" style={{ margin: 0 }}>
                    <div className="section-head">
                      <div className="section-title">Tranches d'âge</div>
                    </div>
                    <div className="hbar-list">
                      {AGE_GROUPS.map((a, i) => (
                        <div key={i} className="hbar-item">
                          <div className="hbar-head">
                            <span className="hbar-label">{a.label}</span>
                            <span className="hbar-val">{a.value}%</span>
                          </div>
                          <div className="hbar-track">
                            <div className="hbar-fill" style={{ width: `${a.value}%`, background: a.color, animationDelay: `${i*0.1}s` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-head">
                    <div className="section-title">Comportement utilisateurs</div>
                  </div>
                  <div className="stats-grid" style={{ marginBottom: 0 }}>
                    {[
                      { label: "Taux retour", val: "34%", icon: "🔄", color: "purple" },
                      { label: "Temps moyen", val: "2m14s", icon: "⏱", color: "blue" },
                      { label: "Taux conversion", val: "12%", icon: "📈", color: "green" },
                      { label: "Nouveaux users", val: 187, icon: "✨", color: "orange" },
                    ].map((s, i) => (
                      <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i*0.06}s` }}>
                        <div className="sc-icon">{s.icon}</div>
                        <div className="sc-label">{s.label}</div>
                        <div className="sc-val" style={{ fontSize: 24 }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CITIES TAB */}
            {tab === "cities" && (
              <div className="section">
                <div className="section-head">
                  <div>
                    <div className="section-title">Top villes</div>
                    <div className="section-sub">D'où viennent tes utilisateurs</div>
                  </div>
                </div>
                <div className="city-list">
                  {TOP_CITIES.map((c, i) => (
                    <div key={i} className="city-item">
                      <div className="city-rank">#{i+1}</div>
                      <div className="city-name">{c.city}</div>
                      <div className="city-bar">
                        <div className="city-fill" style={{ width: `${(c.count/maxCity)*100}%` }} />
                      </div>
                      <div className="city-count">{c.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
