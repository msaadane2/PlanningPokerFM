// Affiche les cartes pour le joueur sélectionné
// valeurs possibles des cartes de planning poker
const CARDS = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, "☕", "?"];
// association valeur : image de carte
const CARD_IMAGES = {
  0: "/cartes/cartes_0.svg",
  1: "/cartes/cartes_1.svg",
  2: "/cartes/cartes_2.svg",
  3: "/cartes/cartes_3.svg",
  5: "/cartes/cartes_5.svg",
  8: "/cartes/cartes_8.svg",
  13: "/cartes/cartes_13.svg",
  20: "/cartes/cartes_20.svg",
  40: "/cartes/cartes_40.svg",
  100: "/cartes/cartes_100.svg",
  "☕": "/cartes/cartes_cafe.svg",
  "?": "/cartes/cartes_interro.svg",
};
export default function CardSet({
  players, // liste des joueurs
  votes, // votes actuels { joueur: valeur }
  onVote, // fonction appelée quand un joueur vote
  disabled, // désactive le vote si les cartes sont révélées
  viewPlayer, // joueur actuellement affiché
  setViewPlayer, // change le joueur affiché
}) {
  // joueur courant valide (sinon chaîne vide)
  const current = viewPlayer && players.includes(viewPlayer) ? viewPlayer : "";
  return (
    <>
      {/* styles CSS locaux au composant */}
      <style>
        {`
        /* conteneur principal des cartes */
        .cards-root {
          margin-top: 20px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          backdrop-filter: blur(12px);
        }
        /* en-tête avec titre et sélection du joueur */
        .cards-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        /* titre */
        .cards-header h2 {
          margin: 0;
          font-size: 1.2rem;
        }
        /* menu déroulant pour choisir le joueur */
        .player-select {
          border-radius: 999px;
          padding: 6px 10px;
          border: 1px solid rgba(148,163,184,0.6);
          background: rgba(15,23,42,0.95);
          color: var(--text-main);
          font-size: 0.9rem;
        }
        /* bloc contenant les cartes d’un joueur */
        .player-card-block {
          margin-top: 14px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(31, 41, 55, 0.9);
        }
        /* nom du joueur */
        .player-card-block h4 {
          margin: 0 0 10px;
          font-size: 1.05rem;
          font-weight: 600;
          text-align: center;
        }
        /* liste des cartes */
        .cards-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        /* bouton carte */
        .card-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          border-radius: 12px;
        }
        /* effet au survol */
        .card-btn:hover {
          transform: scale(1.06);
        }
        /* carte sélectionnée */
        .card-btn.selected {
          box-shadow: 0 0 10px var(--accent);
          border-radius: 12px;
        }
        /* image de la carte */
        .card-img {
          width: 90px;
          height: 130px;
          object-fit: contain;
          border-radius: 12px;
        }
        /* info sur le vote actuel */
        .vote-info {
          margin-top: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
        }
        /* message quand aucun joueur n’est présent */
        .cards-empty {
          margin-top: 10px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        `}
      </style>
      {/* zone principale des cartes */}
      <section className="cards-root">
        <div className="cards-header">
          <h2
            style={{
              width: "100%",
              textAlign: "center",
              margin: 0,
              fontWeight: "bold",
              background:
                "linear-gradient(90deg, #38bdf8, #2563eb, #ec4899, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vote par cartes de Planning Poker{" "}
          </h2>

          {/* choix du joueur à afficher */}
          {players.length > 0 && (
            <select
              className="player-select"
              value={current || (players[0] ?? "")}
              onChange={(e) => setViewPlayer(e.target.value)}
            >
              {players.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* message si aucun joueur */}
        {players.length === 0 ? (
          <p className="cards-empty">
            Ajoute des joueurs dans le menu pour commencer à voter.
          </p>
        ) : (
          current && (
            <div className="player-card-block">
              {/* nom du joueur courant */}
              <h4>{current}</h4>
              {/* affichage des cartes */}
              <div className="cards-list">
                {CARDS.map((c) => (
                  <button
                    key={c}
                    className={
                      votes[current] === c ? "card-btn selected" : "card-btn"
                    }
                    onClick={() => onVote(current, c)}
                    disabled={disabled}
                  >
                    {/* image de la carte */}
                    <img src={CARD_IMAGES[c]} className="card-img" alt="" />
                  </button>
                ))}
              </div>
              {/* affichage du vote actuel */}
              <div className="vote-info">
                Vote : <b>{votes[current] ?? "—"}</b>
              </div>
            </div>
          )
        )}
      </section>
    </>
  );
}
