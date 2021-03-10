describe('Note app', function(){
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'test user',
      username: 'test_user',
      password: 'test',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function(){
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020 made by Sergii Kiriano')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('test_user')
    cy.get('#password').type('test')
    cy.get('#login-button').click()
    cy.contains('test user')
  })

  it.only('cannot login with wrond password', function () {
    cy.contains('login').click()
    cy.get('#username').type('test_user')
    cy.get('#password').type('wrrwrw')
    cy.get('#login-button').click()

    cy.contains('Wrong credentials')
  })

  describe('when logged in', function() {

    describe('and a note exists', function() {
      beforeEach(function() {
        cy.contains('login').click()
        cy.get('#username').type('test_user')
        cy.get('#password').type('test')
        cy.get('#login-button').click()
        cy.wait(3000)
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
        cy.contains('another note cypress')
      })

      it('it can be made important', function() {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })

    it('a new note can be created', function() {
      cy.contains('login').click()
      cy.get('#username').type('test_user')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.contains('new note').click
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })
  })
})