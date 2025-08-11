describe("Settings", () => {
    beforeEach(() => cy.loginAsUser());
  
    it("toggles dark mode and changes password", () => {
      cy.visit("/settings");
  
      cy.get('input[type="checkbox"]').last().as("darkToggle");
      cy.get("@darkToggle").should("be.checked");
      cy.get("@darkToggle").uncheck({ force: true });
      cy.window().then((win) => {
        expect(win.localStorage.getItem("theme")).to.eq("light");
      });
  
      cy.contains("Change Password").click();
      cy.get('input[placeholder="Old Password"]').type("mySecret123");
      cy.get('input[placeholder="New Password"]').type("newPass!");
      cy.get('input[placeholder="Confirm New Password"]').type("newPass!");
      cy.contains("Save").click();
      cy.wait("@changePassword");
      cy.contains("Password changed successfully").should("be.visible");
    });
  });
  