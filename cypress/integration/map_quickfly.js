/*
	SP1: Map - Quick fly
 */


import { API } from '../../src/consts';

const quickFlyLocations = [{
	'id': '214b734b-9f98-4efe-9288-815786ed6ea8',
	'name': 'SUMU / MVD',
	'cornerNW': { 'type': 'Point', 'coordinates': [-56.0997948892208, -34.7908248678036] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-55.9576592691036, -34.883956865424] }
}, {
	'id': '55f5b03f-5074-43e5-ac70-5a59202088da',
	'name': 'Montevideo',
	'cornerNW': { 'type': 'Point', 'coordinates': [-56.7746035781009, -34.5535481438422] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-55.7199160781009, -34.9788546182835] }
}, {
	'id': '67f04bca-a9b7-4fac-9a1c-72bfa2947aa8',
	'name': 'Punta del Este',
	'cornerNW': { 'type': 'Point', 'coordinates': [-55.1057046878984, -34.8711524180652] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-54.8420328128984, -34.9772755360821] }
}, {
	'id': 'd7813206-29c0-4878-a7be-f61c8f625478',
	'name': 'UVR',
	'cornerNW': { 'type': 'Point', 'coordinates': [-56.4027786254883, -34.753742713705] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-56.1391067504883, -34.8464939800219] }
}, {
	'id': 'a5bf99f8-6250-43c6-93b1-44abb2b9a3c1',
	'name': 'Bañados de Carrasco',
	'cornerNW': { 'type': 'Point', 'coordinates': [-56.1152032435517, -34.828034119045] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-56.0492852748017, -34.854591681274] }
}, {
	'id': '80baff8f-df40-4d3e-a713-d7dbb90d3a68',
	'name': 'This is a test QF',
	'cornerNW': { 'type': 'Point', 'coordinates': [-56.2812423706055, -34.7664352168417] },
	'cornerSE': { 'type': 'Point', 'coordinates': [-55.9379196166992, -34.9523675611099] }
}];

describe('SP1: (Map) Quick Fly', function () {
	beforeEach('Auth', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/quickfly',    //
			response: quickFlyLocations
		});
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/quickfly',    //
			response: [],
			status: 200
		});
		cy.route({
			method: 'DELETE',      // Route all GET requests
			url: '/quickfly',    //
			response: [],
			status: 200
		});
	});

	it('Finds button and clicks on first location', function () {
		cy.visit('http://localhost:2000/');
		cy.contains('QUICKFLY.TITLE').click();
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
	it('Opens sidebar and creates a new QF', function () {
		cy.contains('quickfly.add_new').click({ force: true });
		cy.get('[data-test-id="mapquickFlyNew"]').type('This is a test QF');
		cy.contains('quickfly.save').click({ force: true });
		cy.get('[data-test-id="floating-text"]').then($el => expect($el).to.contain('saved'));
	});
	it('Deletes some quickflies', function () {
		cy.visit('http://localhost:2000/');
		cy.contains('QUICKFLY.TITLE').click();
		cy.contains('quickfly.activate_delete_mode').click({ force: true });
		cy.contains('SUMU').click();
		cy.contains('quickfly.deactivate_delete_mode').click({ force: true });
		cy.contains('quickfly.add_new').click({ force: true });
		cy.contains('cancel').click({ force: true });
		cy.get('[data-test-id="warning#closer"]').click();
	});
});