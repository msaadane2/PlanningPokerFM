// mode strict de React (aide à détecter les erreurs en développement)
import { StrictMode } from "react";
// méthode moderne pour créer le point d’entrée React
import { createRoot } from "react-dom/client";
// composant principal de l’application
import App from "./App";
// récupération de la div root dans le HTML
const rootElement = document.getElementById("root");
// création de la racine React
const root = createRoot(rootElement);
// rendu de l’application dans le DOM
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
