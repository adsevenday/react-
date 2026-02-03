# React + TypeScript + Vite

Ce projet est une application web moderne construite avec React, TypeScript et Vite. Elle permet aux utilisateurs de parcourir, rechercher et consulter les détails des livres en utilisant l'API d'Open Library.

🚀 Fonctionnalités
Accueil Dynamique : Affiche les dernières nouveautés littéraires basées sur l'année en cours.

Recherche Avancée : Permet de filtrer les résultats par :

Titre

Auteur

Sujet (ex: Fantasy, Histoire)

Année de publication

Référence exacte (ex: OL35183701W) via une recherche par clé précise.

Détails du Livre : Affiche les descriptions complètes, les couvertures et intègre des résumés provenant de Wikipedia pour enrichir le contexte.

Navigation Intuitive : Utilise react-router-dom pour une navigation fluide entre la recherche, les résultats et les fiches détaillées.

🛠️ Stack Technique
Frontend : React 18, TypeScript.

Style : SASS (SCSS) avec un système de jetons (tokens) pour les couleurs et le design.

Outil de build : Vite.

Routage : React Router.

API : Open Library API & Wikipedia API.

Structure du Projet
Plaintext
src/
├── api/
│   └── openLibrary.js     # Service de gestion des appels API
├── Component/             # Composants réutilisables
│   ├── Card/              # Cartes d'affichage des livres
│   ├── NavHeader/         # Barre de navigation avec recherche
│   └── WikiCard/          # Intégration des données Wikipedia
├── pages/                 # Vues principales
│   ├── Home.tsx           # Page d'accueil
│   ├── AdvancedSearch.tsx # Moteur de recherche filtré
│   └── BookDetails.tsx    # Fiche détaillée d'un ouvrage
├── styles/
│   └── token.scss         # Variables de thèmes et couleurs
└── App.tsx                # Configuration des routes
⚙️ Installation et Démarrage

npm install
npm run dev #Lancer le serveur 


