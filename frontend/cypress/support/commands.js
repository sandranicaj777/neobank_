Cypress.Commands.add("loginAsUser", (overrides = {}) => {
    cy.fixture("user.json").then((user) => {
      const u = { ...user, ...overrides };
      window.localStorage.setItem("token", "user-jwt");
      window.localStorage.setItem("user", JSON.stringify(u));
      window.localStorage.setItem("theme", "dark");
    });
  });
  
  Cypress.Commands.add("loginAsAdmin", (overrides = {}) => {
    cy.fixture("user.json").then((user) => {
      const u = { ...user, ...overrides };
      window.localStorage.setItem("token", "admin-jwt");
      window.localStorage.setItem("adminToken", "admin-jwt");
      window.localStorage.setItem("user", JSON.stringify(u));
    });
  });
  