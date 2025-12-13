import renderer from "react-test-renderer";
import App from "./App";

test("App se render sans crash", () => {
  renderer.create(<App />);
});
