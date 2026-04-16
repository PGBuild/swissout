import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Embed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const orgId = new URLSearchParams(window.location.search).get('org');

  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    supabase.from('evenements')
      .select('id, titre, date_debut, heure, ville, categorie, description, prix, lien_billetterie, cover_url')
      .eq('organisateur_id', orgId)
      .eq('statut', 'approuve')
      .order('date_debut', { ascending: true })
      .then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, [orgId]);

  const CAT_COLORS = {
    soirees:'#7C3AED', concerts:'#BF5AF2', culture:'#0A84FF',
    sports:'#30D158', 'street-food':'#FF9F0A', villages:'#FF6B35',
  };

  const s = {
    body: { margin:0, fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#fafafa', color:'#111' },
    header: { background:'#7C3AED', color:'#fff', padding:'12px 16px', display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:700 },
    card: { background:'#fff', border:'1px solid #e8e8e8', borderRadius:12, overflow:'hidden', marginBottom:10 },
    img: { width:'100%', height:120, objectFit:'cover', display:'block' },
    inner: { padding:'12px 14px' },
    badge: (cat) => ({ display:'inline-block', padding:'2px 8px', borderRadius:6, background: (CAT_COLORS[cat]||'#666')+'22', color: CAT_COLORS[cat]||'#666', fontSize:10, fontWeight:700, marginBottom:6 }),
    title: { fontWeight:700, fontSize:15, marginBottom:4 },
    meta: { fontSize:11, color:'#888', marginBottom:6 },
    desc: { fontSize:12, color:'#555', lineHeight:1.5, marginBottom:8 },
    btn: { display:'inline-block', padding:'7px 14px', borderRadius:8, background:'#7C3AED', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none' },
    footer: { textAlign:'center', padding:'10px', fontSize:10, color:'#bbb', borderTop:'1px solid #f0f0f0', marginTop:4 },
  };

  if (!orgId) return <div style={{ padding:24, color:'#888', fontSize:13 }}>Paramètre <code>?org=ID</code> manquant.</div>;
  if (loading) return <div style={{ padding:24, textAlign:'center', color:'#888' }}>Chargement...</div>;
  if (!events.length) return <div style={{ padding:24, textAlign:'center', color:'#888', fontSize:13 }}>Aucun événement à venir.</div>;

  return (
    <div style={s.body}>
      <div style={s.header}>
        <span style={{ fontStyle:'italic' }}>Swiss<em style={{color:'#c4b5fd'}}>Out</em></span>
        <span style={{ opacity:0.7, fontWeight:400 }}>— Événements à venir</span>
      </div>
      <div style={{ padding:'10px 10px 0' }}>
        {events.map(e => (
          <div key={e.id} style={s.card}>
            {e.cover_url && <img src={e.cover_url} alt="" style={s.img} />}
            <div style={s.inner}>
              <div style={s.badge(e.categorie)}>{e.categorie}</div>
              <div style={s.title}>{e.titre}</div>
              <div style={s.meta}>📅 {e.date_debut} · {e.heure} &nbsp;|&nbsp; 📍 {e.ville}</div>
              <div style={s.desc}>{e.description?.slice(0, 100)}{e.description?.length > 100 ? '…' : ''}</div>
              {e.lien_billetterie && (
                <a href={e.lien_billetterie} target="_blank" rel="noopener noreferrer" style={s.btn}>
                  Billets →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={s.footer}>
        Propulsé par <a href="https://swissout.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color:'#7C3AED', textDecoration:'none', fontWeight:700 }}>SwissOut</a>
      </div>
    </div>
  );
}
