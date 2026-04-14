import { useState } from "react";

// ── MOCK DATA ──
const MOCK_ORGANISATEURS = [
  { id: 1, nom: "Balélec Festival", email: "info@balelec.ch", organisation: "EPFL Events", statut: "approuve", created_at: "2025-04-01", events: 3 },
  { id: 2, nom: "Geneva Nightlife", email: "contact@genevanightlife.ch", organisation: "GNL Sàrl", statut: "en_attente", created_at: "2025-04-05", events: 0 },
  { id: 3, nom: "Zürich Street Food", email: "hello@zsf.ch", organisation: "ZSF GmbH", statut: "en_attente", created_at: "2025-04-06", events: 0 },
  { id: 4, nom: "Trail Club Jura", email: "trail@jurasport.ch", organisation: "Jura Trail Club", statut: "refuse", created_at: "2025-03-20", events: 0 },
];

// ── VIEWS ──
// "landing" | "login" | "register" | "pending" | "dashboard" | "admin"

const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}

:root{
  --accent:#7C3AED;
  --accent2:#A78BFA;
  --bg:#FFFFFF;
  --s1:#F8F8F8;
  --s2:#F0F0F0;
  --s3:#1E2022;
  --bd:#222426;
  --bd2:#2C2E32;
  --txt:#111111;
  --muted:#666;
  --faint:#999;
  --green:#30D158;
  --orange:#FF9F0A;
  --red:#FF3B2F;
}

body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;min-height:100vh}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.6}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

/* ── LANDING ── */
.landing{
  min-height:100vh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:40px 24px;position:relative;overflow:hidden;
}
.landing-bg{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.08), transparent);
  pointer-events:none;
}
.landing-grid{
  position:absolute;inset:0;opacity:0.03;
  background-image:linear-gradient(var(--bd) 1px,transparent 1px),linear-gradient(90deg,var(--bd) 1px,transparent 1px);
  background-size:40px 40px;pointer-events:none;
}

.landing-badge{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 14px;border-radius:20px;
  background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);
  font-size:11px;font-weight:700;color:var(--accent2);
  letter-spacing:0.8px;text-transform:uppercase;font-family:'DM Mono',monospace;
  margin-bottom:24px;animation:fadeUp 0.5s ease both;
}
.landing-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}

.landing-logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:64px;
  letter-spacing:-3px;line-height:1;margin-bottom:8px;
  animation:fadeUp 0.6s 0.1s ease both;
}
.landing-logo em{color:var(--accent);font-style:normal}

.landing-sub{
  font-size:16px;color:var(--muted);font-weight:400;
  margin-bottom:48px;animation:fadeUp 0.6s 0.2s ease both;
  text-align:center;max-width:340px;line-height:1.6;
}

.landing-cards{
  display:grid;grid-template-columns:1fr 1fr;gap:12px;
  width:100%;max-width:480px;margin-bottom:48px;
  animation:fadeUp 0.6s 0.3s ease both;
}
.landing-card{
  background:var(--s1);border:1px solid var(--bd);border-radius:20px;
  padding:24px 20px;cursor:pointer;transition:all 0.25s cubic-bezier(.34,1.4,.64,1);
  text-align:center;position:relative;overflow:hidden;
}
.landing-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);transform:scaleX(0);transition:transform 0.25s}
.landing-card:hover{transform:translateY(-4px);border-color:var(--bd2);box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.landing-card:hover::before{transform:scaleX(1)}
.lc-icon{font-size:36px;margin-bottom:12px;display:block;animation:float 3s ease-in-out infinite}
.lc-title{font-family:'Syne',sans-serif;font-weight:800;font-size:16px;letter-spacing:-0.2px;margin-bottom:5px}
.lc-desc{font-size:12px;color:var(--muted);line-height:1.5}
.lc-arrow{
  display:inline-flex;align-items:center;justify-content:center;
  margin-top:14px;width:32px;height:32px;border-radius:10px;
  background:rgba(124,58,237,0.1);color:var(--accent);font-size:14px;
  transition:all 0.2s;
}
.landing-card:hover .lc-arrow{background:var(--accent);color:#fff;transform:translateX(2px)}

.landing-footer{font-size:12px;color:var(--faint);animation:fadeUp 0.6s 0.4s ease both;text-align:center}
.landing-footer span{color:var(--accent2);cursor:pointer;font-weight:600}
.landing-footer span:hover{text-decoration:underline}

/* ── AUTH FORMS ── */
.auth-wrap{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:40px 24px;position:relative;overflow:hidden;
}
.auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.1), transparent);pointer-events:none}

