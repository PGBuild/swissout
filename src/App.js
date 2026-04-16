import { useState, useEffect } from "react";
import { fetchEvenements, trackEvent, fetchReviews, submitReview, subscribeNewsletter, unsubscribeNewsletter, fetchSourceStats } from './supabase';

// ── TRANSLATIONS ──
const T = {
  fr: {
    tagline: "Découvre la Suisse autour de toi",
    iAm: "Je suis...",
    participant: "Participant",
    participantSub: "Je cherche des soirées et événements",
    organizer: "Organisateur",
    organizerSub: "Je publie mes événements sur SwissOut",
    yourName: "Comment tu t'appelles ?",
    namePlaceholder: "Ton prénom...",
    yourAge: "Ton âge",
    yourGender: "Tu es...",
    male: "Homme",
    female: "Femme",
    discover: "Découvrir les événements →",
    chooseSpace: "Choisir un espace →",
    continueWithout: "Continuer sans s'inscrire",
    goOrg: "Accéder à l'espace organisateur →",
    hello: "Bonjour",
    rayon: "Rayon",
    all: "Tout",
    around: "Autour de toi",
    events: "events",
    event: "event",
    nothingHere: "Rien par ici",
    nothingHereSub: "Augmente le rayon ou change de catégorie.",
    myEvents: "Mes events ♥",
    savedEvents: "événement",
    savedEventsSub: "sauvegardé",
    emptyList: "Liste vide",
    emptyListSub: "Explore et sauvegarde les events qui t'intéressent.",
    save: "♡ Sauver",
    saved: "♥ Sauvé",
    seeEvent: "Voir l'event →",
    goThere: "✓ J'y participe",
    goThereActive: "✓ J'y vais !",
    maybe: "~ Peut-être",
    removeSaved: "♥ Retirer des sauvegardés",
    addSaved: "♡ Sauvegarder cet événement",
    close: "Fermer",
    explore: "Explorer",
    filter: "Filtre",
    today: "Aujourd'hui",
    thisWeek: "Semaine",
    thisMonth: "Mois",
    threeMonths: "3 mois",
    allTime: "Tout",
    orgSpace: "Espace Organisateur",
    orgDesc: "Connecte-toi ou crée ton compte pour publier tes événements sur SwissOut.",
    goOrgBtn: "Aller vers l'espace organisateur →",
    backHome: "← Retour à l'accueil",
    activateGps: "Activer la géolocalisation",
    locating: "Localisation en cours...",
    gpsActive: "Position GPS",
    gpsError: "GPS non dispo · Moutier (fallback)",
    retry: "Réessayer",
    search: "Rechercher un événement, une ville...",
    profile: "Profil",
    share: "Partager",
    copyLink: "Copier le lien",
    copied: "Copié !",
    whatsapp: "WhatsApp",
    notifEnable: "Activer les rappels push",
    notifActive: "✓ Rappels activés",
    editProfile: "Modifier mon profil",
    saveProfile: "Enregistrer",
  },
  en: {
    tagline: "Discover Switzerland around you",
    iAm: "I am...",
    participant: "Participant",
    participantSub: "I'm looking for events & parties",
    organizer: "Organizer",
    organizerSub: "I publish my events on SwissOut",
    yourName: "What's your name?",
    namePlaceholder: "Your first name...",
    yourAge: "Your age",
    yourGender: "You are...",
    male: "Male",
    female: "Female",
    discover: "Discover events →",
    chooseSpace: "Choose a space →",
    continueWithout: "Continue without signing up",
    goOrg: "Go to organizer space →",
    hello: "Hello",
    rayon: "Radius",
    all: "All",
    around: "Around you",
    events: "events",
    event: "event",
    nothingHere: "Nothing here",
    nothingHereSub: "Increase the radius or change category.",
    myEvents: "My events ♥",
    savedEvents: "event",
    savedEventsSub: "saved",
    emptyList: "Empty list",
    emptyListSub: "Explore and save events you're interested in.",
    save: "♡ Save",
    saved: "♥ Saved",
    seeEvent: "See event →",
    goThere: "✓ I'll attend",
    goThereActive: "✓ I'm going!",
    maybe: "~ Maybe",
    removeSaved: "♥ Remove from saved",
    addSaved: "♡ Save this event",
    close: "Close",
    explore: "Explore",
    filter: "Filter",
    today: "Today",
    thisWeek: "Week",
    thisMonth: "Month",
    threeMonths: "3 months",
    allTime: "All",
    orgSpace: "Organizer Space",
    orgDesc: "Login or create an account to publish your events on SwissOut.",
    goOrgBtn: "Go to organizer space →",
    backHome: "← Back to home",
    activateGps: "Enable location",
    locating: "Locating...",
    gpsActive: "GPS active",
    gpsError: "GPS unavailable · Moutier (fallback)",
    retry: "Retry",
    search: "Search event, city...",
    profile: "Profile",
    share: "Share",
    copyLink: "Copy link",
    copied: "Copied!",
    whatsapp: "WhatsApp",
    notifEnable: "Enable push reminders",
    notifActive: "✓ Reminders on",
    editProfile: "Edit profile",
    saveProfile: "Save",
  },
  de: {
    tagline: "Entdecke die Schweiz um dich herum",
    iAm: "Ich bin...",
    participant: "Teilnehmer",
    participantSub: "Ich suche Events und Partys",
    organizer: "Veranstalter",
    organizerSub: "Ich veröffentliche Events auf SwissOut",
    yourName: "Wie heisst du?",
    namePlaceholder: "Dein Vorname...",
    yourAge: "Dein Alter",
    yourGender: "Du bist...",
    male: "Mann",
    female: "Frau",
    discover: "Events entdecken →",
    chooseSpace: "Bereich wählen →",
    continueWithout: "Ohne Registrierung fortfahren",
    goOrg: "Zum Veranstalterbereich →",
    hello: "Hallo",
    rayon: "Radius",
    all: "Alle",
    around: "In deiner Nähe",
    events: "Events",
    event: "Event",
    nothingHere: "Nichts in der Nähe",
    nothingHereSub: "Radius erhöhen oder Kategorie wechseln.",
    myEvents: "Meine Events ♥",
    savedEvents: "Event",
    savedEventsSub: "gespeichert",
    emptyList: "Liste leer",
    emptyListSub: "Entdecke und speichere interessante Events.",
    save: "♡ Speichern",
    saved: "♥ Gespeichert",
    seeEvent: "Event ansehen →",
    goThere: "✓ Ich nehme teil",
    goThereActive: "✓ Ich gehe hin!",
    maybe: "~ Vielleicht",
    removeSaved: "♥ Aus Gespeicherten entfernen",
    addSaved: "♡ Event speichern",
    close: "Schliessen",
    explore: "Erkunden",
    filter: "Filter",
    today: "Heute",
    thisWeek: "Woche",
    thisMonth: "Monat",
    threeMonths: "3 Monate",
    allTime: "Alle",
    orgSpace: "Veranstalterbereich",
    orgDesc: "Melde dich an oder erstelle ein Konto um Events zu veröffentlichen.",
    goOrgBtn: "Zum Veranstalterbereich →",
    backHome: "← Zurück",
    activateGps: "Standort aktivieren",
    locating: "Standort wird ermittelt...",
    gpsActive: "GPS aktiv",
    gpsError: "GPS nicht verfügbar · Moutier",
    retry: "Erneut versuchen",
    search: "Event oder Stadt suchen...",
    profile: "Profil",
    share: "Teilen",
    copyLink: "Link kopieren",
    copied: "Kopiert!",
    whatsapp: "WhatsApp",
    notifEnable: "Push-Erinnerungen aktivieren",
    notifActive: "✓ Erinnerungen aktiv",
    editProfile: "Profil bearbeiten",
    saveProfile: "Speichern",
  },
  it: {
    tagline: "Scopri la Svizzera intorno a te",
    iAm: "Sono...",
    participant: "Partecipante",
    participantSub: "Cerco eventi e serate",
    organizer: "Organizzatore",
    organizerSub: "Pubblico i miei eventi su SwissOut",
    yourName: "Come ti chiami?",
    namePlaceholder: "Il tuo nome...",
    yourAge: "La tua età",
    yourGender: "Sei...",
    male: "Uomo",
    female: "Donna",
    discover: "Scopri gli eventi →",
    chooseSpace: "Scegli uno spazio →",
    continueWithout: "Continua senza registrarti",
    goOrg: "Vai allo spazio organizzatori →",
    hello: "Ciao",
    rayon: "Raggio",
    all: "Tutto",
    around: "Intorno a te",
    events: "eventi",
    event: "evento",
    nothingHere: "Niente qui vicino",
    nothingHereSub: "Aumenta il raggio o cambia categoria.",
    myEvents: "I miei eventi ♥",
    savedEvents: "evento",
    savedEventsSub: "salvato",
    emptyList: "Lista vuota",
    emptyListSub: "Esplora e salva gli eventi che ti interessano.",
    save: "♡ Salva",
    saved: "♥ Salvato",
    seeEvent: "Vedi evento →",
    goThere: "✓ Partecipo",
    goThereActive: "✓ Ci vado!",
    maybe: "~ Forse",
    removeSaved: "♥ Rimuovi dai salvati",
    addSaved: "♡ Salva questo evento",
    close: "Chiudi",
    explore: "Esplora",
    filter: "Filtro",
    today: "Oggi",
    thisWeek: "Settimana",
    thisMonth: "Mese",
    threeMonths: "3 mesi",
    allTime: "Tutto",
    orgSpace: "Spazio Organizzatori",
    orgDesc: "Accedi o crea un account per pubblicare i tuoi eventi su SwissOut.",
    goOrgBtn: "Vai allo spazio organizzatori →",
    backHome: "← Torna alla home",
    activateGps: "Attiva posizione",
    locating: "Localizzazione...",
    gpsActive: "GPS attivo",
    gpsError: "GPS non disponibile · Moutier",
    retry: "Riprova",
    search: "Cerca evento, città...",
    profile: "Profilo",
    share: "Condividi",
    copyLink: "Copia link",
    copied: "Copiato!",
    whatsapp: "WhatsApp",
    notifEnable: "Attiva promemoria push",
    notifActive: "✓ Promemoria attivi",
    editProfile: "Modifica profilo",
    saveProfile: "Salva",
  },
};

