/*
UseCase 01A: Create new Operation
 */

import { API } from '../../src/consts';

describe('Use Case 01A: Create New Operation (valid)', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/operation',
			response: {},
			status: 200
		}).as('postOperation');
	});
	/*
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
	*/
	it('Finds button and starts use case', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('hamburger.createnewop').click();
	});
	it('Finish and fails bc of no UAS, fix mistake', function () {
		cy.contains('finish').click();
		cy.get('[data-test-id="floating-text"]').then(($el) => {
			expect($el).to.contain('no_uas_selected');
		});
		cy.get('.bp3-checkbox').first().click();
		cy.window().then((win) => {
			win.store.hideFloatingText();
		});
	});
	it('Finish and fails bc of no polygon', function () {
		cy.contains('finish').click();
		cy.get('[data-test-id="floating-text"]').then(($el) => {
			expect($el).to.contain('no_polygon_drawn');
		});
		cy.window().then((win) => {
			win.store.hideFloatingText();
		});
	});
	it('Define Polygon', function () {
		cy.get('[data-test-id="map"]').click( 'bottom');
		cy.get('[data-test-id="map"]').click('topRight');
		cy.get('[data-test-id="map"]').click('center');
	});
	it('Define Volume Info', function () {
		//cy.get('[data-test-id="map#editor#volume#info#min_altitude"]').clear().type('-1');
		cy.get('[data-test-id="map#editor#volume#info#max_altitude"]').clear().type('50');
		//cy.get('[data-test-id="map#editor#volume#info#near_structure"]').check({force: true});
		//cy.get('[data-test-id="map#editor#volume#info#bvlos"]').check({force: true});
	});
	it('Complete Volume information', function () {
		//cy.get('[data-test-id="mapInputEditorVolumeDescr"]').
		/*cy.get('[data-test-id="mapInputEditorFlightNumber"]')
			.clear()
			.type('123');*/
		cy.get('[data-test-id="map#editor#operation#info#contact"]')
			.clear()
			.type('E2E Testing');
		cy.get('[data-test-id="map#editor#operation#info#contact_phone"]')
			.clear()
			.type('09123456');
		cy.get('[data-test-id="map#editor#operation#info#name"]').clear().type('CreateNewOp#01');
		cy.get('[data-test-id="map#editor#operation#info#flight_comments"]').clear().type('Comments');
		cy.get('[data-test-id="map#editor#volume#info#effective_time_begin"]').click();
		cy.get('[data-test-id="map#editor#operation#info#pilot"]').select('admin');
	});
	it('Finish and add', function () {
		cy.get('.bp3-checkbox').first().click();
		cy.contains('finish').click();
		cy.wait('@postOperation');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('hamburger.map').click();
	});
	it('Finds button and starts use case', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('hamburger.createnewop').click();
		cy.contains('editor.return').click();
	});
});