# Campus Equipment Hub

## Campus Equipment Lending & Reservation System

Campus Equipment Hub is a dynamic web application designed to help manage campus equipment. Users can view equipment availability, check quantities, borrow equipment, return equipment, and track borrower information.

## Features

- View campus equipment inventory
- Track total and available quantities
- Borrow equipment
- Return equipment
- Track borrowers
- Search and filter equipment
- Validate borrowing and returning operations
- Access equipment through JSON API
- Check application health
- Display deployed Git commit ID

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Testing | node:test |
| Linting | ESLint |
| Version Control | Git, GitHub |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Deployment | Render |

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/equipment` | Get equipment inventory |
| POST | `/api/equipment/:id/borrow` | Borrow equipment |
| POST | `/api/equipment/:id/return` | Return equipment |
| GET | `/health` | Check application health |
| GET | `/api/version` | Get deployed commit ID |

## DevOps Workflow

The project follows an automated CI/CD workflow:

```text
Git Push
   ↓
ESLint
   ↓
Automated Tests
   ↓
Docker Build
   ↓
Render Deployment
   ↓
Live Application

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/equipment` | Returns all equipment information |
| POST | `/api/equipment/:id/borrow` | Borrows available equipment |
| POST | `/api/equipment/:id/return` | Returns borrowed equipment |
| GET | `/health` | Checks whether the application is running |
| GET | `/api/version` | Returns the deployed commit ID |

## Project Structure

```text
campus-equipment-hub/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── public/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── favicon.svg
├── test/
│   └── app.test.js
├── app.js
├── server.js
├── Dockerfile
├── eslint.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md