import { useEffect, useState } from "react";

export default function Timer({ seconds = 90, onTimeUp }) {
  const [remaining, setRemaining] = useState(seconds);

  // Quand la valeur "seconds" change, on remet le compteur à zéro
  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  // Décompte du timer
  useEffect(() => {
    if (remaining <= 0) {
      onTimeUp?.();
      return;
    }

    const id = setTimeout(() => {
      setRemaining((s) => s - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [remaining, onTimeUp]);

  return (
    <>
      <style>
        {`
        .timer-badge {
          margin-top: 14px;
          display: inline-block;
          padding: 10px 18px;
          border-radius: 999px;

          background: radial-gradient(
              circle at top left,
              rgba(56, 189, 248, 0.32),
              rgba(168, 85, 247, 0.25)
            ),
            rgba(250, 250, 255, 0.85);

          border: 1px solid rgba(148,163,184,0.35);
          box-shadow: 0 8px 22px rgba(0,0,0,0.12);

          font-size: 1rem;
          font-weight: 600;
          color: #111;
        }

        .timer-badge b {
          color: #000;
        }
        `}
      </style>

      <div className="timer-badge">
        ⏱️ Temps restant : <b>{remaining}s</b>
      </div>
    </>
  );
}
