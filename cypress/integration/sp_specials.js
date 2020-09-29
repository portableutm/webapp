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
		cy.visit('http://localhost:2000/dashboard');
		cy.on('uncaught:exception', (err, runnable) => {
			console.log('err :' + err);
			console.log('runnable :' + runnable);
			return false;
		});
		cy.window().then((win) => {

		});
	});
});
