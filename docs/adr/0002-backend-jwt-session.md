# ADR-0002 — Session JWT backend à partir de l'id_token Google + interceptor HTTP

Statut : accepté — 2026-07-30

## Context

Le front s'authentifie via `angular-oauth2-oidc` (code flow Google, `GoogleAuthService`).
Il obtient les claims Google client, puis **interroge son propre backend** (`GET /users?userId=<sub>`)
pour retrouver/créer l'utilisateur. Il **ne récupère jamais le JWT maison** émis par le backend
(`POST /auth/google` renvoie déjà `{ accessToken, user }`), donc les routes protégées par
`JwtAuthGuard` (`PUT /users/:userId`, et bientôt `POST /games`, `POST /games/:id/end`) échouent en 401.

## Decision

- Après login OIDC valide, `GoogleAuthService` récupère l'**id_token Google** et le POST à
  `POST /api/auth/google { idToken }` (le backend le vérifie via `google-auth-library` et upsert
  l'utilisateur — code déjà en place).
- La réponse `{ accessToken, user }` devient la **source de vérité unique** du user connecté :
  `accessToken` stocké dans un store de session, `user` set dans le signal existant. On **supprime**
  le double-chemin actuel (`GET /users?userId=` dans `initAfterRedirect`) — deux consommateurs
  dérivant le user de deux façons = incohérence à éliminer.
- Le JWT est attaché aux appels **`api/` uniquement** par un `HttpInterceptorFn` fonctionnel
  (`Authorization: Bearer <jwt>`). Les requêtes hors `api/` (notamment le proxy d'images de drapeaux
  vers une URL externe dans `FlagProxyService`) ne reçoivent **jamais** le bearer.
- Stockage du token : signal en mémoire (source de vérité, consommé par l'interceptor et les gateways)
  **persisté en `localStorage`** pour survivre au reload, par cohérence avec `angular-oauth2-oidc`
  qui persiste déjà ses propres tokens au même endroit.

## Consequences

- Positif : routes protégées fonctionnelles, user unifié, séparation nette I/O (gateway) / état de
  session (store) / attachement transport (interceptor).
- Négatif / risque : le JWT en `localStorage` est exposé au XSS (au même titre que les tokens OIDC déjà
  présents). Acceptable ici (mêmes garanties que l'existant) ; à revoir si durcissement sécurité (cf. Risques).
- La récupération de l'id_token dépend de l'API `angular-oauth2-oidc` (`getIdToken()`) — à confirmer
  contre la version installée (`^21.0.3`).

## Alternatives considered

- **Garder les claims OIDC client, protéger les routes autrement** : rejeté — le backend valide déjà
  l'id_token et émet un JWT ; réutiliser ce mécanisme est cohérent et déjà codé.
- **Token uniquement en mémoire (pas de persistance)** : rejeté — déconnexion à chaque reload,
  régression UX vs l'existant qui persiste la session.
- **Attacher le bearer à toutes les requêtes** : rejeté — fuite du token vers l'hôte externe des images.