.auth-card{
  width:100%;max-width:420px;position:relative;z-index:1;
  animation:fadeUp 0.5s ease;
}

.auth-back{
  display:inline-flex;align-items:center;gap:6px;
  font-size:12px;color:var(--faint);cursor:pointer;
  transition:color 0.2s;margin-bottom:32px;font-weight:600;
}
.auth-back:hover{color:var(--txt)}

.auth-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;letter-spacing:-0.8px;margin-bottom:6px}
.auth-logo em{color:var(--accent);font-style:normal}
.auth-title{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.4px;margin-bottom:6px}
.auth-sub{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.5}

/* TABS */
.auth-tabs{display:flex;background:var(--s1);border:1px solid var(--bd);border-radius:14px;padding:4px;margin-bottom:28px}
.auth-tab{flex:1;padding:9px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;text-align:center;color:var(--faint);font-family:'Syne',sans-serif}
.auth-tab.active{background:var(--accent);color:#fff}

/* FIELDS */
.field{margin-bottom:16px}
.field-label{font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--faint);font-family:'DM Mono',monospace;display:block;margin-bottom:6px}
.field-input{
  width:100%;padding:13px 16px;border-radius:12px;
  background:var(--s1);border:1px solid var(--bd);
  font-family:'DM Sans',sans-serif;font-size:14px;
  color:var(--txt);outline:none;transition:border-color 0.2s;
  -webkit-appearance:none;
}
.field-input:focus{border-color:var(--accent)}
.field-input.error{border-color:var(--red)}
.field-input::placeholder{color:var(--faint)}
.field-error{font-size:11px;color:var(--red);margin-top:4px;font-family:'DM Mono',monospace}

.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* PASSWORD STRENGTH */
.pw-strength{margin-top:6px;display:flex;gap:4px}
.pw-bar{flex:1;height:3px;border-radius:2px;background:var(--bd2);transition:background 0.3s}
.pw-bar.weak{background:var(--red)}
.pw-bar.ok{background:var(--orange)}
.pw-bar.strong{background:var(--green)}
.pw-label{font-size:10px;margin-top:4px;font-family:'DM Mono',monospace}

/* SUBMIT BTN */
.auth-btn{
  width:100%;padding:14px;border-radius:14px;border:none;
  background:var(--accent);color:#fff;
  font-family:'Syne',sans-serif;font-size:15px;font-weight:800;
  cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;
  display:flex;align-items:center;justify-content:center;gap:8px;
  margin-top:8px;
}
.auth-btn:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-1px)}
.auth-btn:disabled{opacity:0.4;cursor:not-allowed}
.auth-btn .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}

.auth-divider{text-align:center;font-size:12px;color:var(--faint);margin:20px 0;position:relative}
.auth-divider::before,.auth-divider::after{content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--bd)}
.auth-divider::before{left:0}.auth-divider::after{right:0}

.auth-link{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}
.auth-link span{color:var(--accent2);cursor:pointer;font-weight:600}
.auth-link span:hover{text-decoration:underline}

