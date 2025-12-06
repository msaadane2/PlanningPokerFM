// Menu de configuration: ajout joueurs, mode, backlog, sauvegarde

import { useRef, useState } from "react";
import "./Menu.css";

export default function Menu({
  players,
  setPlayers,
  mode,
  setMode,
  backlog,
  setBacklog,
  onImportState,
  onExportState,
  onStart,
}) {
  const [newPlayer, setNewPlayer] = useState("");
  const fileRefBacklog = useRef(null);
  const fileRefState = useRef(null);

  const addPlayer = () => {
    const p = newPlayer.trim();
    if (!p || players.includes(p)) return;
    setPlayers([...players, p]);
    setNewPlayer("");
  };

  const removePlayer = (p) => {
    setPlayers(players.filter((x) => x !== p));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addPlayer();
  };

  const importBacklog = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      setBacklog(json);
    } catch {
      alert("Backlog JSON invalide.");
    } finally {
      e.target.value = "";
    }
  };

  const importState = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImportState?.(file);
    e.target.value = "";
  };

  const modes = [
    {
      id: "strict",
      label: "Unanimité stricte",
      desc: "La valeur doit être la même pour tous.",
    },
    {
      id: "moyenne",
      label: "Moyenne",
      desc: "On prend la moyenne (arrondie).",
    },
    {
      id: "mediane",
      label: "Médiane",
      desc: "On garde la valeur centrale.",
    },
    {
      id: "maj_abs",
      label: "Majorité absolue",
      desc: "Plus de 50% des joueurs d'accord.",
    },
    {
      id: "maj_rel",
      label: "Majorité relative",
      desc: "On garde la valeur la plus fréquente.",
    },
  ];

  const canStart = players.length > 0 && backlog.length > 0;

  return (
    <div className="menu-root">
      <div className="menu-card">
        <h2 className="menu-title">Configuration de la partie</h2>

        {/*Bloc joueurs */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h3>Joueurs</h3>
            <span className="menu-section-badge">
              {players.length} joueur{players.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="players-row">
            <input
              type="text"
              className="input"
              placeholder="Nom du joueur..."
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn primary" onClick={addPlayer}>
              Ajouter
            </button>
          </div>

          {players.length === 0 ? (
            <p className="hint">
              Ajoute au moins un joueur pour pouvoir lancer la partie.
            </p>
          ) : (
            <ul className="players-list">
              {players.map((p) => (
                <li key={p} className="player-item">
                  <span className="player-avatar">
                    {p[0]?.toUpperCase() ?? "?"}
                  </span>
                  <span className="player-name">{p}</span>
                  <button
                    className="btn icon danger"
                    onClick={() => removePlayer(p)}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/*Bloc mode de jeu*/}
        <section className="menu-section">
          <div className="menu-section-header">
            <h3>Mode de jeu</h3>
          </div>

          <div className="mode-grid">
            {modes.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  className={"mode-card" + (active ? " mode-card-active" : "")}
                  onClick={() => setMode(m.id)}
                >
                  <div className="mode-name">{m.label}</div>
                  <div className="mode-id">{m.id}</div>
                  <div className="mode-desc">{m.desc}</div>
                  {active && <div className="mode-selected">Sélectionné</div>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bloc backlog & sauvegarde */}
        <section className="menu-section">
          <div className="menu-section-header">
            <h3>Backlog & sauvegarde</h3>
          </div>

          <div className="buttons-grid">
            {/* Import backlog */}
            <div className="btn-block">
              <label className="btn secondary" htmlFor="backlog-input">
                Importer un backlog (JSON)
              </label>
              <input
                id="backlog-input"
                ref={fileRefBacklog}
                type="file"
                accept="application/json"
                onChange={importBacklog}
                style={{ display: "none" }}
              />
              <p className="hint small">
                Format attendu : liste d’US{" "}
                <code>[{"{ id, title, ... }"}]</code>
              </p>
            </div>

            {/* Export état */}
            <div className="btn-block">
              <button className="btn secondary" onClick={onExportState}>
                Exporter l’état
              </button>
              <p className="hint small">
                Sauvegarde la configuration actuelle (JSON).
              </p>
            </div>

            {/* Import état */}
            <div className="btn-block">
              <label className="btn ghost" htmlFor="state-input">
                Importer un état de partie
              </label>
              <input
                id="state-input"
                ref={fileRefState}
                type="file"
                accept="application/json"
                onChange={importState}
                style={{ display: "none" }}
              />
              <p className="hint small">
                Permet de reprendre une partie sauvegardée.
              </p>
            </div>
          </div>

          {/* Petit résumé backlog */}
          <div className="backlog-summary">
            <span className="backlog-dot" />
            {Array.isArray(backlog) && backlog.length > 0 ? (
              <span>
                Backlog chargé : <b>{backlog.length}</b> élément
                {backlog.length > 1 ? "s" : ""}.
              </span>
            ) : (
              <span>Aucun backlog chargé.</span>
            )}
          </div>
        </section>

        {/*  Bouton pour démarrer la partie */}
        <div className="menu-footer">
          <button
            className="btn primary big"
            disabled={!canStart}
            onClick={onStart}
          >
            Lancer la partie
          </button>
        </div>
      </div>
    </div>
  );
}