const LANGS = [
  { code: "fr", flag: "", label: "FR" },
  { code: "en", flag: "", label: "EN" },
  { code: "de", flag: "", label: "DE" },
  { code: "it", flag: "", label: "IT" },
];

const CATEGORIES = (t) => [
  { id: "all",         label: t.all,        emoji: "●" },
  { id: "soirees",     label: "Soirées",    emoji: "●" },
  { id: "street-food", label: "Street Food",emoji: "●" },
  { id: "villages",    label: "Fêtes",      emoji: "●" },
  { id: "concerts",    label: "Concerts",   emoji: "●" },
  { id: "sports",      label: "Sports",     emoji: "●" },
  { id: "culture",     label: "Culture",    emoji: "●" },
];

const EVENTS_RAW = [
  { id:1, title:"Balélec Festival", category:"concerts", location:"Lausanne", lat:46.5197, lng:6.5666, date:"2025-05-11", time:"18:00", desc:"Le plus grand festival étudiant de Suisse sur le campus de l'EPFL.", tags:["Live Music","Outdoor","Étudiant"], color:"#7C3AED", img:"🎸" },
  { id:2, title:"Zürich Street Food Festival", category:"street-food", location:"Zurich", lat:47.3769, lng:8.5417, date:"2025-05-12", time:"11:00", desc:"50 food trucks du monde entier au bord du lac.", tags:["Food","Famille","Lac"], color:"#FF9F0A", img:"🍜" },
  { id:3, title:"Fête de Neuchâtel", category:"villages", location:"Neuchâtel", lat:46.9900, lng:6.9293, date:"2025-05-12", time:"14:00", desc:"Traditions, musiques folkloriques et fanfares.", tags:["Tradition","Famille","Gratuit"], color:"#30D158", img:"🏔️" },
  { id:4, title:"Club Unique — Afterwork", category:"soirees", location:"Genève", lat:46.2044, lng:6.1432, date:"2025-05-11", time:"22:00", desc:"House & Techno avec les meilleurs DJs locaux.", tags:["Techno","18+","Terrasse"], color:"#7C3AED", img:"🌙" },
  { id:5, title:"Expo Giacometti", category:"culture", location:"Berne", lat:46.9481, lng:7.4474, date:"2025-05-13", time:"10:00", desc:"Rétrospective inédite au Kunstmuseum.", tags:["Art","Musée","Famille"], color:"#0A84FF", img:"🎨" },
  { id:6, title:"Trail des Alpes", category:"sports", location:"Villars-sur-Ollon", lat:46.3000, lng:7.0500, date:"2025-05-18", time:"08:00", desc:"Course trail en montagne, 3 distances disponibles.", tags:["Trail","Montagne","Inscription"], color:"#64D2FF", img:"⛷️" },
  { id:7, title:"Marché de Bâle", category:"street-food", location:"Bâle", lat:47.5596, lng:7.5886, date:"2025-05-17", time:"09:00", desc:"Producteurs locaux et fromages AOP.", tags:["Local","Bio","Marché"], color:"#FF9F0A", img:"🧀" },
  { id:8, title:"Fête du Lac — Lugano", category:"villages", location:"Lugano", lat:46.0037, lng:8.9511, date:"2025-06-01", time:"16:00", desc:"Feu d'artifice et animations en bord de lac.", tags:["Lac","Famille","Feux d'artifice"], color:"#30D158", img:"🎆" },
];

