import "./commands";

let appendedTx = null;

beforeEach(() => {
  appendedTx = null;

  // auth + common stubs
  cy.intercept("GET", "**/api/auth/me", { fixture: "user.json" }).as("me");
  cy.intercept("GET", "**/api/notifications", { fixture: "notifications.json" }).as("notifs");
  cy.intercept("PATCH", "**/api/notifications/*/read", { statusCode: 204 }).as("readNotif");
  cy.intercept("GET", "**/api/cards", { fixture: "cards.json" }).as("cards");

  // transactions: serve base fixture, plus any tx we create
  cy.fixture("transactions.json").then((base) => {
    cy.intercept("GET", "**/api/transactions/user/*", (req) => {
      req.reply(appendedTx ? [...base, appendedTx] : base);
    }).as("userTxs");
  });

  cy.intercept("POST", "**/api/transactions", (req) => {
    const now = new Date().toISOString();
    appendedTx = {
      id: 999,
      userId: req.body.userId,
      amount: req.body.amount,
      type: req.body.type,
      description: req.body.description,
      recipientId: req.body.recipientId,
      timestamp: now,
    };
    req.reply(appendedTx);
  }).as("createTx");

  // admin stubs
  cy.intercept("GET", "**/admin/total-balance", {
    statusCode: 200,
    body: 1254321.78,
    headers: { "content-type": "application/json" },
  }).as("totalBalance");
  cy.intercept("GET", "**/api/users", { fixture: "users.json" }).as("users");
  cy.intercept("GET", "**/admin/recent-transactions?*", { fixture: "adminTransactions.json" }).as("adminRecent");

  cy.intercept("PATCH", "**/api/users/*/freeze", { statusCode: 200 }).as("freeze");
  cy.intercept("PATCH", "**/api/users/*/unfreeze", { statusCode: 200 }).as("unfreeze");
  cy.intercept("DELETE", "**/api/users/*", { statusCode: 204 }).as("deleteUser");

  cy.intercept("PATCH", "**/auth/change-password", { statusCode: 200 }).as("changePassword");
});
