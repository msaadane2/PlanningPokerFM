// Fonctions pour tester l'unanimité et les cas spéciaux de vote
// vérifie si tous les joueurs ont voté la même valeur numérique
export function isUnanimous(votes, players) {
  // aucun joueur : pas d’unanimité
  if (!players || players.length === 0) return false;
  // vérifie que tous les joueurs ont voté
  const allVoted = players.every((p) => p in votes);
  if (!allVoted) return false;
  // récupère uniquement les votes numériques
  const numerics = players
    .map((p) => votes[p])
    .filter((v) => typeof v === "number");
  // s’il y a des votes non numériques, ce n’est pas unanime
  if (numerics.length !== players.length) return false;
  // vérifie que toutes les valeurs sont identiques
  return numerics.every((x) => x === numerics[0]);
}
// vérifie si tous les joueurs ont voté la carte café ☕
export function everyoneCoffee(votes, players) {
  // aucun joueur → faux
  if (!players || players.length === 0) return false;
  // tous les joueurs doivent avoir voté
  if (!players.every((p) => p in votes)) return false;
  // tous les votes doivent être ☕
  return players.every((p) => votes[p] === "☕");
}
// vérifie s’il existe au moins un vote indécis "?"
export function hasIndecisive(votes) {
  return Object.values(votes).some((v) => v === "?");
}
