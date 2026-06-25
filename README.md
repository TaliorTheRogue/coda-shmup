# 🚀 Coda Shmup

A modern 2D Shoot 'Em Up developed with **Phaser 3** and **TypeScript**, featuring user authentication, online score saving and a global leaderboard.

This project was developed as part of the **Concepteur Développeur d'Applications (CDA)** certification.

---

## About

This repository is based on the educational Shoot 'Em Up project created by **Romain Théry** for the Game Development module at **CODA Orléans**.

The original project provided the gameplay foundations (game loop, ECS architecture, player, enemies and weapons).

As part of my CDA project, I extended the original game into a complete full-stack application by designing and implementing an online infrastructure, persistent player accounts and a complete user interface overhaul.

---

## Features

### 🎮 Gameplay

- Arcade Shoot 'Em Up gameplay
- Multiple enemy behaviours
- Different enemy weapons
- Health management
- Score system
- Modern in-game HUD
- Game Over screen

### 🌐 Online Features

- User registration
- User authentication using JWT
- Persistent player accounts
- Online score saving
- Global leaderboard
- Automatic synchronization of locally saved scores after login

### 💾 Local Save System

Players can enjoy the game without creating an account.

If a player is not authenticated:

- Scores are temporarily stored locally.
- Once the player logs in or creates an account, pending scores are automatically synchronized with the online leaderboard.

---

## Technologies

### Frontend

- Phaser 3
- TypeScript
- Vite

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod

---

## Project Structure

```
coda-shmup/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── entities/
│   ├── managers/
│   ├── scenes/
│   ├── weapons/
│   └── ...
│
├── server/
│   ├── prisma/
│   ├── src/
│   └── ...
│
└── public/
```

---

## Major Additions

Compared to the original teaching project, the following features were designed and implemented:

- Complete UI redesign
- Home menu redesign
- Authentication scene
- Game Over scene
- Leaderboard scene
- JWT authentication
- Express REST API
- Prisma ORM integration
- PostgreSQL database
- User accounts
- Online score saving
- Global leaderboard
- AuthManager
- Automatic synchronization of offline scores

---

## Roadmap

### ✅ Version 1

- Gameplay
- Authentication
- Online leaderboard
- Local score synchronization
- Modern user interface

### 🔜 Version 2 (Coming Soon)

- Hangar
- Ship customization
- Audio manager
- Background music
- More sound effects
- UI animations
- Additional enemies
- Additional weapons

---

## Credits

### Original Educational Project

- **Romain Théry** — Base Shoot 'Em Up project used during the Game Development module at CODA_ Orléans.

### Third-party Assets

- **Phaser** — Game engine
- **Kenney** — UI, sound and graphical assets

---

## Author

**Alexandre ("TaliorTheRogue")**

GitHub:
https://github.com/TaliorTheRogue

---

## License

This repository is shared for educational purposes as part of my CDA certification.

The original Shoot 'Em Up project was created by **Romain Théry** for educational use. All modifications and additional features presented in this repository were developed as part of my personal CDA project.