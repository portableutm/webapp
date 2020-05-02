describe('SPx: (Registration)', function () {
	beforeEach('Intercept post', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/user/register'    //
		}).as('postUser');
	});

	it('Visits RegistrationScreen', function () {
		cy.visit('http://localhost:2000/registration');
	});
	it('Fills info of user', function () {
		cy.get('input[id="input-first-name"]').type('Juan');
		cy.get('input[id="input-last-name"]').type('Perez');
		cy.get('input[id="input-email"]').type('jperez@dronfies.com');
		cy.get('input[id="input-username"]').type('jperez');
		cy.get('input[id="input-password"]').type('jperez');
		cy.get('input[id="input-repeat-password"]').type('jperez');
		cy.contains('Register').click();
		cy.wait('@postUser');
	});
});
