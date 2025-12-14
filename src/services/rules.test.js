// on importe la fonction qui applique les règles de vote
import { applyRule } from "./rules";
// test du mode strict : tous les votes sont identiques
test("mode strict : unanimité → valeur validée", () => {
  const votes = {
    manel: 5,
    fatine: 5,
  };
  // si tout le monde vote pareil, la valeur est acceptée
  expect(applyRule("strict", votes)).toBe(5);
});
// test de la majorité absolue sans majorité (> 50%)
test("majorité absolue : aucune valeur n’a plus de 50% des votes", () => {
  const votes = {
    manel: 3,
    fatine: 5,
  };
  // aucune valeur n'a plus de la moitié des votes : null
  expect(applyRule("maj_abs", votes)).toBe(null);
});
