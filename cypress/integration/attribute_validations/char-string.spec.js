/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  
  describe('Testing CHAR_STRING type validation', () => {
    it('create a new endpoint and click on configure to open attributes of endpoint', () => {
      cy.fixture('baseurl').then((data) => {
        cy.visit(data.baseurl)
      })
      cy.fixture('data').then((data) => {
        cy.gotoAttributePage(data.endpoint1, data.cluster1)
      })
    })
    it('enable an attribute with CHAR_STRING type',{retries: {runMode: 2, openMode: 2 } },
    () => {
        cy.get('[data-test="attribute"]')
        .contains('tr','CHAR_STRING')
        .find('[data-test="attribute-enable-toggle"]')
        .click()

        cy.get('[data-test="attribute"]')
        .contains('tr','CHAR_STRING')
        .find('[data-test="attribute-value"] input')
        .clear({force: true})
        .type('999999999999999999999999999999999999999999999999', {force: true})
    })
    it(
      'check if validation works properly',
      { retries: { runMode: 2, openMode: 2 } },
      () => {
        cy.get('[data-test="attribute"]')
        .contains('tr','CHAR_STRING')
        .find('[data-test="attribute-value"] .q-field__messages div')
        .should('exist')
      }
    )
  })
  