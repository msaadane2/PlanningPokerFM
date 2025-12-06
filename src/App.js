// Projet Planning Poker - Fatine & Manel (M1 Info)

import { useState, useMemo, useEffect } from "react";
import Menu from "./components/Menu.jsx";
import CardSet from "./components/CardSet.jsx";
import VoteBoard from "./components/VoteBoard.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import Timer from "./components/Timer.jsx";
import { saveStateAsJson, loadStateFromFile } from "./services/jsonManager.js";
import { applyRule } from "./services/rules.js";
import { isUnanimous, everyoneCoffee } from "./services/voteLogic.js";

export default function App() {
  // États globaux de la partie
  const [players, setPlayers] = useState([]);
  const [mode, setMode] = useState("strict");
  const [backlog, setBacklog] = useState([]);
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [finals, setFinals] = useState({});
  const [started, setStarted] = useState(false);

  //Nouveau : joueur dont on affiche les cartes
  const [viewPlayer, setViewPlayer] = useState("");

  const currentUS = started && backlog.length > 0 ? backlog[index] : undefined;

  // Votes numériques uniquement
  const numericVotes = useMemo(
    () => Object.values(votes).filter((v) => typeof v === "number"),
    [votes]
  );

  // Tous les joueurs ont voté
  const canReveal = players.length > 0 && players.every((p) => p in votes);

  // Garder une vue joueur cohérente quand la liste change
  useEffect(() => {
    if (players.length === 0) {
      setViewPlayer("");
    } else if (!players.includes(viewPlayer)) {
      setViewPlayer(players[0]); // premier joueur par défaut
    }
  }, [players, viewPlayer]);

  //Lancer / relancer la partie
  const handleStart = () => {
    if (players.length === 0) {
      alert("Ajoute au moins un joueur avant de lancer la partie.");
      return;
    }
    if (backlog.length === 0) {
      alert("Charge un backlog JSON avant de lancer la partie.");
      return;
    }

    setIndex(0);
    setVotes({});
    setRevealed(false);
    setStarted(true);
  };

  // Un joueur clique sur une carte
  const onVote = (player, card) => {
    if (revealed) return; // si c'est déjà révélé, on ne change plus
    setVotes((prev) => ({ ...prev, [player]: card }));
  };

  const onReveal = () => {
    setRevealed(true);
  };

  // Passer à l'US suivante (ou finir)
  const onNext = () => {
    if (!currentUS) return;

    const currId = currentUS.id ?? `US${index + 1}`;

    // 1) Cas spécial : tout le monde "☕" → snapshot
    if (everyoneCoffee(votes, players)) {
      saveStateAsJson(
        {
          mode,
          players,
          backlog,
          index,
          votes,
          finals,
        },
        "snapshot-coffee.json"
      );
      setVotes({});
      setRevealed(false);
      return;
    }

    // 2) Calcul de la valeur finale pour cette US
    let finalValue = null;

    if (mode === "strict") {
      if (!isUnanimous(votes, players)) {
        // pas d'accord : on revote
        setVotes({});
        setRevealed(false);
        return;
      }
      finalValue = numericVotes.length ? numericVotes[0] : null;
    } else {
      if (!isUnanimous(votes, players)) {
        finalValue = applyRule(mode, votes);
      } else {
        finalValue = numericVotes.length ? numericVotes[0] : null;
      }
    }

    // 3) Mise à jour des résultats
    const newFinals = { ...finals, [currId]: finalValue };
    setFinals(newFinals);

    // 4) US suivante ou fin du backlog
    if (index < backlog.length - 1) {
      setIndex(index + 1);
      setVotes({});
      setRevealed(false);
    } else {
      saveStateAsJson(
        {
          mode,
          players,
          backlog,
          results: newFinals,
        },
        "planning-poker-results.json"
      );
      alert("Backlog terminé. Résultats exportés en JSON.");
      setStarted(false);
      setVotes({});
      setRevealed(false);
    }
  };

  // Charger une partie sauvegardée
  const onImportState = async (file) => {
    const state = await loadStateFromFile(file);
    if (!state) return;

    setMode(state.mode ?? mode);
    setPlayers(state.players ?? players);
    setBacklog(state.backlog ?? backlog);
    setIndex(state.index ?? 0);
    setVotes(state.votes ?? {});
    setFinals(state.finals ?? {});
    setRevealed(false);
    setStarted(true);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>Planning Poker</h1>

      {/* Configuration de la partie */}
      <Menu
        players={players}
        setPlayers={setPlayers}
        mode={mode}
        setMode={setMode}
        backlog={backlog}
        setBacklog={setBacklog}
        onImportState={onImportState}
        onExportState={() =>
          saveStateAsJson(
            { mode, players, backlog, index, votes, finals },
            "state-export.json"
          )
        }
        onStart={handleStart}
      />

      {/* Zone de jeu : affichée seulement si la partie a démarré */}
      {currentUS && (
        <>
          {/* US en cours*/}
          <section
            style={{
              marginTop: 16,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          ></section>

          {/* Timer */}
          <Timer seconds={90} onTimeUp={() => setRevealed(true)} />

          {/* Cartes : pour un joueur à la fois (vue contrôlée par viewPlayer) */}
          <CardSet
            players={players}
            votes={votes}
            onVote={onVote}
            disabled={revealed}
            viewPlayer={viewPlayer}
            setViewPlayer={setViewPlayer}
          />

          {/* Résumé des votes + bouton "Révéler" */}
          <VoteBoard
            players={players}
            votes={votes}
            revealed={revealed}
            canReveal={canReveal}
            onReveal={onReveal}
          />

          {/* Résultat */}
          <ResultsPanel mode={mode} votes={votes} revealed={revealed} />

          {/* Boutons navigation */}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button disabled={!revealed} onClick={onNext}>
              {index < backlog.length - 1
                ? "Valider / US suivante"
                : "Valider et exporter"}
            </button>
            <button
              onClick={() => {
                setVotes({});
                setRevealed(false);
              }}
            >
              Revoter
            </button>
          </div>
        </>
      )}

      {!currentUS && backlog.length === 0 && (
        <p style={{ marginTop: 24, opacity: 0.8 }}>
          Charge un backlog JSON et configure la partie pour commencer.
        </p>
      )}
    </div>
  );
}
