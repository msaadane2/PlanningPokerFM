// Règles de calcul : moyenne, médiane, majorités
// récupère uniquement les votes numériques (ignore ☕ et ?)
function onlyNumbers(votes) {
  return Object.values(votes).filter((v) => typeof v === "number");
}
// règle de la moyenne
export function ruleAverage(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
  return Math.round(avg);
}
// règle de la médiane
export function ruleMedian(votes) {
  const arr = onlyNumbers(votes).sort((a, b) => a - b);
  if (arr.length === 0) return null;
  const mid = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) return arr[mid];
  return Math.round((arr[mid - 1] + arr[mid]) / 2);
}
// règle de la majorité absolue (> 50%)
export function ruleMajorityAbsolute(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  // comptage des occurrences de chaque valeur
  const freq = {};
  arr.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  const total = arr.length;
  let best = null;
  let bestCount = 0;
  // recherche de la valeur la plus fréquente
  Object.entries(freq).forEach(([k, c]) => {
    if (c > bestCount) {
      best = Number(k);
      bestCount = c;
    }
  });
  // valide seulement si plus de la moitié des votes
  return bestCount > total / 2 ? best : null;
}
// règle de la majorité relative (la plus fréquente)
export function ruleMajorityRelative(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  // comptage des occurrences
  const freq = {};
  arr.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  let best = null;
  let bestCount = 0;
  // on garde la valeur avec le plus de votes
  Object.entries(freq).forEach(([k, c]) => {
    if (c > bestCount) {
      best = Number(k);
      bestCount = c;
    }
  });
  return best;
}
// applique la règle choisie selon le mode de jeu
export function applyRule(mode, votes) {
  switch (mode) {
    case "moyenne":
      return ruleAverage(votes);
    case "mediane":
      return ruleMedian(votes);
    case "maj_abs":
      return ruleMajorityAbsolute(votes);
    case "maj_rel":
      return ruleMajorityRelative(votes);
    case "strict":
    default: {
      // en mode strict : tous les votes doivent être identiques
      const arr = onlyNumbers(votes);
      if (arr.length === 0) return null;
      const ok = arr.every((x) => x === arr[0]);
      return ok ? arr[0] : null;
    }
  }
}
