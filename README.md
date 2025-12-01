# Rick and Morty Character Explorer

A scalable React application built with TypeScript that allows users to explore characters from the Rick and Morty universe. This project was developed as a technical assessment for the bootcamp selection process.

## 🚀 Features

- **Character Directory:** Browse a paginated list of all characters.
- **Search Functionality:** Filter characters by name in real-time.
- **Detailed Profiles:** View character images, status, species, and origin.
- **Episode History:** Fetches and displays the specific names of episodes each character appeared in (resolving API URL references).
- **Responsive Design:** Clean UI that works on desktop and mobile.

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript, Vite
- **State Management:** React Context API + useReducer (Scalable architecture without external bloat)
- **Routing:** React Router DOM (v6)
- **Styling:** CSS Modules / Standard CSS (Focused on clean structure)
- **API:** [Rick and Morty REST API](https://rickandmortyapi.com/)

## 📂 Project Structure

The project follows a feature-based modular architecture to ensure scalability and maintainability:

```text
src/
├── api/                # API service layer (separated from UI components)
├── components/         # Reusable UI components (Layout, Card, SearchInput)
├── context/            # Global state management (Context + Reducer)
├── hooks/              # Custom hooks (e.g., useDebounce, useFetch)
├── pages/              # Page views (CharactersPage, CharacterDetailsPage)
├── routes/             # Router configuration
├── types/              # TypeScript interfaces and type definitions
└── utils/              # Helper functions (e.g., ID extraction logic)
