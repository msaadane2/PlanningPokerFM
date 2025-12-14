// fonction qui calcule le résultat selon le mode choisi
import { applyRule } from "../services/rules.js";
// composant qui affiche le résultat des votes
export default function ResultsPanel({ mode, votes, revealed }) {
  return (
    <>
      {/* styles CSS du panneau de résultat */}
      <style>
        {`
        /* carte principale du résultat */
        .result-card {
          margin-top: 20px;
          padding: 16px;
          border-radius: 18px;
          background: linear-gradient(
              135deg,
              rgba(236, 72, 153, 0.15),
              rgba(168, 85, 247, 0.1)
            ),
            rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.4);
          backdrop-filter: blur(10px);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.85);
          color: var(--text-main);
        }
        /* titre du résultat */
        .result-title {
          font-size: 1.1rem;
          margin: 0 0 8px;
          font-weight: 600;
        }
        /* valeur finale proposée */
        .result-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent);
        }
        `}
      </style>
      {/* bloc résultat */}
      <section className="result-card">
        {/* si les votes ne sont pas encore révélés */}
        {!revealed ? (
          <>
            <h2 className="result-title">Résultat</h2>
            <p>Révèle les votes pour voir la proposition de difficulté.</p>
          </>
        ) : (
          <>
            {/* affichage du résultat après révélation */}
            <h2 className="result-title">Résultat ({mode})</h2>
            <p>
              Valeur proposée :{" "}
              <span className="result-value">
                {applyRule(mode, votes) ?? "—"}
              </span>
            </p>
          </>
        )}
      </section>
    </>
  );
}
