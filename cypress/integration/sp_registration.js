describe('SPx: (Registration)', function () {
	beforeEach('Intercept post', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/user/register'    //
		}).as('postUser');
	});

	it('Fills info of user', function () {
		cy.visit('http://localhost:2000/registration');
		cy.get('input[id="input-first-name"]').type('Juan');
		cy.get('input[id="input-last-name"]').type('Perez');
		cy.get('input[id="input-email"]').type('jperez@dronfies.com');
		cy.get('input[id="input-username"]').type('jperez');
		cy.get('input[id="input-password"]').type('jperez');
		cy.get('input[id="input-repeat-password"]').type('jperez');
		cy.contains('Register').click();
		cy.wait('@postUser');
	});

	it('fills info wronlgy', function() {
		cy.visit('http://localhost:2000/registration/');
		cy.contains('Español').click();
		cy.contains('English').click();
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-first-name').type('w');
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-last-name').type('w');
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-email').type('test@example.com');
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-username').type('1');
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-password').type('2134');
		cy.contains('Register').click();
		cy.contains('OK').click();
		cy.get( '#input-repeat-password').type('1234');
		cy.contains('Register').click();
		cy.contains('OK').click();
	});
});
