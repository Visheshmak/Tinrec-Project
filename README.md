# TINREC: E-Waste Management Platform

A server-rendered web app for an e-waste collection and recycling initiative, built with **Node.js, Express, EJS, and MongoDB**. It has user registration and login with hashed passwords and JWT session cookies.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

## Features

- **Authentication**: sign-up and login backed by MongoDB (Mongoose). Passwords are hashed with `bcryptjs`. Login issues a 1-hour JWT stored in an `httpOnly` cookie.
- **Input handling**: required-field and duplicate-account checks, with redirect-based error messages.
- **Server-side rendering** with EJS and `ejs-mate` layouts. Static assets are served from `public/`.
- **Configuration through environment variables** (`PORT`, `MONGODB_URI`, `JWT_SECRET`).

## Routes

| Method | Path | Description |
| --- | --- | --- |
| GET / POST | `/register` | Sign-up form / create account |
| GET / POST | `/login` | Login form / authenticate and set JWT cookie |
| GET | `/authentication` | Combined login & sign-up page |
| GET | `/home` | Landing page |

## Getting started

Prerequisites: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
git clone https://github.com/Visheshmak/Tinrec-Project.git
cd Tinrec-Project
npm install
cp .env.example .env     # set MONGODB_URI and JWT_SECRET
npm run dev              # or: npm start
```

Open http://localhost:5000/home.

## Project structure

```text
server.js        Express app, routes, MongoDB connection
models/          Mongoose models
views/           EJS templates and static HTML pages
public/          CSS and images
```
