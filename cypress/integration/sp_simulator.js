import {API} from '../../src/consts';

describe('SP: Simulator', function() {
	beforeEach('Auth', function () {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			});
	});

	it('Try out the drones', function() {
		cy.visit('http://localhost:2000/simulator');
		cy.contains('0').click();
		cy.get('.rightAreaCloser').click();
		cy.get('[data-test-id="map"]').click(150,150);
		cy.get('[data-test-id="map"]').click(350,350);
		cy.get('.rightAreaOpener').click();
		cy.contains('Start flying').click();
		cy.get('.rightAreaCloser').click();
		cy.wait(5000);
		cy.get('.rightAreaOpener').click();
		cy.contains('Stop flying').click();
	});

});