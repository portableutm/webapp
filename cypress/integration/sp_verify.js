describe('SPx: (Verification)', function () {
	it('Verify OK', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/user/confirm',
			response: {
				statusCode: 200
			}
		}).as('postConfirm');

		cy.visit('http://localhost:2000/verify/user/token');
		cy.wait('@postConfirm');
		cy.contains('app.goto_login').click();
	});

	it('Verify FAILS', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/user/confirm',
			status: 401
		}).as('postConfirm');

		cy.visit('http://localhost:2000/verify/user/bad_token');
		cy.wait('@postConfirm');
		cy.get('.loginError').then(($el) =>
			expect($el).to.contain('error')
		);
	});
});
