/*
UseCase 01A: Create new Operation
 */
import {API} from '../../src/consts';
describe('Use Case: Add new vehicle', function () {
	beforeEach('Auth', function () {
		cy
			.request('POST', API + 'auth/login', { username: 'RenatePenvarden', password: 'xD6lJ9ATuA' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'RenatePenvarden');
				cy.setCookie('jwt', response.body);
			});
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/vehicle'    //
		}).as('postVehicle');
	});
	it('Finds button and starts use case', function () {
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('Add new vehicle').click();
	});
	/*it('Tries to create invalid vehicle', function () {
		cy.contains('Add vehicle').click();
		cy.get('.error').then($el => {
			expect($el).to.contain('vehicle name');
		});
	});*/
	it('Create valid vehicle', function() {
		cy.visit('http://localhost:2000/dashboard/vehicles/new');
		cy.wait(3000);
		cy.get('#text-nNumber').type('13245', {force: true});
		cy.get('#text-faaNumber').type('NJ371', {force: true});
		cy.get('#text-vehicleName').type('Air Force One', {force: true});
		cy.get('#text-manufacturer').type('DJI', {force: true});
		cy.get('#text-model').type(' 303', {force: true});
		cy.contains('Fixed-wing').click();
		cy.contains('Add vehicle').click();
		cy.wait('@postVehicle');
	});
	
	/*
	it('Finish and post', function () {
		cy.get('.bp3-dialog-close-button').click(); // TODO: Change this line if we don't use blueprint3js dialog anymore.
		cy.contains('Finish').click();
		cy.wait(@postVehicle);
	});
	 */
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
	});*/
});