/* ── PENDING SCREEN ── */
.pending-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 24px}
.pending-card{
  width:100%;max-width:400px;text-align:center;
  background:var(--s1);border:1px solid var(--bd);border-radius:24px;
  padding:40px 32px;animation:fadeUp 0.5s ease;
}
.pending-icon{font-size:56px;margin-bottom:20px;animation:float 3s ease-in-out infinite;display:block}
.pending-title{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.4px;margin-bottom:10px}
.pending-sub{font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:28px}
.pending-steps{text-align:left;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.pending-step{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--s2);border-radius:12px}
.pending-step-num{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;font-family:'DM Mono',monospace;flex-shrink:0}
.pending-step-num.done{background:rgba(48,209,88,0.15);color:var(--green)}
.pending-step-num.active{background:rgba(124,58,237,0.15);color:var(--accent);animation:pulse 1.5s infinite}
.pending-step-num.wait{background:var(--s3);color:var(--faint)}
.pending-step-txt{font-size:13px;font-weight:500}
.pending-logout{padding:10px 24px;border-radius:12px;border:1px solid var(--bd2);background:transparent;color:var(--faint);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
.pending-logout:hover{background:var(--s2);color:var(--txt)}

/* ── ORG DASHBOARD ── */
.dash{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
.dash-side{background:var(--s1);border-right:1px solid var(--bd);padding:28px 16px;display:flex;flex-direction:column}
.dash-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.5px;margin-bottom:4px;padding:0 8px}
.dash-logo em{color:var(--accent);font-style:normal}
.dash-role{font-size:10px;color:var(--faint);letter-spacing:1px;text-transform:uppercase;font-family:'DM Mono',monospace;padding:0 8px;margin-bottom:24px}
.dash-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.dash-nav-item{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer;transition:all 0.15s;border:1px solid transparent}
.dash-nav-item:hover{background:var(--s2);color:var(--txt)}
.dash-nav-item.active{background:var(--s2);border-color:var(--bd2);color:var(--txt);font-weight:600}
.dash-nav-item .ni{font-size:16px;width:20px;text-align:center}
.dash-avatar{display:flex;align-items:center;gap:10px;padding:12px;background:var(--s2);border-radius:12px;margin-top:auto}
.dash-av-icon{width:32px;height:32px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:14px;font-weight:800;color:#fff;flex-shrink:0}
.dash-av-name{font-size:12px;font-weight:600}
.dash-av-role{font-size:10px;color:var(--faint);font-family:'DM Mono',monospace}
.dash-logout-btn{font-size:11px;color:var(--faint);cursor:pointer;margin-left:auto;padding:4px;transition:color 0.2s}
.dash-logout-btn:hover{color:var(--red)}

.dash-main{padding:32px}
.dash-topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.dash-title{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;letter-spacing:-0.5px}
.dash-add-btn{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:12px;border:none;background:var(--accent);color:#fff;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s}
.dash-add-btn:hover{filter:brightness(1.12);transform:scale(1.02)}

.dash-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.dash-stat{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:18px;position:relative;overflow:hidden}
.dash-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.dash-stat.purple::before{background:var(--accent)}
.dash-stat.green::before{background:var(--green)}
.dash-stat.orange::before{background:var(--orange)}
.ds-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--faint);font-family:'DM Mono',monospace;margin-bottom:8px}
.ds-val{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;letter-spacing:-1px}
.ds-sub{font-size:11px;color:var(--faint);margin-top:4px}

.events-list{display:flex;flex-direction:column;gap:10px}
.event-card{background:var(--s1);border:1px solid var(--bd);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;transition:all 0.2s}
.event-card:hover{border-color:var(--bd2);background:var(--s2)}
.ec-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.ec-info{flex:1;min-width:0}
.ec-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-meta{font-size:11px;color:var(--faint);display:flex;gap:10px}
.ec-status{padding:3px 10px;border-radius:7px;font-size:10px;font-weight:700;font-family:'DM Mono',monospace;letter-spacing:0.5px;text-transform:uppercase;flex-shrink:0}
.ec-status.approuve{background:rgba(48,209,88,0.1);color:var(--green)}
.ec-status.en_attente{background:rgba(255,159,10,0.1);color:var(--orange)}
.ec-status.refuse{background:rgba(255,59,47,0.1);color:var(--red)}

.empty-dash{padding:48px;text-align:center;background:var(--s1);border:1px dashed var(--bd);border-radius:16px}
.empty-dash-icon{font-size:40px;margin-bottom:12px}
.empty-dash-txt{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--faint);margin-bottom:6px}
.empty-dash-sub{font-size:12px;color:var(--faint)}

