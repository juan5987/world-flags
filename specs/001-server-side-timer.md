# 001 — Timer autoritatif serveur (anti-triche)

## Description

Le timer du quiz est actuellement client (`PlayService`, `setInterval`) donc exploitable
(pause DevTools, horloge système, throttling d'onglet). On passe à un modèle **timestamp
hybride serveur-autoritaire** : le backend possède `startedAt` + `durationMs`, le front
affiche un décompte local (horloge monotone), et le serveur revalide la fenêtre de temps à
la fin de partie pour accepter ou refuser le score. Prérequis : le front doit d'abord obtenir
et attacher le JWT maison (déjà émis par `POST /auth/google`).

> **Profil absent** : pas de `.claude/project-profile.md`, pas de `CLAUDE.md` repo. Grille
> universelle appliquée. Paramètres maison non vérifiés et donc supposés depuis le code observé :
> - naming des services de session/store (règle de suffixe non vérifiée) ;
> - lib de validation front (aucune détectée — pas de zod dans `package.json`) ;
> - runner de test front **et** back (aucun détecté dans les `package.json` — cf. Risques).

## Plan technique

### 1. Architecture

Deux phases séquentielles. Décisions structurantes actées en **ADR-0001** (timer autoritatif)
et **ADR-0002** (session JWT + interceptor).

```
Phase 1 (prérequis JWT)
  Google OIDC (angular-oauth2-oidc, code flow, existant)
    → GoogleAuthService récupère id_token
      → AuthGateway.POST api/auth/google { idToken }
        → backend vérifie (google-auth-library) + upsert user + émet JWT   [EXISTANT]
      ← { accessToken, user }
    → AuthTokenStore.set(accessToken)  (signal + localStorage)
    → GoogleAuthService.user.set(user)  (source unique)
  authTokenInterceptor : attache Bearer aux requêtes `api/` uniquement

Phase 2 (timer serveur)
  QuizComponent (constructeur)
    → PlayService.initializeGame()
        → FlagService.getFlagsByLevel()            [EXISTANT]
        → GamesGateway.POST api/games              [protégé JwtAuthGuard]
          ← { id, startedAt, durationMs }
        → ancre performance.now(), démarre le tick signal
  Décompte : setInterval bumpe `nowTick` (~250ms) ; `remaining = computed(...)`
  remaining atteint 0 → effect() → endGame()
    → GamesGateway.POST api/games/:id/end { score } [protégé]
      → serveur recalcule elapsedMs, valide la fenêtre, MAJ bestScore autoritaire
      ← { status, scoreAccepted, bestScore }
```

Acteurs backend : `GamesController` → `GamesService` → `PrismaService`. `JwtAuthGuard` +
`JwtStrategy` (existants) injectent `req.user` (l'entité `User` complète).

**a11y landmarks** : hors périmètre — aucune modification de structure de page (`QuizComponent`
reste imbriqué dans son shell existant, aucun `contentinfo`/`banner`/`main` réémis).

### 2. Fichiers à créer / modifier

**Backend — Phase 2**
- `server/prisma/schema.prisma` — *modifier* : ajouter `model Game`, `enum GameStatus`, relation `games Game[]` sur `User`.
- `server/prisma/migrations/<generée>/migration.sql` — *créé* par `prisma migrate dev` (ne pas écrire à la main).
- `server/src/games/games.module.ts` — *créé* : module, importe `PrismaModule`.
- `server/src/games/games.service.ts` — *créé* : création partie + logique de fin/validation fenêtre + MAJ bestScore.
- `server/src/games/games.controller.ts` — *créé* : `POST /games`, `POST /games/:id/end`, tous deux `@UseGuards(JwtAuthGuard)`.
- `server/src/games/dto/end-game.dto.ts` — *créé* : `{ score }` validé class-validator.
- `server/src/games/game.constants.ts` — *créé* : `DURATION_MS`, `EARLY_SKEW_MS`, `LATE_GRACE_MS`.
- `server/src/auth/current-user.decorator.ts` — *créé* (optionnel) : `@CurrentUser()` extrait `req.user` (sinon `@Req()` typé).
- `server/src/app.module.ts` — *modifier* : enregistrer `GamesModule`.

**Frontend — Phase 1**
- `src/app/models/auth.model.ts` — *créé* : `AuthResponse { accessToken: string; user: User }`.
- `src/app/data/gateways/auth.gateway.ts` — *créé* : `exchangeGoogleIdToken(idToken): Observable<AuthResponse>` → `POST api/auth/google`.
- `src/app/data/services/auth-token-store.ts` — *créé* : signal `accessToken`, `set/clear`, persistance localStorage, `token()` (lecture sync pour l'interceptor).
- `src/app/interceptors/auth-token.interceptor.ts` — *créé* : `HttpInterceptorFn`, Bearer sur `api/` seulement.
- `src/app/app.config.ts` — *modifier* : `withInterceptors([authTokenInterceptor])`.
- `src/app/data/services/google-auth.service.ts` — *modifier* : hook d'échange id_token→JWT, user depuis la réponse, `clear` du token au logout, suppression du chemin `GET /users?userId=`.

**Frontend — Phase 2**
- `src/app/models/game.model.ts` — *créé* : `ActiveGame`, `EndGameResult` (voir §3).
- `src/app/data/gateways/games.gateway.ts` — *créé* : `createGame()`, `endGame(id, score)`.
- `src/app/data/services/play.service.ts` — *modifier* : `initializeGame` crée la partie serveur ; timer via `nowTick` + `remaining` computed + `effect` de fin ; `endGame` poste `/end` ; suppression de `saveBestScore` (autorité serveur).
- `src/app/ui/features/quiz/quiz.component.ts` / `.html` — *modifier minimal* : `timer` reste exposé (computed secondes) → template quasi inchangé ; brancher l'état `scoreAccepted` si affichage souhaité.

> Naming : convention Angular v20+ AAK (pas de suffixe `.component.`). Suffixe `Gateway` pour
> les frontières I/O, `Store` pour l'état de session. Profil absent → à confirmer si le repo
> impose d'autres suffixes.

### 3. Modèles de données & contrats d'API

**Prisma (`schema.prisma`)**
```prisma
enum GameStatus { ACTIVE ENDED }

model Game {
  id         String     @id @default(cuid())
  userId     String     // référence User.id (cuid PK), PAS le googleId
  user       User       @relation(fields: [userId], references: [id])
  startedAt  DateTime   @default(now())
  durationMs Int
  endedAt    DateTime?
  score      Int        @default(0)
  status     GameStatus @default(ACTIVE)
  suspicious Boolean    @default(false)
  createdAt  DateTime   @default(now())
}
```
Ajouter sur `User` : `games Game[]`. `Game.userId` vient de `req.user.id` (l'entité renvoyée par
`JwtStrategy.validate`), **pas** de `req.user.userId` (googleId).

**Contrats HTTP** (préfixe front `api/` réécrit `→ /` par `proxy.conf.json`)
- `POST /auth/google` → body `{ idToken: string }` → `{ accessToken: string, user: User }`. **[EXISTANT — ne pas réécrire]**. NB : le DTO backend attend le champ `idToken`.
- `POST /games` (JwtAuthGuard) → body vide → `{ id: string, startedAt: string (ISO), durationMs: number }`.
- `POST /games/:id/end` (JwtAuthGuard) → body `{ score: number }` → `{ status: 'ENDED', scoreAccepted: boolean, bestScore: number }`.

**Types front (`game.model.ts`)**
```ts
type ActiveGame = { id: string; durationMs: number; anchorPerfMs: number };
type EndGameResult = { status: 'ENDED'; scoreAccepted: boolean; bestScore: number };
```
`anchorPerfMs` = `performance.now()` capturé à la réception de `POST /games` (jamais le `startedAt` serveur — cf. ADR-0001).

**DTO backend (`end-game.dto.ts`)** — validation au bord via class-validator (déjà utilisé côté serveur) :
`score: number` → `@IsInt() @Min(0) @Max(<borne plausible>)`. La borne haute est une valeur de
calibration produit (dépend du barème : +3/bonne, -1/mauvaise, durée) → poser une borne large et
la nommer en Risques.

**Validation front aux frontières** : aucune lib de validation détectée (`package.json` sans zod).
Le plan **n'ajoute pas** de dépendance sans validation utilisateur. Les gateways valident les réponses
par **type-guards manuels légers** (présence + `typeof` des champs `id/durationMs/scoreAccepted`).
Si le repo veut un standard runtime (zod), c'est une décision de dépendance à trancher avec l'utilisateur (cf. Risques).

### 4. Réactivité (signals d'abord — zoneless)

Le projet est **zoneless** (`provideZonelessChangeDetection`). Pattern du décompte, signals purs :
- `#nowTick = signal(0)` — bumpé par un `setInterval` (~250ms) : l'intervalle **ne fait que** poser un tick.
- `#activeGame = signal<ActiveGame | null>(null)`.
- `timer = computed(() => { const g = #activeGame(); if (!g) return 0; const rem = g.durationMs - (#nowTick() - g.anchorPerfMs); return Math.max(0, Math.ceil(rem / 1000)); })` — expose des **secondes**, nom `timer` conservé → `QuizComponent`/template quasi inchangés.
- `effect(() => { if (#activeGame() && timer() === 0) this.endGame(); })` — déclenche la fin quand le décompte atteint 0 ; `endGame` stoppe l'intervalle et poste `/end` (garde d'idempotence pour ne pas re-poster).

Pas de RxJS pour le décompte (pas un vrai flux). Les gateways HTTP restent en `Observable`
(`HttpClient`), consommés avec `takeUntilDestroyed` comme le reste du service.

### 5. État partagé & coordination

- **`AuthTokenStore`** (store de session) — remplit les 3 critères : (a) possède le JWT ; (b) partagé
  entre l'interceptor et les gateways (consommateurs non liés) ; (c) mutations = commandes internes
  (`set/clear`). Signal + persistance localStorage. **Ne** ré-expose **pas** un autre resource/store.
- **`GoogleAuthService`** reste une **facade** de feature auth (coordonne OIDC + gateway + store + user signal).
  Elle consomme `AuthGateway` et `AuthTokenStore` ; ne porte pas le suffixe `Store`.
- **`AuthGateway` / `GamesGateway`** (ports I/O) — axe orthogonal : possèdent la traversée HTTP,
  valident au bord, injectables (doublables in-memory pour tests). Aucun `HttpClient.get/post` brut ne
  doit rester dans un composant ou dans `PlayService`/`GoogleAuthService` → les appels `POST /games`,
  `/end`, `/auth/google` passent par un gateway.
- **`PlayService`** reste la facade de jeu (état de vue : score, flag courant, timer). Elle consomme
  `GamesGateway`. Pas de nouveau store.

### 6. Cross-platform

Sans objet : pas de cible native déclarée (pas de Capacitor dans `package.json`). Aucune abstraction
plateforme requise. `performance.now()` et `localStorage` sont des API web standard disponibles.

### 7. Choix de bibliothèques

**Aucune nouvelle dépendance.** Tout est couvert par l'existant :
- Backend : `@nestjs/*`, `@prisma/client`, `class-validator` (déjà présents) — nouveau module Games seulement.
- Front : signals Angular natifs, `HttpInterceptorFn` natif, `performance.now()`/`localStorage` natifs,
  `angular-oauth2-oidc` (déjà présent) pour récupérer l'id_token.
- Validation runtime front : type-guards manuels (pas de zod ajouté sans accord — cf. Risques).

### 8. Risques & inconnues

- **Limite de sécurité assumée (majeure)** : le serveur ne valide que la **fenêtre de temps**, pas le
  **score** (calculé client depuis les réponses). Un client instrumenté peut fabriquer un score dans une
  fenêtre valide. Sous-spécifié dans la Description : une anti-triche complète imposerait au serveur de
  piloter questions/réponses (refonte hors périmètre). À acter avec le produit.
- **Calibration produit couplée** : `EARLY_SKEW_MS` / `LATE_GRACE_MS` (fenêtre de validation) et la borne
  `@Max` du score dépendent de la latence réseau réelle, du coût de rendu Game Over et du barème
  (+3/-1, durée). Défauts posés en implémentation ; trop serré = faux positifs sur joueurs honnêtes,
  trop large = fenêtre d'exploit. **Calibration finale à valider (produit/QA)** — le plan tranche les
  valeurs mais parie sur ces hypothèses.
- **Dépendances non vérifiées** : (a) `angular-oauth2-oidc` `getIdToken()` — confirmer contre `^21.0.3`
  (invoquer `docs`) ; (b) aucun runner de test détecté dans les deux `package.json` — la phase `qa`
  (RED) devra d'abord poser l'infra de test (Vitest front + Jest back) ; hors périmètre architecte, à
  signaler à l'utilisateur. (c) Secret Google en clair dans `src/environments/environment.ts` — viole
  « zéro secret dans le source » ; pré-existant, à traiter hors de cette spec.
