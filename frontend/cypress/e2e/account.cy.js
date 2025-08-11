describe("Account page", () => {
    beforeEach(() => cy.loginAsUser());
  
    it("shows user info and toggles password visibility", () => {
      cy.visit("/account");
      cy.wait("@me");
  
      cy.contains("Welcome, Derrick");
      cy.contains("Email:").siblings("p").should("contain", "derrick@example.com");
  
      cy.get(".password-field p").should("contain", "••••");
      cy.get(".eye-btn").click();
      cy.get(".password-field p").should("contain", "mySecret123");
    });
  });
  