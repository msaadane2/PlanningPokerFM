export default function VoteBoard({
  players,
  votes,
  revealed,
  canReveal,
  onReveal,
}) {
  const total = players.length;
  const done = players.filter((p) => p in votes).length;

  return (
    <>
      <style>
        {`
        .vote-root {
          margin-top: 20px;
          padding: 16px;
          border-radius: 18px;
          background: linear-gradient(
              135deg,
              rgba(56, 189, 248, 0.08),
              rgba(168, 85, 247, 0.1)
            ),
            rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.4);
          backdrop-filter: blur(12px);
          color: var(--text-main);
        }

        .vote-title {
          margin: 0 0 10px;
          font-size: 1.3rem;
          font-weight: 700;
          text-align: center;
        }

        .vote-count {
          font-size: 0.95rem;
          margin-bottom: 12px;
          text-align: center;
          color: var(--text-muted);
        }

        /* Bouton révéler */
        .reveal-btn {
          padding: 10px 18px;
          border-radius: var(--radius-pill);
          background: linear-gradient(135deg, var(--accent-strong), var(--accent-pink));
          color: white;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          display: block;
          margin: 0 auto;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .reveal-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(37, 99, 235, 0.6);
        }

        .reveal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Liste des votes */
        .votes-list {
          list-style: none;
          padding: 0;
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .vote-item {
          padding: 8px;
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.9);
          border: 1px solid rgba(55, 65, 81, 0.9);
        }

        .vote-player {
          font-weight: 600;
          color: var(--accent);
        }
        `}
      </style>

      <section className="vote-root">
        <h2 className="vote-title">Votes</h2>

        <p className="vote-count">
          {done}/{total} joueur(s) ont voté
        </p>

        {!revealed ? (
          <button
            disabled={!canReveal}
            onClick={onReveal}
            className="reveal-btn"
          >
            Révéler les votes
          </button>
        ) : (
          <ul className="votes-list">
            {players.map((p) => (
              <li key={p} className="vote-item">
                <span className="vote-player">{p}</span> : {votes[p] ?? "—"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
