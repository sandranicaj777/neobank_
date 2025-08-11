// cypress/e2e/transactions.cy.js
describe("Transactions page", () => {
    beforeEach(() => {
      cy.loginAsUser();
    });
  
    it("filters and searches; adds a new deposit and shows it in the list", () => {
      cy.visit("/transactions");
      cy.wait("@userTxs");
  
      // list rendered
      cy.get(".transactions-list .transaction-row")
        .should("exist")
        .and("have.length.greaterThan", 0);
  
      // sanity: newest first (from fixtures the first is a DEPOSIT)
      cy.get(".transactions-list .transaction-row").first().contains("DEPOSIT");
  
      // Filter to Deposits only
      cy.get(".transactions-filter").select("Deposits");
      cy.get(".transactions-list .transaction-row").should("have.length.at.least", 1);
      cy.get(".transactions-list .transaction-row").each(($row) => {
        cy.wrap($row).contains("DEPOSIT");
      });
  
      // Search by description ("Salary" exists in fixtures)
      cy.get(".transactions-search").clear().type("salary");
      cy.get(".transactions-list .transaction-row").should("have.length", 1);
  
      // Clear search
      cy.get(".transactions-search").clear();
  
      // Add a new Deposit $999
      cy.contains("+ New Transaction").click();
      cy.get(".modal-content").should("be.visible");
      cy.get(".modal-input").clear().type("999");
      cy.contains("Submit").click();
      cy.wait("@createTx");
  
      // Don't rely on it being the FIRST row (some apps refetch after submit);
      // just assert the new amount appears somewhere in the list.
      cy.get(".transactions-list").contains(".tx-amount", "$999", { timeout: 4000 });
    });
  });
  