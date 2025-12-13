import { applyRule } from "./rules";

test("mode strict : unanimité → valeur validée", () => {
  const votes = {
    manel: 5,
    fatine: 5,
  };

  expect(applyRule("strict", votes)).toBe(5);
});

test("majorité absolue : aucune valeur n’a plus de 50% des votes", () => {
  const votes = {
    manel: 3,
    fatine: 5,
  };

  expect(applyRule("maj_abs", votes)).toBe(null);
});
