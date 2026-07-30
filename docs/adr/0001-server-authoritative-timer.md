# ADR-0001 — Timer autoritatif serveur (modèle timestamp hybride)

Statut : accepté — 2026-07-30

## Context

Le timer du quiz est aujourd'hui purement client (`PlayService.startTimer`, `setInterval`
qui décrémente un signal chaque seconde). Il est exploitable : pause via DevTools,
manipulation de l'horloge système, throttling d'onglet. Le score final est calculé
client (`actualScore`) puis poussé en best-effort via `PUT /users/:userId` (aujourd'hui
401 car le JWT maison n'est pas envoyé).

On veut un timer non exploitable **sans polling**. Le backend NestJS + Prisma existe
déjà (auth Google + JWT opérationnels).

## Decision

Modèle **timestamp hybride, serveur autoritatif sur la fenêtre de temps** :

- Le backend crée une partie (`Game`) avec `startedAt` (serveur) et `durationMs` (constante
  serveur). Il renvoie `{ id, startedAt, durationMs }`.
- Le **client n'utilise PAS `startedAt` serveur pour son décompte d'affichage** (les horloges
  client/serveur divergent). Il ancre le décompte sur une horloge **monotone** locale
  (`performance.now()`) capturée à la réception de la réponse : `remainingMs = durationMs -
  (performance.now() - anchor)`. `performance.now()` est immune à la manipulation de l'horloge
  système *pendant* la partie.
- À la fin, le client poste `POST /games/:id/end { score }`. Le serveur recalcule
  `elapsedMs = Date.now() - startedAt` (horloge murale serveur, seule autorité) et valide la
  fenêtre avant d'accepter le score.

Fenêtre de validation serveur :
- `elapsedMs < durationMs - EARLY_SKEW_MS` → fin trop précoce (horloge manipulée / triche) → score refusé.
- `elapsedMs > durationMs + LATE_GRACE_MS` → partie jouée au-delà de sa fenêtre (pause/DevTools) → score refusé.
- Sinon → score accepté, best-score mis à jour côté serveur (autorité déplacée hors du client).

En cas de refus : la partie est clôturée (`status = ENDED`, `suspicious = true`), le best-score
**n'est pas** mis à jour, réponse `200 { status, scoreAccepted: false }` (pas de 4xx : ne casse pas l'UX Game Over).

## Consequences

- Positif : pause / clock-skew / throttling ne rallongent plus la partie sans détection. Best-score
  devient autoritatif serveur (fixe aussi le 401 actuel du `PUT /users`). Zéro polling.
- Négatif / limite assumée : **le serveur ne valide que la FENÊTRE de temps, pas le score lui-même.**
  Le score reste calculé client à partir des réponses ; un client instrumenté peut fabriquer un
  score plausible dans une fenêtre de temps valide. Une vraie anti-triche imposerait au serveur de
  piloter questions/réponses (hors périmètre de cette spec — cf. Risques).
- `EARLY_SKEW_MS` / `LATE_GRACE_MS` sont des valeurs de **calibration produit** couplées à la latence
  réseau réelle et au coût de rendu du Game Over : trop serré → faux positifs sur joueurs honnêtes ;
  trop large → fenêtre d'exploit. Défauts posés en implémentation, **calibration finale à valider** (cf. Risques de la spec).

## Alternatives considered

- **Polling serveur du remaining** : rejeté — trafic constant, pas nécessaire, le modèle timestamp suffit.
- **Countdown client ancré sur `startedAt` serveur + `Date.now()`** : rejeté — sensible au décalage
  d'horloge client/serveur pour l'affichage, et manipulable pendant la partie via l'horloge système.
- **WebSocket tick serveur** : rejeté — surdimensionné pour un simple compte à rebours, ajoute une dépendance.
