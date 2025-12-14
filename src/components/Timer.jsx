//On importe ce dont on a besoin pour le timer
//useState : pour stocker une valeur qui change, dans notre cas ici le temps restant
//useEffect : pour exécuter le code automatiquement comme timer, reset
//useRef : pour garder une valeur
import { useEffect, useRef, useState } from "react";
//Composant timer, reçoit seconds : le temps de départ, par défaut ici c 90 secondes; onTimeUp : une fonction à appeler quand le temps est fini
export default function Timer({ seconds = 90, onTimeUp }) {
  //remaining c le nombre de secondes restantes affichées à l’écran, au début, remaining vaut "seconds"
  const [remaining, setRemaining] = useState(seconds);
  //alreadyCalledRef c un petit drapeau de true ou false; il sert à éviter d’appeler onTimeUp plusieurs fois
  //useRef utilisé car sa valeur peut changer sans recharger le composant
  const alreadyCalledRef = useRef(false);
  //remettre le timer à zéro
  //Ce useEffect se déclenche quand la valeur "seconds" change
  useEffect(() => {
    // On remet le temps restant à la nouvelle valeur
    setRemaining(seconds);
    // On remet le drapeau à false, le timer n’a pas encore fini
    alreadyCalledRef.current = false;
  }, [seconds]); //se déclenche quand seconds change
  //faire le décompte
  useEffect(() => {
    // Si le temps est terminé (0 ou moins)
    if (remaining <= 0) {
      // On vérifie si on n’a pas encore appelé onTimeUp
      if (!alreadyCalledRef.current) {
        alreadyCalledRef.current = true; // on bloque les prochains appels
        // onTimeUp?.() c :si la fonction existe, alors on l’appelle
        onTimeUp?.();
      }
      // On arrête ici: pas de timer
      return;
    }
    // setInterval = exécuter une action toutes les 1 seconde
    const id = setInterval(() => {
      // On enlève 1 seconde au temps restant
      setRemaining((s) => s - 1);
    }, 1000); // 1000 ms = 1 seconde
    // Nettoyage :Quand le composant change ou se démonte, on arrête l’interval pour éviter les bugs
    return () => clearInterval(id);
  }, [remaining, onTimeUp]);
  // dépendances :remaining : pour continuer le décompte
  // onTimeUp : pour être sûr d’avoir la bonne fonction
  // affichage du composant
  return (
    <>
      {/* Style*/}
      <style>
        {`
        .timer-badge {
          margin-top: 14px;
          display: inline-block;
          padding: 10px 18px;
          border-radius: 999px;
          /* fond avec un effet */
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
        /* le texte en gras */
        .timer-badge b {
          color: #000;
        }
        `}
      </style>
      {/* Affichage du timer */}
      <div className="timer-badge">
        ⏱️ Temps restant : <b>{remaining}s</b>
      </div>
    </>
  );
}
