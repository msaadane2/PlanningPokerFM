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

  // numéro du tour pour l’US courante (1 = premier tour)
  const [round, setRound] = useState(1);

  // joueur dont on affiche les cartes (pour vue "un joueur à la fois")
  const [viewPlayer, setViewPlayer] = useState("");

  // US en cours
  const currentUS = started && backlog.length > 0 ? backlog[index] : undefined;

  // Votes numériques uniquement (on ignore café et ?)
  const numericVotes = useMemo(
    () => Object.values(votes).filter((v) => typeof v === "number"),
    [votes]
  );
  // Tous les joueurs ont voté
  const canReveal = players.length > 0 && players.every((p) => p in votes);

  // Garder une vue joueur cohérente quand la liste des joueurs change
  useEffect(() => {
    if (players.length === 0) {
      setViewPlayer("");
    } else if (!players.includes(viewPlayer)) {
      // Si le joueur sélectionné n’existe plus, on prend le premier
      setViewPlayer(players[0]);
    }
  }, [players, viewPlayer]);

  // Lancer / relancer la partie
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
    setFinals({});
    setStarted(true);
    setRound(1); // on commence toujours au tour 1 pour la première US
  };

  // Un joueur clique sur une carte
  const onVote = (player, card) => {
    if (revealed) return; // si les cartes sont déjà révélées, on ne change plus
    setVotes((prev) => ({ ...prev, [player]: card }));
  };

  // Révéler les votes
  const onReveal = () => {
    setRevealed(true);
  };

  // Passer à l’US suivante (ou finir le backlog)
  const onNext = () => {
    if (!currentUS) return;

    const currId = currentUS.id ?? `US${index + 1}`;

    // Cas spécial : tout le monde a joué "☕" : on sauvegarde un snapshot
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
      // On reste sur la même US mais on relance un tour
      setVotes({});
      setRevealed(false);
      setRound(1);
      return;
    }

    // Calcul de la valeur finale pour cette US
    let finalValue = null;

    if (mode === "strict") {
      // Mode strict : on veut l’unanimité, sinon on refait un tour
      if (!isUnanimous(votes, players)) {
        setVotes({});
        setRevealed(false);
        setRound(1); // on considère que chaque essai est de nouveau un "tour 1"
        return;
      }
      // Ici, tous les joueurs ont la même valeur
      finalValue = numericVotes.length ? numericVotes[0] : null;
    } else {
      // Modes non stricts : moyenne / médiane / majorités
      // Règle du sujet : le premier tour se joue à l’unanimité
      if (!isUnanimous(votes, players)) {
        if (round === 1) {
          // Premier tour sans unanimité : on force un deuxième tour
          setVotes({});
          setRevealed(false);
          setRound(2);
          return;
        } else {
          // À partir du deuxième tour, on applique la règle choisie
          finalValue = applyRule(mode, votes);
        }
      } else {
        // Unanimité atteinte (peu importe le tour)
        finalValue = numericVotes.length ? numericVotes[0] : null;
      }
    }

    // Mise à jour des résultats pour cette US
    const newFinals = { ...finals, [currId]: finalValue };
    setFinals(newFinals);

    // US suivante ou fin du backlog
    if (index < backlog.length - 1) {
      // On passe à l’US suivante
      setIndex(index + 1);
      setVotes({});
      setRevealed(false);
      setRound(1); // on revient au tour 1 pour la nouvelle US
    } else {
      // Plus d’US dans le backlog : on exporte le fichier final
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
      setRound(1);
    }
  };

  // Charger une partie sauvegardée (export)
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
    setRound(1);
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
          {/* US en cours (affichage simple du titre / id) */}
          <section
            style={{
              marginTop: 16,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <h2>US en cours</h2>
            <p>
              <strong>{currentUS.id}</strong> - {currentUS.title}
            </p>
            <p>Tour actuel : {round}</p>
          </section>

          {/* Timer */}
          <Timer seconds={90} onTimeUp={() => setRevealed(true)} />

          {/* Cartes : vue pour un joueur à la fois */}
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

          {/* Résultat selon le mode choisi */}
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
                setRound(1);
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
