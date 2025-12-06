// Règles de calcul : moyenne, médiane, majorités

function onlyNumbers(votes) {
  return Object.values(votes).filter((v) => typeof v === "number");
}

export function ruleAverage(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
  return Math.round(avg);
}

export function ruleMedian(votes) {
  const arr = onlyNumbers(votes).sort((a, b) => a - b);
  if (arr.length === 0) return null;
  const mid = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) return arr[mid];
  return Math.round((arr[mid - 1] + arr[mid]) / 2);
}

export function ruleMajorityAbsolute(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  const freq = {};
  arr.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  const total = arr.length;
  let best = null;
  let bestCount = 0;
  Object.entries(freq).forEach(([k, c]) => {
    if (c > bestCount) {
      best = Number(k);
      bestCount = c;
    }
  });
  return bestCount > total / 2 ? best : null;
}

export function ruleMajorityRelative(votes) {
  const arr = onlyNumbers(votes);
  if (arr.length === 0) return null;
  const freq = {};
  arr.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  let best = null;
  let bestCount = 0;
  Object.entries(freq).forEach(([k, c]) => {
    if (c > bestCount) {
      best = Number(k);
      bestCount = c;
    }
  });
  return best;
}

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
      const arr = onlyNumbers(votes);
      if (arr.length === 0) return null;
      const ok = arr.every((x) => x === arr[0]);
      return ok ? arr[0] : null;
    }
  }
}
