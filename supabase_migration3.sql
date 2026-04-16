-- ══════════════════════════════════════════════════════
-- SwissOut — Migration 3 : reviews + newsletter
-- À exécuter dans l'éditeur SQL de Supabase
-- ══════════════════════════════════════════════════════

-- Avis et notes
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id     UUID REFERENCES evenements(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique reviews"  ON reviews FOR SELECT USING (true);
CREATE POLICY "Insert review anonyme"     ON reviews FOR INSERT WITH CHECK (true);

-- Abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  lang         TEXT DEFAULT 'fr',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert subscriber"  ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Select subscriber"  ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Delete subscriber"  ON newsletter_subscribers FOR DELETE USING (true);
