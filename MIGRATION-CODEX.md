# Migration GitHub Banana Navy — Codex

La plateforme `voicebot-canicule` a été migrée vers l'organisation GitHub Banana Navy par Codex le 17 août 2026.

- Dépôt canonique : `Banana-Navy/voicebot-canicule`
- GitHub Pages : https://banana-navy.github.io/voicebot-canicule/
- Commit de production validé : `d7d943295bd039a00d4fc319b66b81bba416d8ed`
- Dépôt de rollback temporaire : `aivansoul/voicebot-canicule`

La migration n'a modifié ni le bundle de production, ni l'endpoint Supabase, ni l'agent ElevenLabs, ni les workflows n8n. Les fichiers servis par l'ancienne et la nouvelle GitHub Pages ont été comparés par SHA-256 et sont identiques.

Un appel réel lancé depuis la nouvelle URL a atteint l'agent de production v2.42, enregistré les deux côtés de l'appel et exécuté une seule clôture suivie d'un seul `end_call`. La testeuse a confirmé que l'appel était parfait.

Les anciennes pull requests restent consultables dans le dépôt personnel de rollback, car elles ne font pas partie de l'historique Git répliqué.
