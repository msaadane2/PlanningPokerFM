// Fonctions pour tester l'unanimité, le cas "tout le monde café"

export function isUnanimous(votes, players) {
  if (!players || players.length === 0) return false;

  const allVoted = players.every((p) => p in votes);
  if (!allVoted) return false;

  const numerics = players
    .map((p) => votes[p])
    .filter((v) => typeof v === "number");

  if (numerics.length !== players.length) return false;
  return numerics.every((x) => x === numerics[0]);
}

export function everyoneCoffee(votes, players) {
  if (!players || players.length === 0) return false;
  if (!players.every((p) => p in votes)) return false;
  return players.every((p) => votes[p] === "☕");
}

export function hasIndecisive(votes) {
  return Object.values(votes).some((v) => v === "?");
}
