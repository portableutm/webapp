/*
UseCase 01A: Create new Operation
 */

describe('Use Case 01A: Create New Operation (valid)', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/uasvolume',
			response: {},
			status: 200
		}).as('postUvr');
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
		cy.contains('hamburger.createnewuvr').click();
	});
	it('Define Polygon', function () {
		cy.get('[data-test-id="map"]').click('bottom');
		cy.get('[data-test-id="map"]').click('topRight');
		cy.get('[data-test-id="map"]').click('center');
	});
	it('Define Volume Info', function () {
		cy.get('[data-test-id="map#editor#uvr#info#reason"]').clear().type('Test 123');
		cy.get('[data-test-id="map#editor#uvr#info#min_altitude"]').clear().type('-1');
		cy.get('[data-test-id="map#editor#uvr#info#max_altitude"]').clear().type('50');
		//cy.get('[data-test-id="map#editor#volume#info#near_structure"]').check({force: true});
		//cy.get('[data-test-id="map#editor#volume#info#bvlos"]').check({force: true});
	});
	it('Finish and add', function () {
		cy.contains('finish').click();
		cy.wait('@postUvr');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('hamburger.map').click();
	});
});