/* ── ADMIN AUTH LIST ── */
.admin-auth{padding:32px;max-width:900px;margin:0 auto}
.admin-auth-title{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;letter-spacing:-0.6px;margin-bottom:6px}
.admin-auth-sub{font-size:13px;color:var(--muted);margin-bottom:28px}

.org-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.org-stat{background:var(--s1);border:1px solid var(--bd);border-radius:14px;padding:16px 18px}
.os-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--faint);font-family:'DM Mono',monospace;margin-bottom:6px}
.os-val{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;letter-spacing:-1px}

.org-list{display:flex;flex-direction:column;gap:10px}
.org-row{
  background:var(--s1);border:1px solid var(--bd);border-radius:16px;
  padding:16px 18px;display:flex;align-items:center;gap:14px;
  transition:all 0.2s;animation:fadeUp 0.3s ease both;
}
.org-row:hover{border-color:var(--bd2);background:var(--s2)}
.org-avatar{width:42px;height:42px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;flex-shrink:0}
.org-info{flex:1;min-width:0}
.org-name{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;margin-bottom:3px}
.org-meta{font-size:11px;color:var(--faint);display:flex;gap:10px;flex-wrap:wrap}
.org-actions{display:flex;gap:8px;flex-shrink:0}
.btn-approve{padding:7px 14px;border-radius:9px;border:1px solid rgba(48,209,88,0.25);background:rgba(48,209,88,0.1);color:var(--green);font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace}
.btn-approve:hover{background:rgba(48,209,88,0.2);transform:scale(1.04)}
.btn-reject{padding:7px 14px;border-radius:9px;border:1px solid rgba(255,59,47,0.2);background:rgba(255,59,47,0.08);color:var(--red);font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace}
.btn-reject:hover{background:rgba(255,59,47,0.15);transform:scale(1.04)}
.status-chip{padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700;font-family:'DM Mono',monospace;letter-spacing:0.5px;text-transform:uppercase}
.status-chip.approuve{background:rgba(48,209,88,0.1);color:var(--green)}
.status-chip.en_attente{background:rgba(255,159,10,0.1);color:var(--orange)}
.status-chip.refuse{background:rgba(255,59,47,0.08);color:var(--red);opacity:0.7}

