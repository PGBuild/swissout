-- ══════════════════════════════════════════════════════
-- SwissOut — Migration 2 : cover_url + récurrence
-- À exécuter dans l'éditeur SQL de Supabase
-- ══════════════════════════════════════════════════════

-- Colonne photo de couverture
ALTER TABLE evenements
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT 'once';

-- ── Supabase Storage ────────────────────────────────
-- Créer le bucket manuellement dans Storage > New bucket :
--   Nom      : event-covers
--   Public   : OUI (toggle "Public bucket")
-- Puis ajouter cette policy pour autoriser l'upload :
--   Storage > event-covers > Policies > Add policy
--   INSERT : TO authenticated, WITH CHECK (true)
--   SELECT : TO public, USING (true)
