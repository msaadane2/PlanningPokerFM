// Projet Planning Poker - Fatine & Manel (M1 Info)
import { useState, useMemo, useEffect } from "react";
// composants de l'interface
import Menu from "./components/Menu.jsx";
import CardSet from "./components/CardSet.jsx";
import VoteBoard from "./components/VoteBoard.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import Timer from "./components/Timer.jsx";
import Chat from "./components/Chat.jsx";
// services (JSON + règles + logique de vote)
import { saveStateAsJson, loadStateFromFile } from "./services/jsonManager.js";
import { applyRule } from "./services/rules.js";
import { isUnanimous, everyoneCoffee } from "./services/voteLogic.js";
export default function App() {
  // liste des joueurs
  const [players, setPlayers] = useState([]);
  // mode de jeu choisi (strict, moyenne..)
  const [mode, setMode] = useState("strict");
  // backlog : liste des user stories
  const [backlog, setBacklog] = useState([]);
  // index de l'US courante dans le backlog
  const [index, setIndex] = useState(0);
  // votes en cours :
  const [votes, setVotes] = useState({});
  // est-ce qu'on a révélé les votes
  const [revealed, setRevealed] = useState(false);
  // résultats par US (historique)
  const [finals, setFinals] = useState({});
  // est-ce que la partie a démarré
  const [started, setStarted] = useState(false);
  // numéro du tour pour l'US courante (1 = premier tour)
  const [round, setRound] = useState(1);
  // joueur affiché (mode local : un joueur vote à la fois)
  const [viewPlayer, setViewPlayer] = useState("");
  // US en cours (si partie démarrée et backlog non vide)
  const currentUS = started && backlog.length > 0 ? backlog[index] : undefined;
  // votes numériques seulement (on ignore ☕ et ?)
  const numericVotes = useMemo(
    () => Object.values(votes).filter((v) => typeof v === "number"),
    [votes]
  );
  // on peut révéler seulement si tout le monde a voté
  const canReveal = players.length > 0 && players.every((p) => p in votes);
  // garder un viewPlayer valide quand les joueurs changent
  useEffect(() => {
    if (players.length === 0) {
      setViewPlayer("");
    } else if (!players.includes(viewPlayer)) {
      setViewPlayer(players[0]); // si l'ancien n'existe plus, on prend le 1er
    }
  }, [players, viewPlayer]);
  // démarrer la partie (ou relancer)
  const handleStart = () => {
    if (players.length === 0) {
      alert("Ajoute au moins un joueur avant de lancer la partie.");
      return;
    }
    if (backlog.length === 0) {
      alert("Charge un backlog JSON avant de lancer la partie.");
      return;
    }
    // reset au début du backlog
    setIndex(0);
    setVotes({});
    setRevealed(false);
    setFinals({});
    setStarted(true);
    setRound(1);
  };
  // un joueur choisit une carte
  const onVote = (player, card) => {
    if (revealed) return; // après révélation on bloque les changements
    setVotes((prev) => ({ ...prev, [player]: card }));
  };
  // révéler les votes
  const onReveal = () => {
    setRevealed(true);
  };
  // valider l'US et passer à la suivante (ou finir le backlog)
  const onNext = () => {
    if (!currentUS) return;
    // id de l'US (si jamais l'id n'existe pas)
    const currId = currentUS.id ?? `US${index + 1}`;
    // si tout le monde a mis ☕ : on sauvegarde un snapshot et on recommence
    if (everyoneCoffee(votes, players)) {
      saveStateAsJson(
        { mode, players, backlog, index, votes, finals },
        "snapshot-coffee.json"
      );
      // on reste sur la même US mais on relance le vote
      setVotes({});
      setRevealed(false);
      setRound(1);
      return;
    }
    // valeur finale choisie pour cette US
    let finalValue = null;
    if (mode === "strict") {
      // strict : unanimité obligatoire
      if (!isUnanimous(votes, players)) {
        setVotes({});
        setRevealed(false);
        setRound(1);
        return;
      }
      // en unanimité, la valeur est la même pour tous
      finalValue = numericVotes.length ? numericVotes[0] : null;
    } else {
      // autres modes : tour 1 = unanimité, tour (moyenne/médiane/majorité)
      if (!isUnanimous(votes, players)) {
        if (round === 1) {
          // premier tour : on force une discussion puis revote
          setVotes({});
          setRevealed(false);
          setRound(2);
          return;
        } else {
          // à partir du 2e tour : on applique la règle choisie
          finalValue = applyRule(mode, votes);
        }
      } else {
        // si unanimité quand même, on prend la valeur
        finalValue = numericVotes.length ? numericVotes[0] : null;
      }
    }
    // on ajoute le résultat dans l'historique
    const newFinals = { ...finals, [currId]: finalValue };
    setFinals(newFinals);
    // on écrit aussi l'estimation dans le backlog
    const updatedBacklog = backlog.map((us, i) =>
      i === index ? { ...us, estimate: finalValue } : us
    );
    setBacklog(updatedBacklog);
    // US suivante ou fin
    if (index < backlog.length - 1) {
      setIndex(index + 1);
      setVotes({});
      setRevealed(false);
      setRound(1);
    } else {
      // export final : backlog avec estimate pour chaque US
      saveStateAsJson(
        { mode, players, backlog: updatedBacklog },
        "planning-poker-results.json"
      );
      alert("Backlog terminé. Résultats exportés en JSON.");
      setStarted(false);
      setVotes({});
      setRevealed(false);
      setRound(1);
    }
  };
  // importer une partie sauvegardée (snapshot / état)
  const onImportState = async (file) => {
    const state = await loadStateFromFile(file);
    if (!state) return;
    // on récupère backlog et on s'assure que estimate existe
    const importedBacklog = (state.backlog ?? backlog).map((us) => ({
      ...us,
      estimate: us.estimate ?? null,
    }));
    setMode(state.mode ?? mode);
    setPlayers(state.players ?? players);
    setBacklog(importedBacklog);
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
      {/* menu de configuration */}
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
      {/* zone de jeu : affichée uniquement si on a une US courante */}
      {currentUS && (
        <>
          {/* affichage de l'US courante */}
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
          {/* timer : repart quand on change d'US ou de tour */}
          <Timer
            key={`${index}-${round}-${started}-${revealed}`}
            seconds={90}
            onTimeUp={() => setRevealed(true)}
          />
          {/* chat */}
          <Chat player={viewPlayer || "Joueur"} />
          {/* cartes : on vote pour le joueur sélectionné */}
          <CardSet
            players={players}
            votes={votes}
            onVote={onVote}
            disabled={revealed}
            viewPlayer={viewPlayer}
            setViewPlayer={setViewPlayer}
          />
          {/* bloc votes + bouton révéler */}
          <VoteBoard
            players={players}
            votes={votes}
            revealed={revealed}
            canReveal={canReveal}
            onReveal={onReveal}
          />
          {/* panneau résultat */}
          <ResultsPanel mode={mode} votes={votes} revealed={revealed} />
          {/* boutons d'action */}
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
      {/* message si pas de backlog */}
      {!currentUS && backlog.length === 0 && (
        <p style={{ marginTop: 24, opacity: 0.8 }}>
          Charge un backlog JSON et configure la partie pour commencer.
        </p>
      )}
    </div>
  );
}