/* TOAST */
.toast-wrap{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;flex-direction:column;gap:8px;align-items:flex-end}
.toast{padding:11px 18px;border-radius:12px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;animation:fadeUp 0.3s ease;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
.toast.success{background:#1A3A24;border:1px solid rgba(48,209,88,0.3);color:var(--green)}
.toast.error{background:#3A1A1A;border:1px solid rgba(255,59,47,0.3);color:var(--red)}
.toast.info{background:#1A1530;border:1px solid rgba(124,58,237,0.3);color:var(--accent2)}

/* SUPABASE NOTE */
.supabase-note{
  margin-top:28px;padding:16px 18px;
  background:rgba(124,58,237,0.05);border:1px solid rgba(124,58,237,0.15);
  border-radius:14px;font-size:12px;color:var(--accent2);line-height:1.7;
}
.supabase-note strong{color:var(--accent2);font-weight:700}
.supabase-note code{font-family:'DM Mono',monospace;font-size:11px;background:rgba(124,58,237,0.1);padding:2px 6px;border-radius:4px}
`;

// ── MOCK EVENTS for org dashboard ──
const MOCK_EVENTS = [
  { id:1, titre:"Soirée Rooftop Bern", categorie:"soirees", date:"2025-05-03", statut:"approuve", color:"#BF5AF2", img:"🌙" },
  { id:2, titre:"Afterwork Genève", categorie:"soirees", date:"2025-05-10", statut:"en_attente", color:"#7C3AED", img:"🎵" },
];

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return { toasts, add };
}

function pwStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

// ── LANDING ──
function Landing({ onLogin, onRegister, onAdmin, dark, setDark, lang, setLang }) {
  const bg = dark ? "#07080A" : "#FFFFFF";
  const txt = dark ? "#EEEEE8" : "#111111";
  const cardBg = dark ? "#0E0F11" : "#F8F8F8";
  const border = dark ? "#1E2024" : "#E0E0E0";
  return (
    <div className="landing" style={{background:bg,color:txt}}>
      <div className="landing-bg" />
      <div className="landing-grid" />
      <div style={{position:"absolute",top:24,right:24,display:"flex",gap:8,alignItems:"center"}}>
        {["FR","EN","DE","IT"].map(l => (
          <button key={l} onClick={() => setLang(l)}
            style={{padding:"5px 10px",borderRadius:8,border:"1px solid #2E1F5E",
              background: lang===l ? "rgba(124,58,237,0.15)" : "transparent",
              color: lang===l ? "#A78BFA" : "#555",
              fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
            {l}
          </button>
        ))}
        <div onClick={() => setDark(d => !d)}
          style={{width:36,height:36,borderRadius:12,background:dark?"#1A1A1E":"#F0F0F0",border:dark?"1px solid #333":"1px solid #DDD",
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          {dark ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </div>
      </div>
      <div className="landing-badge"><div className="landing-dot" />Espace Organisateurs</div>
      <div className="landing-logo">Swiss<em>Out</em></div>
      <div className="landing-sub">Publiez et gérez vos événements en Suisse. Rejoignez la plateforme.</div>
      <div className="landing-cards">
        <div className="landing-card" onClick={onLogin} style={{background:cardBg,borderColor:border}}>
          <div className="lc-title">Se connecter</div>
          <div className="lc-desc">Accéder à votre espace organisateur</div>
          <div className="lc-arrow">→</div>
        </div>
        <div className="landing-card" onClick={onRegister} style={{background:cardBg,borderColor:border}}>
          <div className="lc-title">S'inscrire</div>
          <div className="lc-desc">Créer un compte organisateur gratuit</div>
          <div className="lc-arrow">→</div>
        </div>
      </div>
      <div className="landing-footer">
        Admin SwissOut ? <span onClick={onAdmin}>Accès dashboard →</span>
      </div>
    </div>
  );
}

// ── LOGIN ──
function Login({ onBack, onSuccess, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toasts, add } = useToasts();

  const submit = () => {
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      setLoading(false);
      if (email === "refuse@test.ch") { setError("Votre compte a été refusé. Contactez support@swissout.ch"); return; }
      if (email === "pending@test.ch") { onSuccess("pending", { nom: "Organisateur Test", email }); return; }
      onSuccess("dashboard", { nom: "Geneva Nightlife", email, organisation: "GNL Sàrl" });
      add("Connexion réussie !", "success");
    }, 1200);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-back" onClick={onBack}>← Retour</div>
        <div className="auth-logo">Swiss<em>Out</em></div>
        <div className="auth-title">Bon retour 👋</div>
        <div className="auth-sub">Connectez-vous à votre espace organisateur.</div>

        <div className="field">
          <label className="field-label">Email</label>
          <input className={`field-input${error ? " error" : ""}`} type="email" placeholder="info@monorganisation.ch" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div className="field">
          <label className="field-label">Mot de passe</label>
          <input className={`field-input${error ? " error" : ""}`} type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {error && <div className="field-error" style={{marginBottom:12}}>⚠ {error}</div>}

        <button className="auth-btn" onClick={submit} disabled={loading}>
          {loading ? <><div className="spinner" /> Connexion...</> : "Se connecter →"}
        </button>

        <div className="auth-link">Pas encore de compte ? <span onClick={onRegister}>S'inscrire</span></div>

        <div className="supabase-note">
          <strong>🔌 Intégration Supabase :</strong> Remplace ce mock par <code>supabase.auth.signInWithPassword({"{"} email, password {"}"}</code> pour une vraie authentification.
        </div>
      </div>
      <div className="toast-wrap">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>
    </div>
  );
}

// ── REGISTER ──
function Register({ onBack, onSuccess, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nom: "", organisation: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const strength = pwStrength(form.password);
  const strengthLabel = ["", "Faible", "Moyen", "Bon", "Fort"][strength];
  const strengthColor = ["", "var(--red)", "var(--orange)", "var(--orange)", "var(--green)"][strength];

  const validateStep1 = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.organisation.trim()) e.organisation = "Requis";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const validateStep2 = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (form.password.length < 8) e.password = "8 caractères minimum";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submitStep1 = () => { if (validateStep1()) setStep(2); };
  const submitStep2 = () => {
    if (!validateStep2()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess("pending", form); }, 1400);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-back" onClick={step === 2 ? () => setStep(1) : onBack}>← {step === 2 ? "Étape précédente" : "Retour"}</div>
        <div className="auth-logo">Swiss<em>Out</em></div>

        <div className="auth-tabs">
          <div className={`auth-tab${step === 1 ? " active" : ""}`}>1. Votre organisation</div>
          <div className={`auth-tab${step === 2 ? " active" : ""}`}>2. Vos accès</div>
        </div>

        {step === 1 && (
          <>
            <div className="auth-title">Créer un compte</div>
            <div className="auth-sub">Rejoignez SwissOut et publiez vos événements en Suisse.</div>
            <div className="field">
              <label className="field-label">Votre nom complet</label>
              <input className={`field-input${errors.nom ? " error" : ""}`} placeholder="Ex: Jean Dupont" value={form.nom} onChange={e => set("nom", e.target.value)} />
              {errors.nom && <div className="field-error">{errors.nom}</div>}
            </div>
            <div className="field">
              <label className="field-label">Nom de l'organisation</label>
              <input className={`field-input${errors.organisation ? " error" : ""}`} placeholder="Ex: Festival du Lac SA" value={form.organisation} onChange={e => set("organisation", e.target.value)} />
              {errors.organisation && <div className="field-error">{errors.organisation}</div>}
            </div>
            <button className="auth-btn" onClick={submitStep1}>Continuer →</button>
            <div className="auth-link">Déjà un compte ? <span onClick={onLogin}>Se connecter</span></div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-title">Vos identifiants</div>
            <div className="auth-sub">Ces informations serviront à vous connecter à l'espace organisateur.</div>
            <div className="field">
              <label className="field-label">Email professionnel</label>
              <input className={`field-input${errors.email ? " error" : ""}`} type="email" placeholder="info@monorganisation.ch" value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <div className="field">
              <label className="field-label">Mot de passe</label>
              <input className={`field-input${errors.password ? " error" : ""}`} type="password" placeholder="8 caractères minimum" value={form.password} onChange={e => set("password", e.target.value)} />
              {form.password && (
                <>
                  <div className="pw-strength">
                    {[1,2,3,4].map(i => <div key={i} className={`pw-bar${strength >= i ? (strength <= 1 ? " weak" : strength <= 3 ? " ok" : " strong") : ""}`} />)}
                  </div>
                  <div className="pw-label" style={{color: strengthColor}}>{strengthLabel}</div>
                </>
              )}
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="field">
              <label className="field-label">Confirmer le mot de passe</label>
              <input className={`field-input${errors.confirm ? " error" : ""}`} type="password" placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} onKeyDown={e => e.key === "Enter" && submitStep2()} />
              {errors.confirm && <div className="field-error">{errors.confirm}</div>}
            </div>
            <button className="auth-btn" onClick={submitStep2} disabled={loading}>
              {loading ? <><div className="spinner" /> Création du compte...</> : "Créer mon compte →"}
            </button>
            <div className="supabase-note">
              <strong>🔌 Supabase :</strong> Remplace par <code>supabase.auth.signUp({"{"} email, password, options: {"{"} data: {"{"} nom, organisation {"}"} {"}"} {"}"}</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── EN ATTENTE DE VALIDATION ──
function PendingScreen({ user, onLogout }) {
  return (
    <div className="pending-wrap">
      <div className="pending-card">
        <span className="pending-icon">⏳</span>
        <div className="pending-title">Compte en cours de vérification</div>
        <div className="pending-sub">
          Bonjour <strong>{user.nom}</strong>, votre demande a bien été reçue. Notre équipe SwissOut va examiner votre profil sous 24h.
        </div>
        <div className="pending-steps">
          <div className="pending-step">
            <div className="pending-step-num done">✓</div>
            <div className="pending-step-txt">Compte créé avec succès</div>
          </div>
          <div className="pending-step">
            <div className="pending-step-num active">2</div>
            <div className="pending-step-txt">Vérification par l'équipe SwissOut</div>
          </div>
          <div className="pending-step">
            <div className="pending-step-num wait">3</div>
            <div className="pending-step-txt">Accès à l'espace organisateur</div>
          </div>
        </div>
        <button className="pending-logout" onClick={onLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}

// ── ORG DASHBOARD ──
function OrgDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("events");
  return (
    <div className="dash">
      <div className="dash-side">
        <div className="dash-logo">Swiss<em>Out</em></div>
        <div className="dash-role">Espace Organisateur</div>
        <div className="dash-nav">
          {[["events","📅","Mes événements"],["submit","➕","Soumettre un event"],["stats","📊","Statistiques"]].map(([id,icon,label]) => (
            <div key={id} className={`dash-nav-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              <span className="ni">{icon}</span>{label}
            </div>
          ))}
        </div>
        <div className="dash-avatar">
          <div className="dash-av-icon">{user.nom[0]}</div>
          <div><div className="dash-av-name">{user.nom}</div><div className="dash-av-role">{user.organisation || "Organisateur"}</div></div>
          <div className="dash-logout-btn" onClick={onLogout} title="Déconnexion">✕</div>
        </div>
      </div>
      <div className="dash-main">
        <div className="dash-topbar">
          <div className="dash-title">{tab === "events" ? "Mes événements" : tab === "submit" ? "Soumettre un événement" : "Statistiques"}</div>
          {tab === "events" && <button className="dash-add-btn" onClick={() => setTab("submit")}>+ Nouvel événement</button>}
        </div>
        {tab === "events" && (
          <>
            <div className="dash-stats">
              <div className="dash-stat purple"><div className="ds-label">Total</div><div className="ds-val">2</div><div className="ds-sub">événements soumis</div></div>
              <div className="dash-stat green"><div className="ds-label">Approuvés</div><div className="ds-val">1</div><div className="ds-sub">publiés sur l'app</div></div>
              <div className="dash-stat orange"><div className="ds-label">En attente</div><div className="ds-val">1</div><div className="ds-sub">en cours de validation</div></div>
            </div>
            <div className="events-list">
              {MOCK_EVENTS.map(e => (
                <div key={e.id} className="event-card">
                  <div className="ec-icon" style={{background: e.color + "22"}}>{e.img}</div>
                  <div className="ec-info">
                    <div className="ec-title">{e.titre}</div>
                    <div className="ec-meta"><span>📅 {e.date}</span><span>🏷 {e.categorie}</span></div>
                  </div>
                  <div className={`ec-status ${e.statut}`}>{e.statut === "approuve" ? "✓ Approuvé" : "⏳ En attente"}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "submit" && <div style={{color:"var(--muted)",padding:"40px",textAlign:"center",background:"var(--s1)",borderRadius:16,border:"1px dashed var(--bd)"}}>
          <div style={{fontSize:40,marginBottom:12}}>📝</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Formulaire de soumission</div>
          <div style={{fontSize:13}}>Le formulaire organisateur complet est déjà intégré dans le back-office SwissOut.</div>
        </div>}
        {tab === "stats" && <div style={{color:"var(--muted)",padding:"40px",textAlign:"center",background:"var(--s1)",borderRadius:16,border:"1px dashed var(--bd)"}}>
          <div style={{fontSize:40,marginBottom:12}}>📊</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Analytics bientôt disponible</div>
          <div style={{fontSize:13}}>Vues, clics, participations — prochaine mise à jour.</div>
        </div>}
      </div>
    </div>
  );
}

// ── ADMIN : LISTE ORGANISATEURS ──
function AdminOrgList({ onBack }) {
  const [orgs, setOrgs] = useState(MOCK_ORGANISATEURS);
  const [filter, setFilter] = useState("all");
  const { toasts, add } = useToasts();

  const approve = (id) => { setOrgs(o => o.map(x => x.id === id ? {...x, statut:"approuve"} : x)); add("✅ Organisateur approuvé", "success"); };
  const reject = (id) => { setOrgs(o => o.map(x => x.id === id ? {...x, statut:"refuse"} : x)); add("❌ Organisateur refusé", "error"); };

  const shown = filter === "all" ? orgs : orgs.filter(o => o.statut === filter);
  const pending = orgs.filter(o => o.statut === "en_attente").length;

  return (
    <div className="admin-auth">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <div className="auth-back" style={{margin:0}} onClick={onBack}>← Retour</div>
      </div>
      <div className="admin-auth-title">Gestion des organisateurs</div>
      <div className="admin-auth-sub">Approuve ou refuse les demandes d'accès à l'espace organisateur.</div>

      <div className="org-stats">
        {[["Total",orgs.length],["En attente",pending],["Approuvés",orgs.filter(o=>o.statut==="approuve").length],["Refusés",orgs.filter(o=>o.statut==="refuse").length]].map(([l,v]) => (
          <div key={l} className="org-stat"><div className="os-label">{l}</div><div className="os-val">{v}</div></div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["all","Tous"],["en_attente","En attente"],["approuve","Approuvés"],["refuse","Refusés"]].map(([val,lbl]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{padding:"6px 14px",borderRadius:9,border:"1px solid",
              borderColor: filter===val ? "var(--accent)" : "var(--bd)",
              background: filter===val ? "rgba(124,58,237,0.1)" : "transparent",
              color: filter===val ? "var(--accent2)" : "var(--faint)",
              fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.5px"}}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="org-list">
        {shown.map((org, i) => (
          <div key={org.id} className="org-row" style={{animationDelay:`${i*0.05}s`}}>
            <div className="org-avatar">{org.nom[0]}</div>
            <div className="org-info">
              <div className="org-name">{org.nom}</div>
              <div className="org-meta">
                <span>🏢 {org.organisation}</span>
                <span>📧 {org.email}</span>
                <span>📅 {org.created_at}</span>
                <span>📊 {org.events} event{org.events !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="org-actions">
              {org.statut === "en_attente" && (
                <>
                  <button className="btn-approve" onClick={() => approve(org.id)}>✓ Approuver</button>
                  <button className="btn-reject" onClick={() => reject(org.id)}>✕ Refuser</button>
                </>
              )}
              {org.statut !== "en_attente" && (
                <span className={`status-chip ${org.statut}`}>
                  {org.statut === "approuve" ? "✓ Approuvé" : "✕ Refusé"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="toast-wrap">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}</div>
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("fr");

  const handleSuccess = (type, userData) => { setUser(userData); setView(type); };
  const logout = () => { setUser(null); setView("landing"); };

  return (
    <>
      <style>{S}</style>
      {view === "landing"   && <Landing onLogin={() => setView("login")} onRegister={() => setView("register")} onAdmin={() => setView("admin")} dark={dark} setDark={setDark} lang={lang} setLang={setLang} />}
      {view === "login"     && <Login onBack={() => setView("landing")} onSuccess={handleSuccess} onRegister={() => setView("register")} />}
      {view === "register"  && <Register onBack={() => setView("landing")} onSuccess={handleSuccess} onLogin={() => setView("login")} />}
      {view === "pending"   && <PendingScreen user={user} onLogout={logout} />}
      {view === "dashboard" && <OrgDashboard user={user} onLogout={logout} />}
      {view === "admin"     && <AdminOrgList onBack={() => setView("landing")} />}
    </>
  );
}
