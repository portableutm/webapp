/*
UseCase 01A: Create new Operation
 */
import {API} from '../../src/consts';
describe('SP: Dashboard', function () {
	it('All buttons of the sidemenu - admin', function() {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('dsh.returnmap').click();
		cy.visit('http://localhost:2000/dashboard/');
	});
	it('All buttons of the sidemenu - admin', function() {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('dsh.all_users').click();
		cy.contains('dsh.operations_list').click();
		cy.contains('dsh.vehicles_list').click();
		cy.contains('dsh.logout').click();
	});
	it('All buttons of the sidemenu - pilot', function() {
		cy.setCookie('sneaky', 'RenatePenvarden');
		cy.setCookie('hummingbird', 'xD6lJ9ATuA');
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('dsh.edit_your_info').click();
		cy.contains('dsh.operations_list_pilot').click();
		cy.contains('dsh.vehicles_new').click();
		cy.contains('dsh.vehicles_list_pilot').click();
	});

});