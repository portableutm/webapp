/*
UseCase 01A: Create new Operation
 */
import {API} from '../../src/consts';
describe('SP: Dashboard', function () {
	it('All buttons of the sidemenu - admin', function() {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			});

		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('dsh.returnmap').click();
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('app.changelanguage').click();
		cy.contains('Español').click();
	});
	it('All buttons of the sidemenu - admin', function() {
		cy
			.request('POST', API + 'auth/login', { username: 'admin', password: 'admin' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'admin');
				cy.setCookie('jwt', response.body);
			});
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('dsh.all_users').click();
		cy.contains('dsh.operations_list').click();
		cy.contains('dsh.vehicles_list').click();
		cy.contains('dsh.logout').click();
	});
	it('All buttons of the sidemenu - pilot', function() {
		cy
			.request('POST', API + 'auth/login', { username: 'RenatePenvarden', password: 'xD6lJ9ATuA' })
			.then((response) => {
				// response.body is automatically serialized into JSON
				cy.setCookie('user', 'RenatePenvarden');
				cy.setCookie('jwt', response.body);
			});

		cy.visit('http://localhost:2000/dashboard/');
		cy.get('.dshSide > .bp3-menu > li:nth-child(1) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(2) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dashboard > .dshSide > .bp3-menu > li:nth-child(2) > .bp3-menu-item').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(5) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(8) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dashboard > .dshSide > .bp3-menu > li:nth-child(10) > .bp3-menu-item').click();
		cy.get('#dshContentCont > .bp3-form-group > .bp3-form-content > .bp3-input-group > #text-nNumber').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(11) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(6) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.bp3-dialog-container > .bp3-dialog > .logoutButtons > .bp3-intent-success > .bp3-button-text').click();
	});

});