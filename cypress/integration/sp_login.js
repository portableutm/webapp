describe('UseCase 05. Login', function() {
	it('Login and suceeds', function() {
		cy.visit('http://localhost:2000/');
		cy.get('#login-user').type('admin');
		cy.get('#login-password').type('admin');
		cy.contains('app.changelanguage').click();
		cy.contains('Español').click();
		cy.contains('Iniciar sesión').click();
		/*cy.get('.loginError').then(($el) =>
			expect($el).to.contain('Please wait')
		);*/
		// TODO: Wait for post
	});

	it('Clear cookies, try to login but fails', function() {
		cy.clearCookies();
		cy.visit('http://localhost:2000/');
		cy.get('#login-user').type('admin');
		cy.get('#login-password').type('wrongpassword');
		cy.contains('Español').click();
		cy.contains('English').click();
		cy.contains('Log in').click();
		/*cy.get('.loginError').then(($el) =>
			expect($el).to.contain('Please wait')
		);*/
		cy.wait(2000);
		cy.get('.loginError').then(($el) =>
			expect($el).to.contain('error')
		);
	});
});
