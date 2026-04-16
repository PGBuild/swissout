import React, { useState, useEffect } from "react";
import { supabase, fetchStatsOrganisateur, fetchStats7Days } from './supabase';

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

  const submit = async () => {
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) { setError("Email ou mot de passe incorrect."); return; }
    onSuccess("dashboard", { 
      id: data.user.id,
      nom: data.user.email, 
      email: data.user.email, 
      organisation: "SwissOut" 
    });
    add("Connexion réussie !", "success");
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


// ── EVENT FORM ──
function EventForm({ user, onSuccess }) {
  const CATS = ["soirees","street-food","villages","concerts","sports","culture"];
  const CAT_LABELS = { "soirees":"Soirées","street-food":"Street Food","villages":"Fêtes","concerts":"Concerts","sports":"Sports","culture":"Culture" };

  const [form, setForm] = useState({
    titre:"", categorie:"", ville:"", adresse:"",
    date_debut:"", heure:"", description:"",
    tags:"", lien_billetterie:"", prix:"",
    instagram_url:"", facebook_url:"",
    recurrence:"once",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const validate = () => {
    const e = {};
    if (!form.titre.trim()) e.titre = true;
    if (!form.categorie) e.categorie = true;
    if (!form.ville.trim()) e.ville = true;
    if (!form.date_debut) e.date_debut = true;
    if (!form.heure) e.heure = true;
    if (!form.description.trim()) e.description = true;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    // Auto-approve after 24h — set statut to en_attente, with auto_approve_at
    const autoApproveAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    try {
      const { supabase } = await import('./supabase');

      // Geocode the city
      let lat = null, lng = null;
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.ville + ', Suisse')}&format=json&limit=1`);
        const geoData = await geo.json();
        if (geoData[0]) { lat = parseFloat(geoData[0].lat); lng = parseFloat(geoData[0].lon); }
      } catch(e) {}

      // Upload cover image
      let coverUrl = null;
      if (coverFile) {
        try {
          const fname = `${Date.now()}-${coverFile.name.replace(/[^a-z0-9.]/gi,'_')}`;
          const { error: storErr } = await supabase.storage.from('event-covers').upload(fname, coverFile, { contentType: coverFile.type });
          if (!storErr) {
            const { data: { publicUrl } } = supabase.storage.from('event-covers').getPublicUrl(fname);
            coverUrl = publicUrl;
          }
        } catch {}
      }

      const baseRow = {
        titre: form.titre, categorie: form.categorie,
        ville: form.ville, adresse: form.adresse || null,
        latitude: lat || 46.9481, longitude: lng || 7.4474,
        heure: form.heure, description: form.description,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        lien_billetterie: form.lien_billetterie || null, prix: form.prix || null,
        instagram_url: form.instagram_url || null, facebook_url: form.facebook_url || null,
        cover_url: coverUrl, recurrence: form.recurrence,
        statut: 'en_attente', auto_approve_at: autoApproveAt,
        organisateur_id: user?.id || null,
      };

      const { error } = await supabase.from('evenements').insert({ ...baseRow, date_debut: form.date_debut });
      if (error) throw error;

      // Créer les occurrences récurrentes sur 3 mois
      if (form.recurrence !== 'once') {
        const occurrences = [];
        const start = new Date(form.date_debut);
        const endDate = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
        let cur = new Date(start);
        while (true) {
          form.recurrence === 'weekly' ? cur.setDate(cur.getDate() + 7) : cur.setMonth(cur.getMonth() + 1);
          if (cur > endDate) break;
          occurrences.push({ ...baseRow, date_debut: cur.toISOString().split('T')[0] });
        }
        if (occurrences.length) await supabase.from('evenements').insert(occurrences);
      }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccess(); }, 2500);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = (k) => ({
    width:"100%", padding:"11px 14px", borderRadius:12,
    background:"var(--s2)", border:`1px solid ${errors[k] ? "var(--red)" : "var(--bd)"}`,
    fontFamily:"'DM Sans',sans-serif", fontSize:13,
    color:"var(--txt)", outline:"none",
    WebkitAppearance:"none",
  });

  const labelStyle = {
    fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase",
    color:"var(--faint)", fontFamily:"'DM Mono',monospace", display:"block", marginBottom:5,
  };

  if (success) return (
    <div style={{padding:"60px 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:16}}>🎉</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.4px",marginBottom:8}}>Événement soumis !</div>
      <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.7}}>
        Votre événement sera publié automatiquement dans <strong>24h</strong>.<br/>
        Un admin peut également le valider ou le refuser avant.
      </div>
    </div>
  );

  return (
    <div style={{paddingBottom:40}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.4px",marginBottom:4}}>Créer un événement</div>
        <div style={{fontSize:13,color:"var(--muted)"}}>Il sera publié automatiquement après 24h ou validé par un admin.</div>
      </div>

      {/* INFOS PRINCIPALES */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:14}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>📋 Informations</div>

        <div style={{marginBottom:14}}>
          <label style={labelStyle}>Titre de l'événement *</label>
          <input style={inputStyle("titre")} placeholder="Ex: Soirée Rooftop Bern" value={form.titre} onChange={e => set("titre", e.target.value)} />
        </div>

        <div style={{marginBottom:14}}>
          <label style={labelStyle}>Catégorie *</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {CATS.map(c => (
              <div key={c} onClick={() => set("categorie", c)}
                style={{padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,
                  background: form.categorie===c ? "var(--accent)" : "var(--s2)",
                  border: `1px solid ${form.categorie===c ? "var(--accent)" : errors.categorie ? "var(--red)" : "var(--bd)"}`,
                  color: form.categorie===c ? "#fff" : "var(--muted)",transition:"all 0.15s"}}>
                {CAT_LABELS[c]}
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div>
            <label style={labelStyle}>Ville *</label>
            <input style={inputStyle("ville")} placeholder="Ex: Genève" value={form.ville} onChange={e => set("ville", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Adresse</label>
            <input style={inputStyle("adresse")} placeholder="Rue, numéro" value={form.adresse} onChange={e => set("adresse", e.target.value)} />
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={labelStyle}>Date *</label>
            <input type="date" style={inputStyle("date_debut")} value={form.date_debut} onChange={e => set("date_debut", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Heure *</label>
            <input type="time" style={inputStyle("heure")} value={form.heure} onChange={e => set("heure", e.target.value)} />
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:14}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>✍️ Description</div>
        <div style={{marginBottom:14}}>
          <label style={labelStyle}>Description * (max 200 caractères)</label>
          <textarea style={{...inputStyle("description"),resize:"vertical",minHeight:80,lineHeight:1.5}}
            placeholder="Décrivez votre événement..." maxLength={200}
            value={form.description} onChange={e => set("description", e.target.value)} />
          <div style={{fontSize:10,color:"var(--faint)",textAlign:"right",marginTop:3,fontFamily:"monospace"}}>{form.description.length}/200</div>
        </div>
        <div>
          <label style={labelStyle}>Tags (séparés par des virgules)</label>
          <input style={inputStyle("tags")} placeholder="Ex: Gratuit, Famille, Outdoor" value={form.tags} onChange={e => set("tags", e.target.value)} />
        </div>
      </div>

      {/* BILLETTERIE */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:14}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>🎟️ Billetterie</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={labelStyle}>Lien billetterie</label>
            <input style={inputStyle("lien_billetterie")} placeholder="https://..." value={form.lien_billetterie} onChange={e => set("lien_billetterie", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Prix</label>
            <input style={inputStyle("prix")} placeholder="Ex: Gratuit / 20 CHF" value={form.prix} onChange={e => set("prix", e.target.value)} />
          </div>
        </div>
      </div>

      {/* PHOTO DE COUVERTURE */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:14}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>🖼️ Photo de couverture</div>
        {coverPreview && (
          <div style={{marginBottom:12,position:"relative"}}>
            <img src={coverPreview} alt="Aperçu" style={{width:"100%",height:160,objectFit:"cover",borderRadius:12}} />
            <button onClick={() => { setCoverFile(null); setCoverPreview(null); }}
              style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:8,color:"#fff",padding:"4px 8px",cursor:"pointer",fontSize:12}}>
              ✕ Retirer
            </button>
          </div>
        )}
        <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",borderRadius:12,border:"2px dashed var(--bd2)",cursor:"pointer",fontSize:13,color:"var(--muted)",transition:"all 0.2s"}}>
          <input type="file" accept="image/*" style={{display:"none"}} onChange={e => {
            const f = e.target.files[0];
            if (!f) return;
            setCoverFile(f);
            setCoverPreview(URL.createObjectURL(f));
          }} />
          {coverFile ? "✓ Photo sélectionnée" : "Choisir une image (JPG, PNG, WebP)"}
        </label>
      </div>

      {/* RÉCURRENCE */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:14}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>🔁 Récurrence</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["once","Une seule fois"],["weekly","Chaque semaine"],["monthly","Chaque mois"]].map(([val,label]) => (
            <div key={val} onClick={() => set("recurrence", val)}
              style={{padding:"8px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s",
                background: form.recurrence===val ? "var(--accent)" : "var(--s2)",
                border: `1px solid ${form.recurrence===val ? "var(--accent)" : "var(--bd)"}`,
                color: form.recurrence===val ? "#fff" : "var(--muted)"}}>
              {label}
            </div>
          ))}
        </div>
        {form.recurrence !== 'once' && (
          <div style={{marginTop:10,fontSize:11,color:"var(--faint)",fontFamily:"monospace"}}>
            {form.recurrence === 'weekly' ? "Crée ~12 événements sur 3 mois" : "Crée 3 événements sur 3 mois"}
          </div>
        )}
      </div>

      {/* RÉSEAUX SOCIAUX */}
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:18,padding:"20px 20px",marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>📱 Réseaux sociaux</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={labelStyle}>Instagram</label>
            <input style={inputStyle("instagram_url")} placeholder="https://instagram.com/..." value={form.instagram_url} onChange={e => set("instagram_url", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Facebook</label>
            <input style={inputStyle("facebook_url")} placeholder="https://facebook.com/..." value={form.facebook_url} onChange={e => set("facebook_url", e.target.value)} />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{width:"100%",padding:"15px",borderRadius:14,border:"none",
          background:"var(--accent)",color:"#fff",
          fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,
          cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,
          transition:"all 0.2s",letterSpacing:"0.3px"}}>
        {loading ? "Envoi en cours..." : "Soumettre l'événement →"}
      </button>

      <div style={{textAlign:"center",fontSize:11,color:"var(--faint)",marginTop:10,fontFamily:"monospace"}}>
        Publication automatique dans 24h · Validation possible par un admin
      </div>
    </div>
  );
}


// ── ORG ANALYTICS ──
function OrgAnalytics({ user }) {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [chart, setChart] = useState({});
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState("views");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data: evts } = await supabase
          .from('evenements')
          .select('id, titre, categorie, date_debut, statut')
          .eq('organisateur_id', user?.id);
        if (evts && evts.length > 0) {
          setEvents(evts);
          const ids = evts.map(e => e.id);
          const [s, c] = await Promise.all([fetchStatsOrganisateur(ids), fetchStats7Days(ids)]);
          setStats(s);
          setChart(c);
        }
      } catch(e) { console.error(e); }
      setLoading(false);
    }
    if (user?.id) load();
  }, [user]);

  const totals = Object.values(stats).reduce((acc, s) => ({
    views: acc.views + (s.views||0),
    clicks: acc.clicks + (s.clicks||0),
    saves: acc.saves + (s.saves||0),
    participations: acc.participations + (s.participations||0),
  }), { views:0, clicks:0, saves:0, participations:0 });

  const METRICS = ["views","clicks","saves","participations"];
  const LABELS = { views:"Vues", clicks:"Clics", saves:"Sauvés", participations:"Participations" };
  const COLORS = { views:"#7C3AED", clicks:"#0A84FF", saves:"#FF9F0A", participations:"#30D158" };

  const maxVal = Math.max(...events.map(e => stats[e.id]?.[metric]||0), 1);

  if (loading) return (
    <div style={{padding:"60px",textAlign:"center",color:"var(--muted)"}}>
      <div style={{fontSize:32,marginBottom:12}}>⏳</div>
      <div>Chargement des statistiques...</div>
    </div>
  );

  if (events.length === 0) return (
    <div style={{padding:"60px",textAlign:"center",color:"var(--muted)"}}>
      <div style={{fontSize:32,marginBottom:12}}>📊</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Aucun événement</div>
      <div style={{fontSize:13}}>Créez votre premier événement pour voir vos statistiques.</div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.4px",marginBottom:4}}>Mes statistiques</div>
        <div style={{fontSize:13,color:"var(--muted)"}}>Données en temps réel pour vos événements</div>
      </div>

      {/* STAT CARDS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Vues totales", val:totals.views, icon:"👁", color:"#7C3AED"},
          {label:"Clics", val:totals.clicks, icon:"🖱", color:"#0A84FF"},
          {label:"Sauvegardés", val:totals.saves, icon:"♥", color:"#FF9F0A"},
          {label:"Participations", val:totals.participations, icon:"✓", color:"#30D158"},
        ].map((s,i) => (
          <div key={i} style={{background:"var(--s2)",borderRadius:16,padding:"16px",position:"relative",overflow:"hidden",border:"1px solid var(--bd)"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:s.color}} />
            <div style={{fontSize:16,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--faint)",fontFamily:"monospace",marginBottom:4}}>{s.label}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:"-1px",color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* 7-DAY CHART */}
      {Object.keys(chart).length > 0 && (() => {
        const chartData = Object.entries(chart).map(([day, c]) => ({
          day: new Date(day + 'T12:00:00').toLocaleDateString('fr', { weekday: 'short' }),
          val: c[metric] || 0,
        }));
        const maxV = Math.max(...chartData.map(d => d.val), 1);
        return (
          <div style={{background:"var(--s2)",border:"1px solid var(--bd)",borderRadius:16,padding:"16px",marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--faint)",fontFamily:"monospace",marginBottom:14}}>
              Évolution 7 jours — {LABELS[metric]}
            </div>
            <div style={{display:"flex",gap:6,height:80,alignItems:"flex-end"}}>
              {chartData.map((d, i) => (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end"}}>
                    <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:COLORS[metric],opacity:0.85,
                      height:`${Math.max((d.val/maxV)*100,4)}%`,transition:"height 0.5s ease",minHeight:d.val>0?4:2}} />
                  </div>
                  <div style={{fontSize:9,color:"var(--faint)",textTransform:"uppercase",fontFamily:"monospace"}}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* METRIC SELECTOR */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {METRICS.map(m => (
          <button key={m} onClick={() => setMetric(m)}
            style={{padding:"6px 14px",borderRadius:20,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",
              borderColor: metric===m ? "var(--accent)" : "var(--bd)",
              background: metric===m ? "rgba(124,58,237,0.1)" : "transparent",
              color: metric===m ? "var(--accent)" : "var(--faint)",
              fontFamily:"monospace",transition:"all 0.15s"}}>
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* EVENTS LIST */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {events.map((e, i) => {
          const s = stats[e.id] || {};
          const val = s[metric] || 0;
          const pct = maxVal > 0 ? (val/maxVal)*100 : 0;
          return (
            <div key={e.id} style={{background:"var(--s2)",borderRadius:14,padding:"14px 16px",border:"1px solid var(--bd)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{e.titre}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:COLORS[metric]}}>{val}</div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:10}}>
                <span style={{fontSize:10,color:"var(--faint)",fontFamily:"monospace"}}>📅 {e.date_debut}</span>
                <span style={{fontSize:10,color:"var(--faint)",fontFamily:"monospace",padding:"1px 8px",background:"var(--s3)",borderRadius:6}}>{e.statut}</span>
              </div>
              <div style={{height:4,background:"var(--bd2)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:COLORS[metric],borderRadius:2,transition:"width 0.8s ease"}} />
              </div>
              <div style={{display:"flex",gap:16,marginTop:8}}>
                {METRICS.map(m => (
                  <span key={m} style={{fontSize:10,color:"var(--faint)",fontFamily:"monospace"}}>
                    {LABELS[m][0]} {s[m]||0}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── QR SCANNER ──
function QRScanner() {
  const [result, setResult] = useState(null);
  const [manual, setManual] = useState("");
  const [cameraErr, setCameraErr] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const parse = (raw) => {
    const p = raw.split('|');
    if (p[0] !== 'SWISSOUT' || p.length < 6) return null;
    return { eventId:p[1], eventTitle:p[2], date:p[3], name:p[4], ticketId:p[5] };
  };

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setScanning(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanning(true);
      if ('BarcodeDetector' in window) {
        const det = new window.BarcodeDetector({ formats:['qr_code'] });
        const scan = async () => {
          try {
            const r = await det.detect(videoRef.current);
            if (r.length) { setResult(parse(r[0].rawValue)); stopCamera(); return; }
          } catch {}
          rafRef.current = requestAnimationFrame(scan);
        };
        rafRef.current = requestAnimationFrame(scan);
      } else {
        setCameraErr(true);
      }
    } catch { setCameraErr(true); }
  };

  React.useEffect(() => () => stopCamera(), []);

  const info = result;
  const inp = { width:"100%", padding:"11px 14px", borderRadius:12, background:"var(--s2)", border:"1px solid var(--bd)", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"var(--txt)", outline:"none" };

  return (
    <div style={{maxWidth:480}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.4px",marginBottom:4}}>Scanner un billet</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Vérifiez les billets QR des participants</div>

      {/* CAMERA */}
      <div style={{background:"var(--s2)",borderRadius:16,overflow:"hidden",marginBottom:16,position:"relative",minHeight:180}}>
        <video ref={videoRef} style={{width:"100%",display:scanning?"block":"none",borderRadius:16}} />
        {!scanning && !cameraErr && (
          <div style={{padding:"40px",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>📷</div>
            <button onClick={startCamera}
              style={{padding:"12px 24px",borderRadius:12,border:"none",background:"var(--accent)",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
              Activer la caméra
            </button>
          </div>
        )}
        {scanning && (
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)"}}>
            <button onClick={stopCamera} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:12,cursor:"pointer"}}>
              Arrêter
            </button>
          </div>
        )}
        {cameraErr && (
          <div style={{padding:"24px",textAlign:"center",color:"var(--muted)",fontSize:13}}>
            Caméra non disponible. Utilisez la saisie manuelle.
          </div>
        )}
      </div>

      {/* MANUAL */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--faint)",display:"block",marginBottom:6,fontFamily:"monospace"}}>
          Saisie manuelle du code
        </label>
        <div style={{display:"flex",gap:8}}>
          <input style={inp} value={manual} onChange={e => setManual(e.target.value)} placeholder="SWISSOUT|eventId|..." />
          <button onClick={() => setResult(parse(manual))}
            style={{padding:"11px 18px",borderRadius:12,border:"none",background:"var(--accent)",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>
            Vérifier
          </button>
        </div>
      </div>

      {/* RESULT */}
      {result === null && manual.length > 5 && (
        <div style={{padding:"16px",borderRadius:14,background:"rgba(255,59,47,0.1)",border:"1px solid rgba(255,59,47,0.2)",color:"#FF3B2F",fontSize:13,fontWeight:600}}>
          ✕ Code invalide — Ce n'est pas un billet SwissOut.
        </div>
      )}
      {result && (
        <div style={{padding:"20px",borderRadius:14,background:"rgba(48,209,88,0.1)",border:"1px solid rgba(48,209,88,0.25)"}}>
          <div style={{color:"#30D158",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:12}}>✓ Billet valide</div>
          {[["Participant", result.name], ["Événement", result.eventTitle], ["Date", result.date], ["ID billet", result.ticketId?.slice(0,8)+"..."]].map(([l,v]) => (
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(48,209,88,0.15)",fontSize:13}}>
              <span style={{color:"var(--muted)"}}>{l}</span>
              <span style={{fontWeight:600}}>{v}</span>
            </div>
          ))}
          <button onClick={() => { setResult(null); setManual(""); }}
            style={{marginTop:14,width:"100%",padding:"11px",borderRadius:12,border:"none",background:"rgba(48,209,88,0.2)",color:"#30D158",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            Scanner un autre billet
          </button>
        </div>
      )}
    </div>
  );
}

// ── ORG DASHBOARD ──
function OrgDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("events");
  const [myEvents, setMyEvents] = useState([]);
  const [sharingEvent, setSharingEvent] = useState(null);
  const [storyCopied, setStoryCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    async function loadMyEvents() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('evenements')
        .select('id, titre, categorie, date_debut, statut, ville')
        .eq('organisateur_id', user.id)
        .order('date_debut', { ascending: false });
      if (data) setMyEvents(data);
    }
    loadMyEvents();
  }, [user]);

  const approuves = myEvents.filter(e => e.statut === 'approuve').length;
  const enAttente = myEvents.filter(e => e.statut === 'en_attente').length;
  return (
    <div className="dash">
      <div className="dash-side">
        <div className="dash-logo">Swiss<em>Out</em></div>
        <div className="dash-role">Espace Organisateur</div>
        <div className="dash-nav">
          {[["events","📅","Mes événements"],["submit","➕","Soumettre un event"],["stats","📊","Statistiques"],["scanner","📷","Scanner"]].map(([id,icon,label]) => (
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
          <div className="dash-title">{tab === "events" ? "Mes événements" : tab === "submit" ? "Soumettre un événement" : tab === "stats" ? "Statistiques" : "Scanner billets"}</div>
          {tab === "events" && <button className="dash-add-btn" onClick={() => setTab("submit")}>+ Nouvel événement</button>}
        </div>
        {tab === "events" && (
          <>
            <div className="dash-stats">
              <div className="dash-stat purple"><div className="ds-label">Total</div><div className="ds-val">{myEvents.length}</div><div className="ds-sub">événements soumis</div></div>
              <div className="dash-stat green"><div className="ds-label">Approuvés</div><div className="ds-val">{approuves}</div><div className="ds-sub">publiés sur l'app</div></div>
              <div className="dash-stat orange"><div className="ds-label">En attente</div><div className="ds-val">{enAttente}</div><div className="ds-sub">en cours de validation</div></div>
            </div>

            {/* WIDGET EMBED */}
            <div style={{background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:6,color:"var(--accent)"}}>
                &lt;/&gt; Widget pour votre site web
              </div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>Intégrez vos événements SwissOut avec cet iframe :</div>
              <div style={{background:"var(--s3)",borderRadius:10,padding:"10px 12px",fontFamily:"monospace",fontSize:11,color:"var(--txt)",wordBreak:"break-all",marginBottom:10,lineHeight:1.6}}>
                {`<iframe src="https://swissout.vercel.app/embed?org=${user?.id}" width="100%" height="600" frameborder="0" style="border-radius:12px"></iframe>`}
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(`<iframe src="https://swissout.vercel.app/embed?org=${user?.id}" width="100%" height="600" frameborder="0" style="border-radius:12px"></iframe>`);
                setEmbedCopied(true); setTimeout(() => setEmbedCopied(false), 2000);
              }} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(124,58,237,0.3)",background:"rgba(124,58,237,0.1)",color:"var(--accent)",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {embedCopied ? "✓ Copié !" : "Copier le code"}
              </button>
              <a href={`https://swissout.vercel.app/embed?org=${user?.id}`} target="_blank" rel="noopener noreferrer"
                style={{marginLeft:8,fontSize:11,color:"var(--muted)",textDecoration:"none"}}>
                Aperçu →
              </a>
            </div>

            <div className="events-list">
              {(myEvents.length > 0 ? myEvents : []).map(e => {
                const isOpen = sharingEvent === e.id;
                const appUrl = "https://swissout.vercel.app";
                const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
                const igUrl = `https://www.instagram.com/`;
                const storyText = `📅 ${e.titre}\n🗓 ${e.date_debut}${e.ville ? `\n📍 ${e.ville}` : ''}\n\nDisponible sur SwissOut\nswissout.vercel.app`;
                return (
                  <div key={e.id}>
                    <div className="event-card">
                      <div className="ec-icon" style={{background:"rgba(124,58,237,0.1)"}}>📅</div>
                      <div className="ec-info">
                        <div className="ec-title">{e.titre}</div>
                        <div className="ec-meta"><span>📅 {e.date_debut}</span><span>🏷 {e.categorie}</span></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                        <div className={`ec-status ${e.statut}`}>{e.statut === "approuve" ? "✓ Approuvé" : "⏳ En attente"}</div>
                        <button onClick={() => setSharingEvent(isOpen ? null : e.id)}
                          style={{padding:"5px 10px",borderRadius:8,border:"1px solid var(--bd2)",background:"transparent",color:"var(--muted)",fontSize:11,cursor:"pointer",fontFamily:"monospace",whiteSpace:"nowrap"}}>
                          {isOpen ? "✕" : "Partager"}
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{background:"var(--s2)",border:"1px solid var(--bd)",borderRadius:12,padding:"14px 16px",marginTop:-2,marginBottom:8}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:12,color:"var(--muted)"}}>PARTAGER CET ÉVÉNEMENT</div>
                        <div style={{display:"flex",gap:8,marginBottom:12}}>
                          <a href={fbUrl} target="_blank" rel="noopener noreferrer"
                            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,background:"rgba(24,119,242,0.1)",border:"1px solid rgba(24,119,242,0.25)",color:"#1877f2",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"'Syne',sans-serif"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            Facebook
                          </a>
                          <a href={igUrl} target="_blank" rel="noopener noreferrer"
                            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,background:"rgba(225,48,108,0.08)",border:"1px solid rgba(225,48,108,0.2)",color:"#e1306c",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"'Syne',sans-serif"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
                            Instagram
                          </a>
                        </div>
                        <div style={{fontSize:11,color:"var(--faint)",marginBottom:6,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.5px"}}>Texte pour Story / Légende :</div>
                        <div style={{background:"var(--s3)",borderRadius:10,padding:"10px 12px",fontFamily:"monospace",fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.7,marginBottom:8}}>
                          {storyText}
                        </div>
                        <button onClick={() => {
                          navigator.clipboard.writeText(storyText);
                          setStoryCopied(true); setTimeout(() => setStoryCopied(false), 2000);
                        }} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px solid var(--bd2)",background:"transparent",color:"var(--txt)",fontFamily:"monospace",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                          {storyCopied ? "✓ Copié !" : "Copier le texte"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {tab === "submit" && <EventForm user={user} onSuccess={() => setTab("events")} />}
        {tab === "stats" && <OrgAnalytics user={user} />}
        {tab === "scanner" && <QRScanner />}
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
