describe('Edit operation', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/*',    //
			status: 200
		});
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/dashboard/users');
		cy.contains('edit').click();
		cy.get('#firstName').type('Roberto');
		cy.get('#lastName').type('Malawi');
		cy.get('#email').type('email');
		cy.get('#email').type('email@gmail.com');
		cy.contains('change_password').click();
		cy.get('#newpassword').type('bad');
		cy.get('#newpasswordverification').type('good');
		cy.contains('save_changes').click();
	});
});
