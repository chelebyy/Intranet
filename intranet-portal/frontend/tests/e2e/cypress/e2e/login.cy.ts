describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('input[name="sicil"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="sicil"]').type('invalid');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();
    cy.contains(/hatalı|error/i).should('be.visible');
  });

  it('should redirect after successful login', () => {
    cy.fixture('users').then((users) => {
      cy.get('input[name="sicil"]').type(users.validUser.sicil);
      cy.get('input[name="password"]').type(users.validUser.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/select-birim');
    });
  });
});
