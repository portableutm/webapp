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

		cy.visit('http://localhost:2000/dashboard/operations');
		cy.get('.dshSide > .bp3-menu > li > .bp3-intent-primary > .bp3-text-overflow-ellipsis').click();
		cy.visit('http://localhost:2000/dashboard/');
		cy.get('.dshSide > .bp3-menu > li:nth-child(3) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(3) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(9) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(10) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(12) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('#dshContentCont > .dshUsersListButtons > .bp3-tabs > .bp3-tab-list > #bp3-tab-title_dshUsersListsTabs_1').click();
		cy.get('#dshContentCont > .dshUsersListButtons > .bp3-tabs > .bp3-tab-list > #bp3-tab-title_dshUsersListsTabs_0').click();
		cy.get('tr:nth-child(1) > td > div > .bp3-button:nth-child(1) > .bp3-button-text').click();
		cy.visit('http://localhost:2000/dashboard/users/');
		cy.get('tr:nth-child(1) > td > div > .bp3-button:nth-child(2) > .bp3-button-text').click();
		cy.get('.dashboard > .dshSide > .bp3-menu > li:nth-child(16) > .bp3-menu-item').click();
		cy.get('.dshContent > #dshContentCont > .bp3-callout:nth-child(2) > .bp3-heading > div').click();
		cy.get('.dshSide > .bp3-menu > li:nth-child(14) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('#dshContentCont > div > .dshList > .bp3-callout:nth-child(1) > .bp3-heading').click();
		cy.get('div > .dshList > .bp3-callout > .animated > .bp3-button').click();
		cy.visit('http://localhost:2000/dashboard/');
		cy.get('.dshSide > .bp3-menu > li:nth-child(7) > .bp3-menu-item > .bp3-text-overflow-ellipsis').click();
		cy.get('.bp3-overlay > .bp3-dialog-container > .bp3-dialog > .logoutButtons > .bp3-button:nth-child(2)').click({force: true});
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