/*
UseCase 01A: Create new Operation
 */

import {API} from '../../src/consts';

describe('Use Case 01A: Create New Operation (valid)', function () {
	beforeEach('Auth', function () {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			});
	});
	it('Finds button and starts use case', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('Create new operation').click();
	});
	it('Define Polygon', function () {
		cy.contains('Define volumes').click();
		cy.get('.rightAreaCloser').click();
		cy.get('[data-test-id="map"]').click('topLeft');
		cy.get('[data-test-id="map"]').click('topRight');
		cy.get('[data-test-id="map"]').click('bottomLeft');
	});
	it('Define Volume Info', function () {
		cy.get('[data-test-id="map"]').click(150,150);
		cy.contains('Editing').get('[data-test-id="mapEditorVolumeInfoMinAltitude"]').clear().type('-1');
		cy.get('.bp3-dialog-close-button').click(); // TODO: Change this line if we don't use blueprint3js dialog anymore.
		//cy.get('[data-test-id="map#editor#volume#info#near_structure"]').check();
		//cy.get('[data-test-id="map#editor#volume#info#bvlos"]').check();
		// We assume default info is good enough for this part
		// TODO: Add info here to validate UI interaction
	});
	it('Complete Volume information', function () {
		cy.get('.rightAreaOpener').click();
		cy.contains('Fill out general information').click();
		cy.get('[data-test-id="mapInputEditorName"]')
			.clear()
			.type('CreateNewOp#01');
		//cy.get('[data-test-id="mapInputEditorVolumeDescr"]').
		cy.get('[data-test-id="mapInputEditorFlightNumber"]')
			.clear()
			.type('123');
	});
	it('Finish and post', function () {
		cy.get('.bp3-dialog-close-button').click(); // TODO: Change this line if we don't use blueprint3js dialog anymore.
		cy.contains('Finish').click();
		cy.wait(3000);
	});
	it('Find created operation and clean-up', function () {
		cy.visit('http://localhost:2000/dashboard/operations');
		cy.contains('CreateNewOp#01')
			.should('exist')
			.click();
		cy.get('[data-test-id="dash#selected#gufi"]').then(($value) => {
			const gufi = $value.text();
			cy.getCookie('jwt').then(cookie => {
				cy.request({url: API + 'operation/' + gufi, method: 'DELETE', headers: {'auth': cookie.value}})
					.then((response) => {
						expect(response.isOkStatusCode).to.be.true;
					});
			});
		});
	});
});