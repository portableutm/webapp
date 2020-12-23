import { API } from '../../src/consts';

describe('SP: Simulator', function() {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
	});

	it('Try out the drones', function() {
		/*cy.visit('http://localhost:2000/simulator');
		cy.contains('DRONE 0').click();
		cy.get('[data-test-id="rightAreaCloser"]').click();
		cy.get('[data-test-id="map"]').click(150,150);
		cy.get('[data-test-id="map"]').click('topLeft');
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.contains('Start flying').click();
		cy.get('[data-test-id="rightAreaCloser"]').click();
		cy.wait(5000);
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.contains('Stop flying').click({force: true});*/
	});

});