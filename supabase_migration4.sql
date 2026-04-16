-- ══════════════════════════════════════════════════════
-- SwissOut — Migration 4 : monétisation
-- À exécuter dans l'éditeur SQL de Supabase
-- ══════════════════════════════════════════════════════

-- Événements sponsorisés
ALTER TABLE evenements
  ADD COLUMN IF NOT EXISTS is_sponsored   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ticket_price   NUMERIC;

-- Source de trafic dans event_stats (pour analytics avancés)
ALTER TABLE event_stats
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct';
