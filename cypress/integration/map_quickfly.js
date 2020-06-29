/*
	SP1: Map - Quick fly
 */


import {API} from '../../src/consts';

const quickFlyLocations = [
	{
		name: 'MVD/SUMU: AIC (Ground)',
		cornerNW: [-34.816575, -56.052659],
		cornerSE: [-34.847928, -56.007429]
	},
	{
		name: 'MVD/SUMU: AIC (Approach)',
		cornerNW: [-34.730198, -56.203753],
		cornerSE: [-34.910978, -55.827960]
	},
	{
		name: 'PDP/SULS: Laguna del Sauce (Ground)',
		cornerNW: [-34.839509, -55.135924],
		cornerSE: [-34.873023, -55.053979]
	},
	{
		name: 'Uruguay',
		cornerNW: [-29.754889, -58.773215],
		cornerSE: [-35.149370, -52.615924]
	},
	{
		name: 'DronfiesLabs',
		cornerNW: [-34.903478, -56.163236],
		cornerSE: [-34.917137, -56.146111]
	}
];

describe('SP1: (Map) Quick Fly', function () {
	beforeEach('Auth', function () {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			});
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/quickfly',    //
			response: quickFlyLocations
		});
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
	it('Opens sidebar and creates a new QF', function () {
		cy.contains('quickfly.add_new').click();
		cy.get('[data-test-id="mapquickFlyNew"]').type('This is a test QF');
		cy.contains('quickfly.save').click();
		cy.contains('OK').click();
	});
});