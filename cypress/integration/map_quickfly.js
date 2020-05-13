/*
	SP1: Map - Quick fly
 */


import {API} from '../../src/consts';

describe('SP1: (Map) Quick Fly', function () {
	beforeEach('Auth', function () {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			})
	});

	it('Finds button and clicks on first location', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.get('[data-test-id="mapButtonquickFly"]').click();
		cy.get('[data-test-id="mapquickFly0"]').click();
	});
	it('Finds button and clicks on second location', function () {
		//cy.get('[data-test-id="mapButtonQuickFly"]').click();
		cy.get('[data-test-id="mapquickFly1"]').click();
	});
	it('Finds button and clicks on third location', function () {
		//cy.get('[data-test-id="mapButtonQuickFly"]').click();
		cy.get('[data-test-id="mapquickFly2"]').click();
	});
});