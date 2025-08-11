describe("Register", () => {
    it("registers and redirects to dashboard", () => {
      cy.visit("/register");
  
      cy.intercept("POST", "**/api/auth/register", (req) => {
        req.reply({
          jwtToken: "new-user-token",
          user: {
            id: 1,
            firstName: "Derrick",
            lastName: "Fisher",
            email: "derrick@example.com",
            balance: 0
          }
        });
      }).as("register");
  
      cy.get(".register-input").eq(0).type("Derrick");
      cy.get(".register-input").eq(1).type("Fisher");
      cy.get(".register-input").eq(2).type("derrick@example.com");
      cy.get(".register-input").eq(3).type("mySecret123");
      cy.get(".register-input").eq(4).type("mySecret123");
      cy.get(".register-input").eq(5).type("123456789");
  
      cy.clock();
      cy.get(".register-btn").click();
      cy.wait("@register");
      cy.tick(2000);
  
      cy.location("pathname").should("include", "/dashboard");
    });
  });
  