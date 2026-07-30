// Calibration placeholders — à valider par produit/QA en fonction de la latence
// réseau réelle, du coût de rendu Game Over et du barème (+3/-1, durée).
export const DURATION_MS = 60000;

// Tolérance si la partie se termine légèrement AVANT la durée théorique
// (dérive d'horloge monotone, arrondi du décompte côté client).
export const EARLY_SKEW_MS = 500;

// Tolérance si la partie se termine APRÈS la durée théorique
// (latence réseau, coût du POST /end).
export const LATE_GRACE_MS = 1000;
