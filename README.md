# PlanningPokerFM
Projet Planning Poker
# Binôme Pair Programming: Fatine Mourid & Manel Saadane.
Formation : Master 1 Informatique.
Université : Icom - Université Lumière Lyon 2

# 1. Présentation du projet

Ce projet consiste à développer une application de Planning Poker permettant à une équipe d’estimer la difficulté de fonctionnalités (user stories) dans le cadre d’un projet conception agile de projets informatiques.


# 2. Fonctionnalités principales

- Ajout de joueurs avec un pseudo
- Choix du mode de jeu :
  - Unanimité stricte
  - Moyenne
  - Médiane
  - Majorité absolue
  - Majorité relative
- Import d’un backlog depuis un fichier Blacklog.json
- Vote par cartes
- Révélation des votes
- Validation ou relance du vote selon les règles
- Chronomètre de vote
- Chat de discussion (Firebase)
- Export de l’état de la partie et des résultats en JSON

# 3. Structure du projet
src/
 - components/: composants React (Menu, Cartes, Votes, Chat…)
 - services/  : logique métier (règles de vote, json, unanimité)
 - App.jsx : composant principal de l’application
 - firebase.js: configuration Firebase
 - docs/ : documentation HTML générée automatiquement avec JSDoc


# 4. Format du blacklog

Le backlog est fourni sous la forme d’un tableau de user stories :Le champ "estimate" est automatiquement renseigné à la fin du Planning Poker.

Chaque user story contient :
- un identifiant (`id`)
- un titre (`title`)
- une estimation (`estimate`), renseignée automatiquement à la fin du Planning Poker.

Un fichier exemple `Backlog.json` est fourni dans le dossier `src/` afin d’illustrer le format attendu et de faciliter les tests de l’application.



# 5. Lancer le projet en local
### Prérequis
- Node.js 
- pnpm
  
Installation des dépendances :
- pnpm install: installe l’ensemble des dépendances du projet
- pnpm install firebase : installe Firebase, utilisé dans l’application pour la fonctionnalité de chat 

Lancement de l’application :
- pnpm run dev


# 6. Tests unitaires

Les tests unitaires vérifient la logique des règles de vote.

Commande :
pnpm test


# 7. Documentation

La documentation est générée automatiquement avec JSDoc.

Commande :
pnpm run doc
Les fichiers HTML sont générés dans le dossier "docs".

# 8. Choix techniques

- Langage : JavaScript
- Technologie : React
- Architecture : composants + services
- Stockage des données : fichiers JSON
- Chat : Firebase Firestore
- Documentation : JSDoc
- Intégration continue : GitHub Actions (tests + documentation)

# 8. Déploiement 
https://fmplanningpoker.vercel.app/



