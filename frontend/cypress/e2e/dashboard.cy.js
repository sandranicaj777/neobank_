describe("Dashboard", () => {
    beforeEach(() => {
      cy.loginAsUser();
    });
  
    it("shows recent transactions (sorted, max 4) and links to all", () => {
      cy.visit("/dashboard");
      cy.wait(["@me", "@userTxs", "@cards", "@notifs"]);
  
      cy.get(".transactions-list .transaction-row").should("have.length.at.most", 4);
  
      cy.get(".transactions-list .transaction-row").first().within(() => {
        cy.contains("DEPOSIT");
        cy.get(".tx-amount").should("contain", "200");
      });
  
      cy.contains("View All").click();
      cy.location("pathname").should("include", "/transactions");
    });
  });
  