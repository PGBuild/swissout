-- ══════════════════════════════════════════════════════════
-- SwissOut — Row Level Security
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)
-- ══════════════════════════════════════════════════════════


-- ── 1. TABLE : evenements ──────────────────────────────────

ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;

-- Tout le monde (anon + auth) peut lire les événements approuvés
CREATE POLICY "Lecture événements approuvés"
  ON evenements FOR SELECT
  USING (statut = 'approuve');

-- Un organisateur connecté peut lire SES propres événements (y compris en attente / refusés)
CREATE POLICY "Organisateur lit ses événements"
  ON evenements FOR SELECT
  TO authenticated
  USING (organisateur_id = auth.uid());

-- Un organisateur connecté peut créer un événement en son nom uniquement
CREATE POLICY "Organisateur crée ses événements"
  ON evenements FOR INSERT
  TO authenticated
  WITH CHECK (organisateur_id = auth.uid());

-- Un organisateur connecté peut modifier SES événements
CREATE POLICY "Organisateur modifie ses événements"
  ON evenements FOR UPDATE
  TO authenticated
  USING (organisateur_id = auth.uid());

-- Un organisateur connecté peut supprimer SES événements
CREATE POLICY "Organisateur supprime ses événements"
  ON evenements FOR DELETE
  TO authenticated
  USING (organisateur_id = auth.uid());


-- ── 2. TABLE : event_stats ─────────────────────────────────

ALTER TABLE event_stats ENABLE ROW LEVEL SECURITY;

-- N'importe quel visiteur (anon ou auth) peut enregistrer un tracking
CREATE POLICY "Insertion tracking anonyme"
  ON event_stats FOR INSERT
  WITH CHECK (true);

-- Un organisateur connecté peut lire les stats de SES événements uniquement
CREATE POLICY "Organisateur lit stats de ses événements"
  ON event_stats FOR SELECT
  TO authenticated
  USING (
    evenement_id IN (
      SELECT id FROM evenements
      WHERE organisateur_id = auth.uid()
    )
  );
