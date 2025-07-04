# MissileDefense.io

This project is a modernized missile defense game using React, Vite, TypeScript, and Phaser. It follows a clean architecture:

- **React** for UI components (`src/components`)
- **Phaser** for game logic (`src/game`)
- **Domain types** in `src/types`
- **Assets** in `public/assets`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

- `src/components`: React UI components
- `src/game`: Phaser game logic
- `src/types`: TypeScript domain types
- `public/assets`: Game images and assets

## Integrating Phaser

Phaser is used for the core game logic and is mounted inside a React component. UI overlays and menus are built with React.