function getDistance(lat1,lng1,lat2,lng2){
  const R=6371, dLat=((lat2-lat1)*Math.PI)/180, dLng=((lng2-lng1)*Math.PI)/180;
  const a=Math.sin(dLat/2)**2+Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

async function reverseGeocode(lat,lng){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`);
    const d=await r.json();
    return d.address?.city||d.address?.town||d.address?.village||"Ma position";
  }catch{ return "Ma position"; }
}

function isWithinPeriod(dateStr, period) {
  if (period === "all") return true;
  const now = new Date();
  const eventDate = new Date(dateStr);
  if (period === "today") {
    return eventDate.toDateString() === now.toDateString();
  }
  const days = { "week": 7, "month": 30, "threemonths": 90 }[period];
  const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return eventDate >= now && eventDate <= limit;
}

const makeStyles = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}

:root{
  --accent: #7C3AED;
  --accent-light: #9D5FF5;
  --bg:     ${dark ? "#0A0A0C" : "#FFFFFF"};
  --s1:     ${dark ? "#131315" : "#FFFFFF"};
  --s2:     ${dark ? "#1A1A1E" : "#F0F0F0"};
  --s3:     ${dark ? "#222226" : "#E8E8E8"};
  --bd:     ${dark ? "#222226" : "#E0E0E0"};
  --bd2:    ${dark ? "#2E2E34" : "#D0D0D0"};
  --txt:    ${dark ? "#F0F0EB" : "#111111"};
  --muted:  ${dark ? "#888"    : "#666"};
  --faint:  ${dark ? "#444"    : "#999"};
  --shadow: ${dark ? "rgba(0,0,0,0.5)" : "rgba(100,90,140,0.12)"};
}

body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;min-height:100vh;transition:background 0.35s,color 0.35s}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative;overflow-x:hidden;transition:background 0.35s}

.header{padding:48px 22px 0;background:var(--bg);position:sticky;top:0;z-index:50;border-bottom:1px solid transparent;transition:background 0.35s,border-color 0.3s;}
.header.scrolled{border-color:var(--bd)}
.header-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
.brand{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.5px;line-height:1}
.brand em{color:var(--accent);font-style:normal}
.tagline{font-size:11px;color:var(--faint);font-weight:400;letter-spacing:0.8px;text-transform:uppercase;margin-top:4px}
.header-right{display:flex;align-items:center;gap:6px}

.theme-toggle{width:36px;height:36px;border-radius:12px;background:var(--s1);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:all 0.2s;flex-shrink:0;}
.theme-toggle:hover{background:var(--s2);transform:scale(1.08)}

/* LANG TOGGLE */
.lang-toggle{position:relative}
.lang-btn{min-width:36px;padding:0 8px;height:36px;border-radius:12px;background:var(--s1);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;font-weight:700;transition:all 0.2s;flex-shrink:0;font-family:'DM Sans',sans-serif;}
.lang-btn:hover{background:var(--s2)}
.lang-dropdown{position:absolute;top:44px;right:0;background:var(--s1);border:1px solid var(--bd2);border-radius:14px;overflow:hidden;z-index:999;min-width:100px;box-shadow:0 8px 32px rgba(0,0,0,0.3);}
.lang-opt{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.15s;}
.lang-opt:hover{background:var(--s2)}
.lang-opt.active{color:var(--accent);background:rgba(124,58,237,0.08)}

.loc-pill{display:flex;align-items:center;gap:7px;background:var(--s1);border:1px solid var(--bd2);border-radius:22px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;max-width:120px;overflow:hidden;}
.loc-pill:hover{background:var(--s2)}
.loc-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.loc-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.loc-dot.gps{background:var(--accent);animation:pulse 2s infinite}
.loc-dot.loading{background:#FF9F0A;animation:blink 0.7s infinite}
.loc-dot.error{background:var(--faint)}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.6}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

.geo-banner{margin:0 22px 4px;padding:11px 14px;background:${dark?"rgba(124,58,237,0.1)":"rgba(124,58,237,0.06)"};border:1px solid ${dark?"rgba(124,58,237,0.25)":"rgba(124,58,237,0.2)"};border-radius:14px;font-size:12px;color:var(--accent-light);display:flex;align-items:center;gap:8px;cursor:pointer;transition:all 0.2s;font-weight:500;}
.geo-banner.error{background:rgba(255,59,47,0.08);border-color:rgba(255,59,47,0.2);color:#FF3B2F}

.radius-row{display:flex;align-items:center;gap:12px;padding:14px 22px}
.radius-label{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:0.5px;text-transform:uppercase;white-space:nowrap;min-width:48px}
.radius-track{flex:1;height:3px;background:var(--bd2);border-radius:2px;position:relative}
.radius-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--accent),#A78BFA);transition:width 0.08s}
input[type=range]{position:absolute;inset:-10px 0;width:100%;opacity:0;cursor:pointer;height:24px}
.radius-val{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent);white-space:nowrap;min-width:54px;text-align:right;cursor:pointer;padding:4px 8px;border-radius:8px;border:1px solid transparent;transition:all 0.15s;}
.radius-val:hover{background:var(--s2);border-color:var(--bd2)}
.radius-input{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent);width:62px;text-align:center;padding:4px 8px;border-radius:8px;background:var(--s2);border:1px solid var(--accent);outline:none;-moz-appearance:textfield;}
.radius-input::-webkit-inner-spin-button,.radius-input::-webkit-outer-spin-button{-webkit-appearance:none}

.cats{display:flex;gap:7px;padding:2px 22px 10px;overflow-x:auto;scrollbar-width:none}
.cats::-webkit-scrollbar{display:none}
.cat{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;border:1px solid var(--bd);background:var(--s1);font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;transition:all 0.18s;color:var(--muted);}
.cat:hover{background:var(--s2);color:var(--txt);border-color:var(--bd2)}
.cat.active{background:var(--accent);border-color:var(--accent);color:#fff}

/* TIME FILTER */
.time-filters{display:flex;gap:6px;padding:0 22px 12px;overflow-x:auto;scrollbar-width:none}
.time-filters::-webkit-scrollbar{display:none}
.tfilter{padding:5px 12px;border-radius:20px;border:1px solid var(--bd);background:transparent;font-size:11px;font-weight:700;white-space:nowrap;cursor:pointer;transition:all 0.18s;color:var(--faint);font-family:'DM Sans',sans-serif;}
.tfilter:hover{background:var(--s2);color:var(--txt)}
.tfilter.active{background:rgba(124,58,237,0.15);border-color:var(--accent);color:var(--accent)}

.hdivider{height:1px;background:var(--bd)}
.sec-head{padding:18px 22px 10px;display:flex;justify-content:space-between;align-items:center}
.sec-title{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;letter-spacing:-0.2px}
.sec-count{font-size:11px;color:var(--faint);background:var(--s2);padding:3px 9px;border-radius:10px}

.cards{padding:0 22px 130px;display:flex;flex-direction:column;gap:13px}
.card{background:var(--s1);border:1px solid var(--bd);border-radius:18px;overflow:hidden;cursor:pointer;transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),box-shadow 0.25s,border-color 0.2s,background 0.35s;animation:cardIn 0.4s cubic-bezier(.34,1.2,.64,1) both;}
.card:hover{transform:translateY(-2px);border-color:var(--bd2);box-shadow:0 8px 32px var(--shadow)}
.card:active{transform:scale(0.975)}
@keyframes cardIn{from{opacity:0;transform:translateY(18px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.card-inner{padding:16px 18px 18px}
.card-row1{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.card-right{text-align:right;display:flex;flex-direction:column;align-items:flex-end}
.card-km{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent)}
.card-title{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.4px;line-height:1.15;margin-bottom:4px}
.card-loc{font-size:11px;color:var(--faint);margin-bottom:8px;font-weight:500;letter-spacing:0.2px;text-transform:uppercase}
.card-desc{font-size:13px;color:var(--muted);line-height:1.55;margin-bottom:13px}
.tags{display:flex;gap:5px;flex-wrap:wrap}
.tag{padding:3px 9px;border-radius:7px;font-size:10px;font-weight:700;background:var(--s2);color:var(--faint);letter-spacing:0.4px;text-transform:uppercase}
.card-btns{display:flex;gap:8px;margin-top:13px;padding-top:13px;border-top:1px solid var(--bd)}
.btn-save{flex:1;padding:10px;border-radius:12px;border:1px solid var(--bd2);background:transparent;color:var(--faint);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:5px;}
.btn-save:hover{background:var(--s2);color:var(--txt)}
.btn-save.saved{border-color:var(--accent);color:var(--accent);background:rgba(124,58,237,0.08)}
.btn-share{width:36px;flex-shrink:0;padding:10px 8px;border-radius:12px;border:1px solid var(--bd2);background:transparent;color:var(--faint);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.btn-share:hover{background:var(--s2);color:var(--txt)}
.btn-go{flex:2;padding:10px;border-radius:12px;border:none;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;color:#fff;letter-spacing:0.3px;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.2s;}
.btn-go:hover{filter:brightness(1.15);transform:scale(1.02)}

.empty{padding:70px 24px;text-align:center}
.empty-icon{font-size:52px;margin-bottom:16px;animation:float 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.empty-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--faint);margin-bottom:8px}
.empty-sub{font-size:13px;color:var(--faint);line-height:1.6}

.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${dark?"rgba(10,10,12,0.92)":"rgba(244,243,248,0.92)"};backdrop-filter:blur(24px);border-top:1px solid var(--bd);display:flex;padding:10px 0 30px;z-index:100;transition:background 0.35s,border-color 0.35s;}
.nav-it{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 0;transition:all 0.2s;position:relative}
.nav-icon{font-size:21px;transition:transform 0.2s}
.nav-it:hover .nav-icon{transform:scale(1.15)}
.nav-it.active .nav-icon{transform:scale(1.05)}
.nav-lbl{font-size:9px;font-weight:700;letter-spacing:0.8px;color:var(--faint);text-transform:uppercase}
.nav-it.active .nav-lbl{color:var(--accent)}
.nav-badge{position:absolute;top:0;right:22%;background:var(--accent);color:#fff;font-size:9px;font-weight:800;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:pop 0.3s cubic-bezier(.34,1.56,.64,1)}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}

.part-row{display:flex;gap:8px;margin-top:13px;padding-top:13px;border-top:1px solid var(--bd)}
.btn-part{flex:1;padding:10px 8px;border-radius:12px;border:1px solid var(--bd2);background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:5px;color:var(--faint);letter-spacing:0.2px;}
.btn-part:hover{background:var(--s2);color:var(--txt)}
.btn-part.yes{background:rgba(48,209,88,0.1);border-color:rgba(48,209,88,0.3);color:#30D158}
.btn-part.maybe{background:rgba(255,159,10,0.1);border-color:rgba(255,159,10,0.3);color:#FF9F0A}

.mbackdrop{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(12px);z-index:200;display:flex;align-items:flex-end;animation:fadein 0.2s ease}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.modal{width:100%;max-width:430px;margin:0 auto;background:var(--s1);border-radius:28px 28px 0 0;padding:0 0 48px;overflow:hidden;animation:slideup 0.35s cubic-bezier(.34,1.4,.64,1);border:1px solid var(--bd2);border-bottom:none;transition:background 0.35s}
@keyframes slideup{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-hero{padding:20px 24px 16px;text-align:center}
.modal-handle{width:36px;height:3px;background:var(--bd2);border-radius:2px;margin:0 auto 20px}
.modal-title{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;letter-spacing:-0.5px;margin-bottom:5px}
.modal-loc{font-size:11px;color:var(--faint);margin-bottom:2px;letter-spacing:0.3px;text-transform:uppercase;font-weight:600}
.modal-dt{font-size:12px;color:var(--muted)}
.modal-km-badge{display:inline-block;padding:5px 14px;border-radius:20px;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-bottom:20px}
.modal-desc{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:18px;padding:0 24px}
.modal-tags{display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;padding:0 24px}
.modal-tag{padding:5px 13px;border-radius:10px;background:var(--s2);font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px}
.modal-actions{padding:0 24px;display:flex;flex-direction:column;gap:9px}
.mbtn{width:100%;padding:15px;border-radius:16px;border:none;font-family:'Syne',sans-serif;font-size:14px;font-weight:800;cursor:pointer;color:#fff;letter-spacing:0.3px;transition:all 0.2s}
.mbtn:hover{filter:brightness(1.12);transform:scale(1.01)}
.mbtn-close{width:100%;padding:13px;border-radius:16px;border:1px solid var(--bd2);background:transparent;color:var(--faint);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
.mbtn-close:hover{background:var(--s2);color:var(--muted)}

.page-hero{padding:48px 22px 20px}
.page-title{font-family:'Syne',sans-serif;font-weight:800;font-size:34px;letter-spacing:-1px}
.page-sub{font-size:13px;color:var(--faint);margin-top:5px}

.card:nth-child(1){animation-delay:0s}.card:nth-child(2){animation-delay:.05s}
.card:nth-child(3){animation-delay:.1s}.card:nth-child(4){animation-delay:.15s}
.card:nth-child(5){animation-delay:.2s}.card:nth-child(6){animation-delay:.25s}
.card:nth-child(7){animation-delay:.3s}.card:nth-child(8){animation-delay:.35s}

/* ONBOARDING */
.onboard{position:fixed;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;padding:40px 32px;animation:obIn 0.5s ease;overflow-y:auto;}
@keyframes obIn{from{opacity:0}to{opacity:1}}
.ob-exit{animation:obOut 0.5s ease forwards}
@keyframes obOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.04)}}
.ob-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:52px;letter-spacing:-2px;line-height:1;margin-bottom:10px;animation:logoIn 0.7s cubic-bezier(.34,1.4,.64,1) 0.2s both;}
@keyframes logoIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.ob-logo em{color:#7C3AED;font-style:normal}
.ob-tagline{font-size:13px;color:#444;letter-spacing:1px;text-transform:uppercase;font-weight:500;margin-bottom:32px;animation:logoIn 0.7s cubic-bezier(.34,1.4,.64,1) 0.35s both;}
.ob-form{width:100%;max-width:320px;animation:logoIn 0.7s cubic-bezier(.34,1.4,.64,1) 0.5s both;display:flex;flex-direction:column;gap:12px;}
.ob-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-family:'Syne',sans-serif;margin-bottom:2px;}
.ob-input{width:100%;padding:16px 20px;border-radius:16px;background:var(--s2);border:1px solid var(--bd);font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--txt);outline:none;letter-spacing:-0.3px;transition:border-color 0.2s;-webkit-appearance:none;}
.ob-input::placeholder{color:var(--faint)}
.ob-input:focus{border-color:#7C3AED}
.ob-btn{width:100%;padding:16px;border-radius:16px;border:none;background:#7C3AED;color:#fff;font-family:'Syne',sans-serif;font-size:16px;font-weight:800;cursor:pointer;letter-spacing:0.3px;transition:all 0.2s;margin-top:4px;opacity:0.35;}
.ob-btn.ready{opacity:1}
.ob-btn.ready:hover{filter:brightness(1.15);transform:translateY(-1px)}
.ob-btn:active{transform:scale(0.97)}
.ob-skip{margin-top:16px;font-size:12px;color:var(--faint);cursor:pointer;transition:color 0.2s;text-align:center;animation:logoIn 0.7s cubic-bezier(.34,1.4,.64,1) 0.7s both;}
.ob-skip:hover{color:var(--muted)}
.ob-role{display:flex;gap:10px;width:100%;margin-bottom:4px}
.ob-role-btn{flex:1;padding:18px 12px;border-radius:16px;border:1px solid var(--bd);background:var(--s2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:8px;}
.ob-role-btn:hover{border-color:var(--bd2);color:var(--txt);transform:translateY(-2px)}
.ob-role-btn.selected{border-color:#7C3AED;background:rgba(124,58,237,0.1);color:#fff;transform:translateY(-2px)}
.ob-role-btn.selected-org{border-color:#FF9F0A;background:rgba(255,159,10,0.08);color:#fff;transform:translateY(-2px)}
.ob-role-icon{font-size:32px}
.ob-role-title{font-size:13px;font-weight:800;letter-spacing:-0.2px}
.ob-role-sub{font-size:10px;font-weight:400;opacity:0.6;text-align:center;line-height:1.4}
.ob-gender{display:flex;gap:8px;width:100%}
.ob-gender-btn{flex:1;padding:12px;border-radius:14px;border:1px solid var(--bd);background:var(--s2);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:5px;}
.ob-gender-btn:hover{border-color:var(--bd2);color:var(--txt)}
.ob-gender-btn.selected{border-color:#7C3AED;background:rgba(124,58,237,0.1);color:#7C3AED}
.ob-gender-btn .g-icon{font-size:22px}
.ob-gender-btn .g-label{font-size:11px;letter-spacing:0.5px;text-transform:uppercase}

/* LANG ON ONBOARD */
.ob-langs{display:flex;gap:6px;justify-content:center;margin-bottom:8px}
.ob-lang-btn{padding:5px 10px;border-radius:8px;border:1px solid #ddd;background:#f5f5f5;font-size:11px;font-weight:700;color:#666;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
.ob-lang-btn:hover{border-color:#bbb;color:#333;background:#eee}
.ob-lang-btn.active{border-color:#7C3AED;color:#7C3AED;background:rgba(124,58,237,0.08)}
`;

export default function SwissOut() {
  const [lang, setLang]             = useState("fr");
  const [showLangDrop, setShowLangDrop] = useState(false);
  const t = T[lang];

  const _p = (() => { try { return JSON.parse(localStorage.getItem('swissout_profile') || '{}'); } catch { return {}; } })();
  const [userName, setUserName]     = useState(_p.userName || "");
  const [nameInput, setNameInput]   = useState(_p.userName || "");
  const [gender, setGender]         = useState(_p.gender || "");
  const [age, setAge]               = useState(_p.age || "");
  const [phone, setPhone]           = useState(_p.phone || "");
  const [obExit, setObExit]         = useState(false);
  const [role, setRole]             = useState("");
  const [dark, setDark]             = useState(false);
  const [cat, setCat]               = useState("all");
  const [timePeriod, setTimePeriod] = useState("all");
  const [radius, setRadius]         = useState(20);
  const [editingRadius, setEditingRadius] = useState(false);
  const [radiusDraft, setRadiusDraft]     = useState("20");
  const [saved, setSaved]           = useState([]);
  const [participation, setParticipation] = useState({});
  const [selected, setSelected]     = useState(null);
  const [tab, setTab]               = useState("explore");
  const [userPos, setUserPos]       = useState(null);
  const [cityName, setCityName]     = useState("...");
  const [geoStatus, setGeoStatus]   = useState("idle");
  const [scrolled, setScrolled]     = useState(false);
  const [eventsFromDB, setEventsFromDB] = useState([]);
  const [tickets, setTickets]           = useState(() => { try { return JSON.parse(localStorage.getItem('swissout_tickets')||'{}'); } catch { return {}; } });
  const [search, setSearch]             = useState("");
  const [shareEvent, setShareEvent]     = useState(null);
  const [shareCopied, setShareCopied]   = useState(false);
  const [notifGranted, setNotifGranted] = useState(() => { try { return Notification?.permission === 'granted'; } catch { return false; } });
  const [profileSubTab, setProfileSubTab] = useState("saved");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [reviews, setReviews]             = useState({});
  const [myReviews, setMyReviews]         = useState(() => { try { return JSON.parse(localStorage.getItem('swissout_myreviews')||'{}'); } catch { return {}; } });
  const [reviewDraft, setReviewDraft]     = useState({ rating:0, comment:'' });
  const [newsletterEmail, setNewsletterEmail] = useState(() => localStorage.getItem('swissout_nl_email') || '');
  const [newsletterSub, setNewsletterSub]     = useState(() => !!localStorage.getItem('swissout_nl_email'));
  const [nlLoading, setNlLoading]             = useState(false);
  const [showNlPreview, setShowNlPreview]     = useState(false);

  const handleOnboard = () => {
    const n = nameInput.trim();
    if (!n || !gender || !age) return;
    localStorage.setItem('swissout_profile', JSON.stringify({ userName: n, gender, age, phone, lang }));
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => { if (p === 'granted') setNotifGranted(true); });
    }
    setObExit(true);
    setTimeout(() => setUserName(n), 480);
  };

  const confirmRadius = (val) => {
    const n = Math.min(150, Math.max(1, parseInt(val) || 1));
    setRadius(n); setRadiusDraft(String(n)); setEditingRadius(false);
  };

  useEffect(() => { requestGeo(); }, []);
  useEffect(() => {
    fetchEvenements().then(data => { if (data.length > 0) setEventsFromDB(data); });
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
  useEffect(() => {
    if (!eventsFromDB.length) return;
    fetchReviews(eventsFromDB.map(e => e.id)).then(setReviews);
  }, [eventsFromDB]);
  useEffect(() => {
    if (selected) setReviewDraft({ rating:0, comment:'' });
  }, [selected?.id]);
  useEffect(() => {
    if (!notifGranted || !eventsFromDB.length) return;
    const timers = [];
    eventsFromDB.forEach(e => {
      if (!saved.includes(e.id)) return;
      try {
        const dt = new Date(`${e.date_debut}T${e.heure || '00:00'}`);
        const notifAt = new Date(dt.getTime() - 60 * 60 * 1000);
        const ms = notifAt.getTime() - Date.now();
        if (ms > 0 && ms < 24 * 60 * 60 * 1000) {
          timers.push(setTimeout(() => {
            new Notification('SwissOut — Rappel', {
              body: `${e.titre} commence dans 1h à ${e.ville}`,
              icon: '/logo192.png',
            });
          }, ms));
        }
      } catch {}
    });
    return () => timers.forEach(clearTimeout);
  }, [saved, eventsFromDB, notifGranted]);

  const requestGeo = () => {
    if (!navigator.geolocation) { setGeoStatus("error"); setCityName("N/A"); return; }
    setGeoStatus("loading"); setCityName("...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng }); setGeoStatus("success");
        const city = await reverseGeocode(lat, lng); setCityName(city);
      },
      () => { setGeoStatus("error"); setCityName("Moutier"); setUserPos({ lat:47.2785, lng:7.3714 }); },
      { timeout:8000, enableHighAccuracy:true }
    );
  };

  const CATS = CATEGORIES(t);

  const eventsWithDist = (eventsFromDB.length > 0 ? eventsFromDB.map(e => ({
    id: e.id, title: e.titre, category: e.categorie, location: e.ville,
    lat: e.latitude, lng: e.longitude, date: e.date_debut, time: e.heure,
    desc: e.description, tags: e.tags || [], color: "#7C3AED", img: "📅",
    lien_billetterie: e.lien_billetterie || null,
    prix: e.prix || null,
    address: e.adresse || null,
    instagram_url: e.instagram_url || null,
    facebook_url: e.facebook_url || null,
    cover_url: e.cover_url || null,
    is_sponsored: !!e.is_sponsored,
    ticket_price: e.ticket_price || null,
  })) : EVENTS_RAW).map(e => ({
    ...e,
    km: userPos ? Math.round(getDistance(userPos.lat, userPos.lng, e.lat, e.lng)) : null,
  }));

  const formatPrix = (p) => {
    if (!p) return null;
    const s = p.trim();
    if (!s) return null;
    if (/^[0-9]+([.,][0-9]+)?$/.test(s)) return `${s} CHF`;
    return s;
  };

  const filtered = eventsWithDist
    .filter(e =>
      (cat === "all" || e.category === cat) &&
      (e.km === null || e.km <= radius) &&
      isWithinPeriod(e.date, timePeriod)
    )
    .sort((a, b) => {
      if (!!a.is_sponsored !== !!b.is_sponsored) return a.is_sponsored ? -1 : 1;
      return (a.km ?? 999) - (b.km ?? 999);
    });

  const savedEvents  = eventsWithDist.filter(e => saved.includes(e.id));
  const yesEvents    = eventsWithDist.filter(e => participation[e.id] === "yes");
  const maybeEvents  = eventsWithDist.filter(e => participation[e.id] === "maybe");
  const searchFiltered = search.trim()
    ? filtered.filter(e => {
        const q = search.toLowerCase();
        return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.desc?.toLowerCase().includes(q);
      })
    : filtered;

  const saveProfile = () => {
    const n = profileDraft.name?.trim() || userName;
    setUserName(n); setNameInput(n);
    setPhone(profileDraft.phone ?? phone);
    setAge(profileDraft.age || age);
    setGender(profileDraft.gender || gender);
    localStorage.setItem('swissout_profile', JSON.stringify({ userName: n, gender: profileDraft.gender || gender, age: profileDraft.age || age, phone: profileDraft.phone ?? phone, lang }));
    setEditingProfile(false);
  };

  const avgRating = (id) => {
    const rs = reviews[id];
    if (!rs?.length) return null;
    return (rs.reduce((s, r) => s + r.rating, 0) / rs.length).toFixed(1);
  };

  const handleSubmitReview = async () => {
    if (!reviewDraft.rating || !selected) return;
    const ok = await submitReview(selected.id, userName, reviewDraft.rating, reviewDraft.comment);
    if (ok) {
      const nm = { ...myReviews, [selected.id]: reviewDraft.rating };
      setMyReviews(nm);
      localStorage.setItem('swissout_myreviews', JSON.stringify(nm));
      setReviews(r => ({ ...r, [selected.id]: [...(r[selected.id]||[]), { rating: reviewDraft.rating, comment: reviewDraft.comment, participant_name: userName }] }));
      setReviewDraft({ rating:0, comment:'' });
    }
  };

  const handleSubscribeNL = async () => {
    if (!newsletterEmail.trim()) return;
    setNlLoading(true);
    const ok = await subscribeNewsletter(newsletterEmail.trim(), userName, lang);
    if (ok) { localStorage.setItem('swissout_nl_email', newsletterEmail.trim()); setNewsletterSub(true); }
    setNlLoading(false);
  };

  const handleUnsubscribeNL = async () => {
    setNlLoading(true);
    await unsubscribeNewsletter(newsletterEmail);
    localStorage.removeItem('swissout_nl_email');
    setNewsletterSub(false);
    setNlLoading(false);
  };

  const toggleParticipation = (id, status, ev) => {
    ev?.stopPropagation();
    setParticipation(p => {
      if (p[id] === status) { const n = {...p}; delete n[id]; return n; }
      return { ...p, [id]: status };
    });
    trackEvent(id, 'participation');
    if (status === "yes") {
      setTickets(t => {
        if (t[id]) return t;
        const tid = (crypto.randomUUID ? crypto.randomUUID() : `${id}-${Date.now()}`);
        const nt = {...t, [id]: tid};
        localStorage.setItem('swissout_tickets', JSON.stringify(nt));
        return nt;
      });
    }
  };

  const toggleSave = (id, ev) => {
    ev?.stopPropagation();
    const isSaved = saved.includes(id);
    setSaved(s => isSaved ? s.filter(x => x !== id) : [...s, id]);
    if (!isSaved) trackEvent(id, 'save');
  };

  const geoDotClass = { idle:"manual", loading:"loading", success:"gps", error:"error" }[geoStatus];

  const TIME_FILTERS = [
    { id: "all",         label: t.allTime },
    { id: "today",       label: t.today },
    { id: "week",        label: t.thisWeek },
    { id: "month",       label: t.thisMonth },
    { id: "threemonths", label: t.threeMonths },
  ];

  const EventCard = ({ event }) => (
    <div className="card" onClick={() => { setSelected(event); trackEvent(event.id, 'view', search.trim() ? 'search' : 'browse'); }}>
      {event.cover_url && (
        <img src={event.cover_url} alt="" style={{ width:"100%", height:130, objectFit:"cover", display:"block" }} />
      )}
      <div className="card-inner">
        <div className="card-row1">
          <div className="card-datetime" style={{ fontSize:11, color:"var(--faint)", alignSelf:"center" }}>{event.date} · {event.time}</div>
          <div className="card-right">
            {event.is_sponsored && (
              <div style={{ display:"inline-block", padding:"2px 8px", borderRadius:6, background:"#FF9F0A", color:"#fff", fontSize:9, fontWeight:800, marginBottom:4, letterSpacing:"0.4px", textTransform:"uppercase" }}>★ Sponsorisé</div>
            )}
            {formatPrix(event.prix) && (
              <div style={{ display:"inline-block", padding:"2px 9px", borderRadius:10, background:"var(--s2)", border:"1px solid var(--bd)", color:"var(--muted)", fontSize:10, fontWeight:700, marginBottom:4, textAlign:"right" }}>
                {formatPrix(event.prix)}
              </div>
            )}
            <div className="card-km">{event.km !== null ? `${event.km} km` : "—"}</div>
          </div>
        </div>
        <div className="card-title">{event.title}</div>
        <div className="card-loc">{event.location}</div>
        <div className="card-desc">{event.desc}</div>
        <div className="tags">{event.tags.map(tg => <span key={tg} className="tag">{tg}</span>)}</div>
        {(() => { const avg = avgRating(event.id); return avg ? (
          <div style={{ fontSize:11, color:"#FF9F0A", marginTop:7, fontWeight:700 }}>
            {"★".repeat(Math.round(avg))}{"☆".repeat(5-Math.round(avg))} <span style={{ color:"var(--faint)" }}>{avg} ({reviews[event.id]?.length})</span>
          </div>
        ) : null; })()}
        <div className="card-btns">
          <button className={`btn-save${saved.includes(event.id) ? " saved" : ""}`} onClick={e => toggleSave(event.id, e)}>
            {saved.includes(event.id) ? t.saved : t.save}
          </button>
          <button className="btn-share" onClick={e => { e.stopPropagation(); setShareEvent(event); }}
            title={t.share}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
          <button className="btn-go" style={{ background: event.color }} onClick={e => { e.stopPropagation(); setSelected(event); trackEvent(event.id, 'click'); }}>
            {t.seeEvent}
          </button>
        </div>
        {event.lien_billetterie && (
          <div style={{ marginTop:8 }}>
            <a href={event.lien_billetterie} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", alignItems:"center", justifyContent:"center",
                padding:"9px 14px", borderRadius:12, background:"transparent",
                border:"1px solid var(--bd2)", color:"var(--txt)",
                fontSize:12, fontWeight:700, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>
              Acheter des billets
            </a>
            <div style={{ textAlign:"center", fontSize:9, color:"var(--faint)", marginTop:3, fontFamily:"monospace" }}>Billetterie propulsée par SwissOut</div>
          </div>
        )}
        {(event.instagram_url || event.facebook_url) && (
          <div style={{ display:"flex", gap:8, marginTop:8 }} onClick={e => e.stopPropagation()}>
            {event.instagram_url && (
              <a href={event.instagram_url} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                  borderRadius:10, background:"var(--s2)", border:"1px solid var(--bd)",
                  color:"var(--muted)", fontSize:11, fontWeight:600, textDecoration:"none" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
            )}
            {event.facebook_url && (
              <a href={event.facebook_url} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                  borderRadius:10, background:"var(--s2)", border:"1px solid var(--bd)",
                  color:"var(--muted)", fontSize:11, fontWeight:600, textDecoration:"none" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
            )}
          </div>
        )}
        <div className="part-row">
          <button className={`btn-part${participation[event.id] === "yes" ? " yes" : ""}`} onClick={e => toggleParticipation(event.id, "yes", e)}>
            {participation[event.id] === "yes" ? t.goThereActive : t.goThere}
          </button>
          <button className={`btn-part${participation[event.id] === "maybe" ? " maybe" : ""}`} onClick={e => toggleParticipation(event.id, "maybe", e)}>
            {t.maybe}
          </button>
        </div>
      </div>
    </div>
  );

  // ── ONBOARDING ──
  if (!userName) return (
    <>
      <style>{makeStyles(dark)}</style>
      <div className={`onboard${obExit ? " ob-exit" : ""}`} style={{ background: dark ? "#000" : "#FFFFFF" }}>
        <div style={{ position:"absolute", top:48, right:24, display:"flex", gap:8 }}>
          {/* LANG SWITCHER ON ONBOARD */}
          <div style={{ display:"flex", gap:4 }}>
            {LANGS.map(l => (
              <button key={l.code} className={`ob-lang-btn${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="theme-toggle" onClick={() => setDark(d => !d)}>
            {dark ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
)}
          </div>
        </div>

        <div className="ob-logo" style={{ color: dark ? "#F0F0EB" : "#111111" }}>Swiss<em>Out</em></div>
        <div className="ob-tagline" style={{ color: dark ? "#444" : "#888" }}>{t.tagline}</div>

        <div className="ob-form">
          <div className="ob-label">{t.iAm}</div>
          <div className="ob-role">
            <div className={`ob-role-btn${role === "user" ? " selected" : ""}`} onClick={() => setRole("user")}>
              <span className="ob-role-title">{t.participant}</span>
              <span className="ob-role-sub">{t.participantSub}</span>
            </div>
            <div className={`ob-role-btn${role === "org" ? " selected-org" : ""}`} onClick={() => setRole("org")}>
              <span className="ob-role-title">{t.organizer}</span>
              <span className="ob-role-sub">{t.organizerSub}</span>
            </div>
          </div>

          {role === "user" && (
            <>
              <div className="ob-label">{t.yourName}</div>
              <input className="ob-input" placeholder={t.namePlaceholder} value={nameInput} autoFocus
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && nameInput.trim() && gender && age && handleOnboard()}
                maxLength={24}
              />

              <div className="ob-label">Numéro de téléphone</div>
              <input className="ob-input" type="tel" placeholder="+41 79 000 00 00"
                value={phone} onChange={e => setPhone(e.target.value)}
                style={{ fontSize:16 }}
              />

              <div className="ob-label">{t.yourAge}</div>
              <div className="ob-gender">
                {["18-24","25-34","35-44","45+"].map(a => (
                  <div key={a} className={`ob-gender-btn${age === a ? " selected" : ""}`} onClick={() => setAge(a)}>
                    <span className="g-label">{a}</span>
                  </div>
                ))}
              </div>

              <div className="ob-label">{t.yourGender}</div>
              <div className="ob-gender">
                <div className={`ob-gender-btn${gender === "homme" ? " selected" : ""}`} onClick={() => setGender("homme")}>
                  <span className="g-icon">♂</span>
                  <span className="g-label">{t.male}</span>
                </div>
                <div className={`ob-gender-btn${gender === "femme" ? " selected" : ""}`} onClick={() => setGender("femme")}>
                  <span className="g-icon">♀</span>
                  <span className="g-label">{t.female}</span>
                </div>
              </div>

              <button className={`ob-btn${nameInput.trim() && gender && age ? " ready" : ""}`}
                onClick={handleOnboard} disabled={!nameInput.trim() || !gender || !age}>
                {t.discover}
              </button>
            </>
          )}

          {role === "org" && (
            <button className="ob-btn ready" style={{ background:"#FF9F0A" }}
              onClick={() => { setObExit(true); setTimeout(() => setUserName("__org__"), 480); }}>
              {t.goOrg}
            </button>
          )}

          {!role && <button className="ob-btn" disabled>{t.chooseSpace}</button>}
        </div>
        <div className="ob-skip" onClick={() => { setObExit(true); setTimeout(() => setUserName("Visiteur"), 480); }}>
          {t.continueWithout}
        </div>
      </div>
    </>
  );

  // ── ORG REDIRECT ──
  if (userName === "__org__") return (
    <>
      <style>{makeStyles(dark)}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20, padding:40, textAlign:"center" }}>
        <div style={{ fontSize:56 }}>🎤</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, letterSpacing:"-0.5px" }}>
          {t.orgSpace}
        </div>
        <div style={{ fontSize:14, color:"var(--muted)", maxWidth:300, lineHeight:1.6 }}>{t.orgDesc}</div>
        <button style={{ padding:"14px 28px", borderRadius:14, border:"none", background:"#FF9F0A", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, cursor:"pointer" }}
          onClick={() => window.location.href = "/org"}>
          {t.goOrgBtn}
        </button>
        <div style={{ fontSize:12, color:"var(--faint)", cursor:"pointer" }}
          onClick={() => { setUserName(""); setRole(""); setObExit(false); }}>
          {t.backHome}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{makeStyles(dark)}</style>
      <div className="app" onClick={() => setShowLangDrop(false)}>

        {/* HEADER */}
        <div className={`header${scrolled ? " scrolled" : ""}`}>
          <div className="header-top">
            <div>
              <div className="brand">Swiss<em>Out</em></div>
              <div className="tagline">{t.hello} {userName} 👋</div>
            </div>
            <div className="header-right">
              {/* LANG */}
              <div className="lang-toggle" onClick={e => e.stopPropagation()}>
                <div className="lang-btn" onClick={() => setShowLangDrop(d => !d)}>
                  {LANGS.find(l => l.code === lang)?.label}
                </div>
                {showLangDrop && (
                  <div className="lang-dropdown">
                    {LANGS.map(l => (
                      <div key={l.code} className={`lang-opt${lang === l.code ? " active" : ""}`}
                        onClick={() => { setLang(l.code); setShowLangDrop(false); }}>
                        <span>{l.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* THEME */}
              <div className="theme-toggle" onClick={() => setDark(d => !d)}>
                {dark ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
)}
              </div>
              {/* LOCATION */}
              <div className="loc-pill" onClick={geoStatus !== "success" ? requestGeo : undefined}>
                <div className={`loc-dot ${geoDotClass}`} />
                <span className="loc-name">{cityName}</span>
              </div>
            </div>
          </div>

          {geoStatus !== "success" && (
            <div className={`geo-banner${geoStatus === "error" ? " error" : ""}`}
              onClick={geoStatus === "error" ? requestGeo : undefined}>
              <span>{{ idle:"📍", loading:"⏳", error:"⚠️" }[geoStatus]}</span>
              <span>{geoStatus === "idle" ? t.activateGps : geoStatus === "loading" ? t.locating : t.gpsError}</span>
              {geoStatus === "error" && <span style={{ marginLeft:"auto", fontSize:11, opacity:0.7 }}>{t.retry}</span>}
            </div>
          )}

          <div className="radius-row">
            <span className="radius-label">{t.rayon}</span>
            <div className="radius-track">
              <div className="radius-fill" style={{ width:`${(radius/150)*100}%` }} />
              <input type="range" min={1} max={150} value={radius}
                onChange={e => { setRadius(Number(e.target.value)); setRadiusDraft(String(e.target.value)); }} />
            </div>
            {editingRadius ? (
              <input className="radius-input" type="number" min={1} max={150} value={radiusDraft} autoFocus
                onChange={e => setRadiusDraft(e.target.value)}
                onBlur={() => confirmRadius(radiusDraft)}
                onKeyDown={e => { if (e.key === "Enter") confirmRadius(radiusDraft); if (e.key === "Escape") setEditingRadius(false); }}
              />
            ) : (
              <span className="radius-val" onClick={() => { setEditingRadius(true); setRadiusDraft(String(radius)); }}>
                {radius} km ✎
              </span>
            )}
          </div>

          {/* CATEGORIES */}
          <div className="cats">
            {CATS.map(c => (
              <div key={c.id} className={`cat${cat === c.id ? " active" : ""}`} onClick={() => setCat(c.id)}>
                <span>{c.emoji}</span><span>{c.label}</span>
              </div>
            ))}
          </div>

          {/* TIME FILTERS */}
          <div className="time-filters">
            {TIME_FILTERS.map(tf => (
              <div key={tf.id} className={`tfilter${timePeriod === tf.id ? " active" : ""}`}
                onClick={() => setTimePeriod(tf.id)}>
                {tf.label}
              </div>
            ))}
          </div>

          <div className="hdivider" />
        </div>

        {/* EXPLORE */}
        {tab === "explore" && (
          <>
            {/* SEARCH */}
            <div style={{ padding:"10px 22px 4px" }}>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--faint)", pointerEvents:"none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={t.search}
                  style={{ width:"100%", padding:"10px 36px", borderRadius:12, border:"1px solid var(--bd)", background:"var(--s2)", fontSize:13, color:"var(--txt)", outline:"none", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor="var(--accent)"}
                  onBlur={e => e.target.style.borderColor="var(--bd)"}
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--faint)", cursor:"pointer", fontSize:14, padding:"2px 4px" }}>
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="sec-head">
              <span className="sec-title">{search ? `"${search}"` : cat === "all" ? t.around : CATS.find(c => c.id === cat)?.label}</span>
              <span className="sec-count">{searchFiltered.length} {searchFiltered.length !== 1 ? t.events : t.event}</span>
            </div>
            {searchFiltered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🏔️</div>
                <div className="empty-title">{t.nothingHere}</div>
                <div className="empty-sub">{t.nothingHereSub}</div>
              </div>
            ) : (
              <div className="cards">{searchFiltered.map(e => <EventCard key={e.id} event={e} />)}</div>
            )}
          </>
        )}

        {/* SAVED */}
        {tab === "saved" && (
          <>
            <div className="page-hero">
              <div className="page-title">{t.myEvents}</div>
              <div className="page-sub">{savedEvents.length} {t.savedEvents}{savedEvents.length !== 1 ? "s" : ""} {t.savedEventsSub}{savedEvents.length !== 1 ? "s" : ""}</div>
            </div>
            {savedEvents.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🌙</div>
                <div className="empty-title">{t.emptyList}</div>
                <div className="empty-sub">{t.emptyListSub}</div>
              </div>
            ) : (
              <div className="cards">{savedEvents.map(e => <EventCard key={e.id} event={e} />)}</div>
            )}
          </>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && !editingProfile && (
          <div style={{ paddingBottom:130 }}>
            <div style={{ padding:"40px 24px 24px", textAlign:"center" }}>
              <div style={{ width:64, height:64, borderRadius:32, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"#fff" }}>
                {userName[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, letterSpacing:"-0.3px" }}>{userName}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:3 }}>
                {[age, gender === "homme" ? "Homme" : gender === "femme" ? "Femme" : ""].filter(Boolean).join(" · ")}
              </div>
              {phone && <div style={{ fontSize:12, color:"var(--faint)", marginTop:2 }}>{phone}</div>}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:"0 22px 20px" }}>
              {[
                { n: savedEvents.length, label: "Sauvegardés", key: "saved" },
                { n: yesEvents.length,   label: "Confirmés",   key: "yes"   },
                { n: maybeEvents.length, label: "Peut-être",   key: "maybe" },
              ].map(s => (
                <div key={s.key} onClick={() => setProfileSubTab(s.key)}
                  style={{ textAlign:"center", padding:"14px 8px", borderRadius:14, cursor:"pointer", transition:"all 0.2s",
                    background: profileSubTab === s.key ? "rgba(124,58,237,0.1)" : "var(--s1)",
                    border: `1px solid ${profileSubTab === s.key ? "rgba(124,58,237,0.3)" : "var(--bd)"}` }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color: profileSubTab === s.key ? "var(--accent)" : "var(--txt)" }}>{s.n}</div>
                  <div style={{ fontSize:10, color:"var(--faint)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {(() => {
              const evts = profileSubTab === "saved" ? savedEvents : profileSubTab === "yes" ? yesEvents : maybeEvents;
              if (evts.length === 0) return (
                <div className="empty">
                  <div className="empty-icon">🌙</div>
                  <div className="empty-title">{t.emptyList}</div>
                  <div className="empty-sub">{t.emptyListSub}</div>
                </div>
              );
              return (
                <div className="cards">
                  {evts.map(e => (
                    <div key={e.id}>
                      <EventCard event={e} />
                      {profileSubTab === "yes" && tickets[e.id] && (
                        <div style={{ background:"var(--s1)", border:"1px solid var(--bd)", borderRadius:14, padding:"16px", marginTop:-6, display:"flex", alignItems:"center", gap:16 }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`SWISSOUT|${e.id}|${e.title}|${e.date}|${userName}|${tickets[e.id]}`)}`}
                            alt="QR Billet" style={{ width:80, height:80, borderRadius:8, flexShrink:0 }}
                          />
                          <div>
                            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, marginBottom:4 }}>Mon billet</div>
                            <div style={{ fontSize:11, color:"var(--faint)", marginBottom:6 }}>Présentez ce QR code à l'entrée</div>
                            <div style={{ fontFamily:"monospace", fontSize:9, color:"var(--faint)", wordBreak:"break-all" }}>
                              {tickets[e.id]?.slice(0,16)}...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            <div style={{ padding:"20px 22px 0", display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => { setProfileDraft({ name: userName, phone, age, gender }); setEditingProfile(true); }}
                style={{ width:"100%", padding:"13px", borderRadius:14, border:"1px solid var(--bd2)", background:"transparent", color:"var(--txt)", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                {t.editProfile}
              </button>

              {/* NEWSLETTER */}
              <div style={{ padding:"16px", background:"var(--s1)", border:"1px solid var(--bd)", borderRadius:14 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, marginBottom:8 }}>
                  Newsletter hebdomadaire
                </div>
                {newsletterSub ? (
                  <div>
                    <div style={{ fontSize:12, color:"#30D158", marginBottom:8 }}>✓ Inscrit — {newsletterEmail}</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => setShowNlPreview(true)}
                        style={{ flex:1, padding:"9px", borderRadius:10, border:"1px solid var(--bd2)", background:"transparent", color:"var(--accent)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                        Aperçu de la newsletter
                      </button>
                      <button onClick={handleUnsubscribeNL} disabled={nlLoading}
                        style={{ flex:1, padding:"9px", borderRadius:10, border:"1px solid rgba(255,59,47,0.3)", background:"transparent", color:"#FF3B2F", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                        Se désabonner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>Résumé des événements de la semaine chaque lundi</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <input value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                        placeholder="ton@email.ch" type="email"
                        style={{ flex:1, padding:"10px 12px", borderRadius:10, border:"1px solid var(--bd)", background:"var(--s2)", fontSize:13, color:"var(--txt)", outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
                      <button onClick={handleSubscribeNL} disabled={nlLoading || !newsletterEmail.trim()}
                        style={{ padding:"10px 14px", borderRadius:10, border:"none", background:"var(--accent)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", opacity: nlLoading ? 0.6 : 1 }}>
                        {nlLoading ? "..." : "S'abonner"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {'Notification' in window && !notifGranted && (
                <button onClick={() => Notification.requestPermission().then(p => { if (p === 'granted') setNotifGranted(true); })}
                  style={{ width:"100%", padding:"13px", borderRadius:14, border:"1px solid rgba(124,58,237,0.3)", background:"rgba(124,58,237,0.08)", color:"var(--accent)", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  {t.notifEnable}
                </button>
              )}
              {notifGranted && (
                <div style={{ textAlign:"center", fontSize:12, color:"var(--accent)", padding:"8px" }}>{t.notifActive}</div>
              )}
            </div>
          </div>
        )}

        {tab === "profile" && editingProfile && (() => {
          const inp = { width:"100%", padding:"11px 14px", borderRadius:12, background:"var(--s2)", border:"1px solid var(--bd)", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"var(--txt)", outline:"none" };
          const lbl = { fontSize:10, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", color:"var(--faint)", display:"block", marginBottom:5, fontFamily:"'DM Sans',sans-serif" };
          return (
            <div style={{ padding:"40px 22px 130px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
                <button onClick={() => setEditingProfile(false)}
                  style={{ padding:"8px 14px", borderRadius:10, border:"1px solid var(--bd)", background:"transparent", color:"var(--muted)", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  ← Retour
                </button>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18 }}>{t.editProfile}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={lbl}>Prénom</label>
                  <input style={inp} value={profileDraft.name ?? ""} onChange={e => setProfileDraft(d => ({...d, name: e.target.value}))} placeholder="Ton prénom" />
                </div>
                <div>
                  <label style={lbl}>Téléphone</label>
                  <input style={inp} type="tel" value={profileDraft.phone ?? ""} onChange={e => setProfileDraft(d => ({...d, phone: e.target.value}))} placeholder="+41 79 000 00 00" />
                </div>
                <div>
                  <label style={lbl}>Âge</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["18-24","25-34","35-44","45+"].map(a => (
                      <div key={a} onClick={() => setProfileDraft(d => ({...d, age: a}))}
                        style={{ flex:1, padding:"10px 6px", borderRadius:12, border:`1px solid ${profileDraft.age===a?"var(--accent)":"var(--bd)"}`, background: profileDraft.age===a?"rgba(124,58,237,0.1)":"transparent", textAlign:"center", fontSize:12, fontWeight:700, cursor:"pointer", color: profileDraft.age===a?"var(--accent)":"var(--muted)", transition:"all 0.15s" }}>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Genre</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {[["homme","Homme"],["femme","Femme"]].map(([val, label]) => (
                      <div key={val} onClick={() => setProfileDraft(d => ({...d, gender: val}))}
                        style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid ${profileDraft.gender===val?"var(--accent)":"var(--bd)"}`, background: profileDraft.gender===val?"rgba(124,58,237,0.1)":"transparent", textAlign:"center", fontSize:13, fontWeight:700, cursor:"pointer", color: profileDraft.gender===val?"var(--accent)":"var(--muted)", transition:"all 0.15s" }}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={saveProfile}
                style={{ width:"100%", marginTop:24, padding:"15px", borderRadius:14, border:"none", background:"var(--accent)", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, cursor:"pointer" }}>
                {t.saveProfile}
              </button>
            </div>
          );
        })()}

        {/* BOTTOM NAV */}
        <div className="bnav">
          <div className={`nav-it${tab === "explore" ? " active" : ""}`} onClick={() => setTab("explore")}>
            <span className="nav-icon">{tab === "explore" ? "✦" : "✧"}</span>
            <span className="nav-lbl">{t.explore}</span>
          </div>
          <div className={`nav-it${tab === "saved" ? " active" : ""}`} onClick={() => setTab("saved")}>
            <span className="nav-icon">{tab === "saved" ? "♥" : "♡"}</span>
            {saved.length > 0 && <span className="nav-badge">{saved.length}</span>}
            <span className="nav-lbl">{t.saved.replace("♥ ","")}</span>
          </div>
          <div className={`nav-it${tab === "profile" ? " active" : ""}`} onClick={() => { setTab("profile"); setEditingProfile(false); }}>
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tab === "profile" ? "2.5" : "1.8"} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span className="nav-lbl">{t.profile}</span>
          </div>
        </div>

        {/* MODAL */}
        {selected && (
          <div className="mbackdrop" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              {selected.cover_url && (
                <img src={selected.cover_url} alt="" style={{ width:"100%", height:180, objectFit:"cover", display:"block" }} />
              )}
              <div className="modal-hero">
                <div className="modal-handle" />
                <div className="modal-title">{selected.title}</div>
                <div className="modal-loc">{selected.address ? `${selected.address}, ${selected.location}` : selected.location}</div>
                <div className="modal-dt">{selected.date} · {selected.time}</div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginTop:10, marginBottom:4 }}>
                  {selected.km !== null && (
                    <div className="modal-km-badge" style={{ background: selected.color }}>⊙ {selected.km} km</div>
                  )}
                  {formatPrix(selected.prix) && (
                    <div style={{display:"inline-block",padding:"4px 13px",borderRadius:16,background:"var(--s2)",border:"1px solid var(--bd)",color:"var(--muted)",fontSize:13,fontWeight:700}}>
                      {formatPrix(selected.prix)}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-desc">{selected.desc}</div>
              <div className="modal-tags">{selected.tags.map(tg => <span key={tg} className="modal-tag">{tg}</span>)}</div>
              <div className="modal-actions">
                <div style={{ display:"flex", gap:8, marginBottom:9 }}>
                  <button style={{ flex:1, padding:"13px", borderRadius:14, border:"1px solid",
                    borderColor: participation[selected.id]==="yes" ? "rgba(48,209,88,0.4)" : "var(--bd2)",
                    background: participation[selected.id]==="yes" ? "rgba(48,209,88,0.1)" : "transparent",
                    color: participation[selected.id]==="yes" ? "#30D158" : "var(--faint)",
                    fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}
                    onClick={() => toggleParticipation(selected.id, "yes")}>
                    {participation[selected.id]==="yes" ? t.goThereActive : t.goThere}
                  </button>
                  <button style={{ flex:1, padding:"13px", borderRadius:14, border:"1px solid",
                    borderColor: participation[selected.id]==="maybe" ? "rgba(255,159,10,0.4)" : "var(--bd2)",
                    background: participation[selected.id]==="maybe" ? "rgba(255,159,10,0.1)" : "transparent",
                    color: participation[selected.id]==="maybe" ? "#FF9F0A" : "var(--faint)",
                    fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}
                    onClick={() => toggleParticipation(selected.id, "maybe")}>
                    {t.maybe}
                  </button>
                </div>
                {selected.lien_billetterie && (
                  <div>
                    <a href={selected.lien_billetterie} target="_blank" rel="noopener noreferrer"
                      style={{display:"block",width:"100%",padding:"13px",borderRadius:14,
                        border:"1px solid var(--bd2)",background:"transparent",color:"var(--txt)",
                        fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,
                        textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>
                      Acheter des billets
                    </a>
                    <div style={{textAlign:"center",fontSize:10,color:"var(--faint)",marginTop:2,fontFamily:"monospace"}}>Billetterie propulsée par SwissOut</div>
                  </div>
                )}
                {(() => {
                  const mapsQuery = encodeURIComponent([selected.address, selected.location, 'Suisse'].filter(Boolean).join(', '));
                  return (
                    <a href={`https://maps.apple.com/?q=${mapsQuery}`} target="_blank" rel="noopener noreferrer"
                      style={{display:"block",width:"100%",padding:"13px",borderRadius:14,
                        border:"1px solid var(--bd2)",background:"transparent",color:"var(--txt)",
                        fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,
                        textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>
                      Voir sur Maps
                    </a>
                  );
                })()}
                {(selected.instagram_url || selected.facebook_url) && (
                  <div style={{ display:"flex", gap:8, marginBottom:9 }}>
                    {selected.instagram_url && (
                      <a href={selected.instagram_url} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                          padding:"12px", borderRadius:14, border:"1px solid var(--bd2)",
                          background:"transparent", color:"var(--txt)",
                          fontSize:13, fontWeight:700, textDecoration:"none", fontFamily:"'Syne',sans-serif" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        Instagram
                      </a>
                    )}
                    {selected.facebook_url && (
                      <a href={selected.facebook_url} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                          padding:"12px", borderRadius:14, border:"1px solid var(--bd2)",
                          background:"transparent", color:"var(--txt)",
                          fontSize:13, fontWeight:700, textDecoration:"none", fontFamily:"'Syne',sans-serif" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        Facebook
                      </a>
                    )}
                  </div>
                )}
                <button className="mbtn" style={{ background: selected.color }} onClick={() => toggleSave(selected.id)}>
                  {saved.includes(selected.id) ? t.removeSaved : t.addSaved}
                </button>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.href).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); });
                  }} style={{ flex:1, padding:"12px", borderRadius:14, border:"1px solid var(--bd2)", background:"transparent", color:"var(--txt)", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    {shareCopied ? t.copied : t.copyLink}
                  </button>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`${selected.title} — ${selected.date} à ${selected.location} · SwissOut`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"12px", borderRadius:14, border:"1px solid rgba(37,211,102,0.3)", background:"rgba(37,211,102,0.07)", color:"#25D366", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, textDecoration:"none" }}>
                    {t.whatsapp}
                  </a>
                </div>
                <button className="mbtn-close" onClick={() => setSelected(null)}>{t.close}</button>

                {/* AVIS — uniquement pour les événements passés */}
                {new Date(selected.date) < new Date() && (
                  <div style={{ borderTop:"1px solid var(--bd)", paddingTop:16, marginTop:4 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, marginBottom:12 }}>
                      Avis {reviews[selected.id]?.length ? `(${reviews[selected.id].length})` : ""}
                    </div>

                    {/* Avis existants */}
                    {reviews[selected.id]?.slice(0,3).map((r, i) => (
                      <div key={i} style={{ marginBottom:10, padding:"10px 12px", borderRadius:12, background:"var(--s2)", border:"1px solid var(--bd)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700 }}>{r.participant_name}</span>
                          <span style={{ color:"#FF9F0A", fontSize:13 }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                        </div>
                        {r.comment && <div style={{ fontSize:12, color:"var(--muted)" }}>{r.comment}</div>}
                      </div>
                    ))}

                    {/* Formulaire d'avis */}
                    {myReviews[selected.id] ? (
                      <div style={{ textAlign:"center", fontSize:12, color:"var(--accent)", padding:"8px" }}>
                        ✓ Vous avez noté {myReviews[selected.id]}/5 — merci !
                      </div>
                    ) : (
                      <div style={{ background:"var(--s2)", borderRadius:14, padding:"14px", border:"1px solid var(--bd)" }}>
                        <div style={{ fontSize:12, color:"var(--muted)", marginBottom:10 }}>Votre avis :</div>
                        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:12 }}>
                          {[1,2,3,4,5].map(n => (
                            <span key={n} onClick={() => setReviewDraft(d => ({...d, rating:n}))}
                              style={{ fontSize:28, cursor:"pointer", color: n <= reviewDraft.rating ? "#FF9F0A" : "var(--bd2)", transition:"color 0.1s" }}>★</span>
                          ))}
                        </div>
                        <input value={reviewDraft.comment} onChange={e => setReviewDraft(d => ({...d, comment:e.target.value}))}
                          placeholder="Commentaire (optionnel)"
                          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid var(--bd2)", background:"var(--s1)", fontSize:13, color:"var(--txt)", outline:"none", marginBottom:10, boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" }} />
                        <button onClick={handleSubmitReview} disabled={!reviewDraft.rating}
                          style={{ width:"100%", padding:"11px", borderRadius:12, border:"none", background: reviewDraft.rating ? "var(--accent)" : "var(--bd2)", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor: reviewDraft.rating ? "pointer" : "not-allowed" }}>
                          Envoyer l'avis
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* NEWSLETTER PREVIEW */}
        {showNlPreview && (() => {
          const weekEvents = eventsWithDist.filter(e => {
            const d = new Date(e.date); const now = new Date();
            return d >= now && d <= new Date(now.getTime() + 7*24*60*60*1000);
          }).slice(0, 5);
          const dateStr = new Date().toLocaleDateString('fr', { day:'numeric', month:'long', year:'numeric' });
          return (
            <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(10px)", zIndex:300, display:"flex", alignItems:"flex-end" }}
              onClick={() => setShowNlPreview(false)}>
              <div style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"var(--s1)", borderRadius:"24px 24px 0 0", padding:"20px 24px 48px", border:"1px solid var(--bd2)", borderBottom:"none", maxHeight:"80vh", overflowY:"auto" }}
                onClick={e => e.stopPropagation()}>
                <div style={{ width:36, height:3, background:"var(--bd2)", borderRadius:2, margin:"0 auto 20px" }} />
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, marginBottom:4 }}>Aperçu newsletter</div>
                <div style={{ fontSize:12, color:"var(--faint)", marginBottom:20 }}>Semaine du {dateStr}</div>
                <div style={{ background:"var(--s2)", borderRadius:14, padding:"16px", border:"1px solid var(--bd)", fontFamily:"monospace", fontSize:12, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
{`Bonjour ${userName} 👋

Voici les événements SwissOut cette semaine :
${'─'.repeat(36)}
${weekEvents.length ? weekEvents.map(e => `📅 ${e.title}\n   ${e.date} · ${e.location}`).join('\n\n') : 'Aucun événement cette semaine.'}

${'─'.repeat(36)}
Découvrir tous les événements →
swissout.vercel.app

Pour se désabonner, accéder au profil.`}
                </div>
                <button onClick={() => setShowNlPreview(false)}
                  style={{ width:"100%", marginTop:14, padding:"13px", borderRadius:14, border:"1px solid var(--bd2)", background:"transparent", color:"var(--faint)", fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer" }}>
                  Fermer
                </button>
              </div>
            </div>
          );
        })()}

        {/* SHARE SHEET */}
        {shareEvent && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(10px)", zIndex:250, display:"flex", alignItems:"flex-end" }}
            onClick={() => setShareEvent(null)}>
            <div style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"var(--s1)", borderRadius:"24px 24px 0 0", padding:"20px 24px 48px", border:"1px solid var(--bd2)", borderBottom:"none" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width:36, height:3, background:"var(--bd2)", borderRadius:2, margin:"0 auto 20px" }} />
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, marginBottom:3 }}>{shareEvent.title}</div>
              <div style={{ fontSize:12, color:"var(--faint)", marginBottom:20 }}>{shareEvent.date} · {shareEvent.location}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <button onClick={() => {
                  navigator.clipboard.writeText(window.location.href).then(() => { setShareCopied(true); setTimeout(() => { setShareCopied(false); setShareEvent(null); }, 1500); });
                }} style={{ padding:"13px", borderRadius:14, border:"1px solid var(--bd2)", background:"transparent", color:"var(--txt)", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  {shareCopied ? `✓ ${t.copied}` : t.copyLink}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${shareEvent.title} — ${shareEvent.date} à ${shareEvent.location} · SwissOut`)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setShareEvent(null)}
                  style={{ display:"block", padding:"13px", borderRadius:14, border:"1px solid rgba(37,211,102,0.3)", background:"rgba(37,211,102,0.07)", color:"#25D366", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, textAlign:"center", textDecoration:"none" }}>
                  {t.whatsapp}
                </a>
                <button onClick={() => setShareEvent(null)}
                  style={{ padding:"13px", borderRadius:14, border:"1px solid var(--bd2)", background:"transparent", color:"var(--faint)", fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer" }}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
