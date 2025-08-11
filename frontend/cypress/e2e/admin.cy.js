describe("Admin area", () => {
    beforeEach(() => cy.loginAsAdmin());
  
    it("shows admin dashboard stats (users / balance / transactions total)", () => {
      cy.visit("/admin");
      cy.wait(["@totalBalance", "@users", "@adminRecent"]);
  
      cy.contains("Total Users").siblings("p").should("contain", "3");
      cy.contains("Total Balance").siblings("p").should("contain", "$");
      cy.contains("Recent Transactions").siblings("p").should("contain", "3");
    });
  
    it("lists users and can freeze/unfreeze/delete", () => {
      cy.visit("/admin/users");
      cy.wait("@users");
  
      
      cy.contains("Derrick Fisher").parents("tr").within(() => {
        cy.contains("Freeze").click();
      });
      cy.get(".modal-overlay .modal-content")
        .should("be.visible")
        .contains("button", "Confirm Freeze")
        .click();
      cy.wait("@freeze");
      cy.get(".modal-overlay").should("not.exist");
  
   
      cy.contains("Maya Lee").parents("tr").within(() => {
        cy.contains("Unfreeze").click();
      });
      cy.get(".modal-overlay .modal-content")
        .should("be.visible")
        .contains("button", "Confirm Unfreeze")
        .click();
      cy.wait("@unfreeze");
      cy.get(".modal-overlay").should("not.exist");
  
   
      cy.contains("Sam Obrad").parents("tr").within(() => {
        cy.contains("Delete").click();
      });
      cy.get(".modal-overlay .modal-content")
        .should("be.visible")
        .contains("button", "Delete")
        .click(); 
      cy.wait("@deleteUser");
      cy.get(".modal-overlay").should("not.exist");
  

      cy.contains("Sam Obrad").should("not.exist");
    });
  
    it("shows admin transactions table", () => {
      cy.visit("/admin/transactions");
      cy.wait("@adminRecent");
      cy.get("table.admin-table tbody tr").should("have.length.at.least", 1);
      cy.contains("Deposit").should("exist");
      cy.contains("Withdrawal").should("exist");
      cy.contains("Transfer").should("exist");
    });
  
    it("exports reports (requests are made)", () => {
      cy.visit("/admin/reports");
      cy.intercept("GET", "**/api/admin/reports/export", { body: "id,amount\n1,100" }).as("exportAll");
      cy.contains("Export Full Report").click();
      cy.wait("@exportAll");
  
      cy.intercept("GET", "**/api/admin/reports/user/*/export", { body: "id,amount\n1,100" }).as("exportUser");
      cy.get('input[placeholder="Enter User ID"]').type("1");
      cy.contains("Export User Report").click();
      cy.wait("@exportUser");
    });
  });
  