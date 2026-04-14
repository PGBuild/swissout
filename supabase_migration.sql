-- Migration: ajout des champs réseaux sociaux
-- À exécuter dans l'éditeur SQL de Supabase

ALTER TABLE evenements
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- Vérification des colonnes existantes (déjà présentes) :
-- lien_billetterie TEXT  → URL billetterie
-- adresse TEXT           → adresse physique (utilisée pour Maps)
