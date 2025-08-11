describe("App smoke", () => {
    it("loads landing and can go to login", () => {
      cy.visit("/");
      cy.contains("The future of").should("be.visible");
      cy.contains("Get Started").click();
      cy.location("pathname").should("include", "/login");
    });
  });
  