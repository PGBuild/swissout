import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eyqmlkiuhbkbygouznen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cW1sa2l1aGJrYnlnb3V6bmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzQzMzAsImV4cCI6MjA5MTI1MDMzMH0.Y3g6KqwjvU7M4iKnejRLGde142BFat1qeNwnAinqIlY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchEvenements() {
  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .eq('statut', 'approuve')
    .order('date_debut', { ascending: true });
  if (error) { console.error(error); return []; }
  return data;
}
export async function fetchStatsOrganisateur(evenementIds) {
  if (!evenementIds.length) return {};
  const { data, error } = await supabase
    .from('event_stats')
    .select('evenement_id, type')
    .in('evenement_id', evenementIds);
  if (error) return {};
  const stats = {};
  evenementIds.forEach(id => { stats[id] = { views:0, clicks:0, saves:0, participations:0 }; });
  data.forEach(row => {
    if (stats[row.evenement_id]) {
      const key = row.type === 'view' ? 'views' : row.type === 'click' ? 'clicks' : row.type === 'save' ? 'saves' : 'participations';
      stats[row.evenement_id][key]++;
    }
  });
  return stats;
}

export async function trackEvent(evenementId, type) {
  try {
    await supabase.from('event_stats').insert({ evenement_id: evenementId, type });
  } catch(e) {}
}

export async function fetchStats7Days(evenementIds) {
  if (!evenementIds.length) return {};
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('event_stats')
    .select('type, created_at')
    .in('evenement_id', evenementIds)
    .gte('created_at', since);
  if (error) return {};
  const days = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days[d.toISOString().split('T')[0]] = { views:0, clicks:0, saves:0, participations:0 };
  }
  data.forEach(row => {
    const day = row.created_at?.split('T')[0];
    if (day && days[day]) {
      const k = row.type==='view'?'views':row.type==='click'?'clicks':row.type==='save'?'saves':'participations';
      days[day][k]++;
    }
  });
  return days;
}
