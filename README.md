NEO Bank — Neutral Online Banking (V1)

Hello and welcome to NEO Bank, a neutral online bank demo where you can deposit, withdraw, and transfer money with no fees. The project is inspired by Revolut, a European neobank known for fast onboarding, multi-currency accounts, card issuing, foreign exchange, and optional crypto/stock features. I built NEO Bank to practice full stack fintech development and to explore a simpler, lower fee experience.

This is a learning project (Java + Spring Boot + React). Do not use real card numbers or personal data. !!!

What’s included (V1)
-Authentication with JWT (register, login, logout)

-Role-based authorization (User/Admin)

-User dashboard: recent transactions, notifications, balance

-Transactions: deposit, withdrawal, transfer

-Virtual cards (demo generation and viewing)

-Account management: edit profile, show/hide password

-Settings: change password, dark/light mode

Admin dashboard:

-View all users and transactions

-Freeze / unfreeze / delete users

-Export reports (CSV)

Demo admin account:
email: admin@bank.com
password: admin123
Please register a new user to try user flows. For demonstration stability, do not delete or edit existing seeded users.!!!

---------------------------------------------------------------------------------------------------------------------------

Tech stack:

Frontend: React (CRA), Axios, Recharts, Lucide Icons, Cypress (E2E)

Backend: Java 17+, Spring Boot, Spring Web/Security, Spring Data JPA

Database: H2 (in-memory) for development

Auth: JWT (stateless)

Architecture: Layered (Controller → Service → Repository → Model)

---------------------------------------------------------------------------------------------------------------------------

Local setup:

The repo has a backend/ (Spring Boot) and frontend/ (React) folder. Open two terminals.

1) Backend (Spring Boot)
From the backend/ directory:
./mvnw spring-boot:run
# or run the main Application class from your IDE

API base URL: http://localhost:8080

H2 Console: http://localhost:8080/h2-console

JDBC URL is jdbc:h2:mem:testdb 

Swagger UI: http://localhost:8080/swagger-ui/index.html


You can test endpoints in Postman. Example:

GET http://localhost:8080/api/users
Protected routes require an Authorization: Bearer <JWT> header !!!

2) Frontend (React)
From the frontend/ directory:

npm install
npm start
App URL: http://localhost:3000

Key routes:

Landing: /

Auth: /login, /register

User: /dashboard, /transactions, /account, /settings

Admin: /admin, /admin/users, /admin/transactions, /admin/reports

If you do not have Node/npm installed, install the current LTS version of Node.js; npm install will fetch all required packages. !!!!

3)Testing

Backend:

Unit tests live under backend/src/test/java/...

Integration tests are in progress...

Endpoints can be exercised in Postman and via Swagger UI.

Frontend (Cypress E2E)
Run the app in one terminal and Cypress in another.

# terminal 1 (from frontend/)
npm start

# terminal 2 (from frontend/)
npm run cypress

In the Cypress runner:

Choose E2E Testing, select Chrome.

Start with app.smoke.cy.js, then run the rest of the specs.

Specs and fixtures are under frontend/cypress/.

Headless run (CI-style):

npm run cypress:run

Project structure (high-level)
backend/
  src/main/java/.../Controller
  src/main/java/.../Service
  src/main/java/.../Repository
  src/main/java/.../Model
  src/test/java/... (tests)
  application.properties

frontend/
  src/ (React app)
  cypress/
    e2e/        (specs)
    fixtures/   (mock data)
    support/    (commands, global intercepts)
  package.json

----------------------------------------------------------------------------------------------------------------
  
Notes!!!!!

JWT security protects user and admin routes.

H2 is used for development; will swap to Postgres/MySQL by updating Spring properties in V2.

If you change ports or origins, update CORS settings accordingly. !!!!


Roadmap (V2 — “NEO Flow”)
-Trading module (stocks/crypto)

-Crypto price API integration

-Backend integration tests and broader coverage

-Additional funding/payout flows and more robust limits/KYC (simulated)

-CI/CD and containerization

---------------------------------------------------------------------------------------------------------------------
Thank you and enjoy :)
