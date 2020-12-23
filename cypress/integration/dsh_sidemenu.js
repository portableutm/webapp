/*
UseCase 01A: Create new Operation
 */
describe('SP: Dashboard', function () {
	it('All buttons of the sidemenu - admin', function() {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('sidemenu.returnmap').click();
		cy.visit('http://localhost:2000/dashboard/');
	});
	it('All buttons of the sidemenu - admin', function() {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('sidemenu.dshhome').click();
		cy.contains('sidemenu.changelanguage').click();
		cy.contains('spañol').click();
		cy.visit('http://localhost:2000/dashboard/');
		cy.contains('sidemenu.all_users').click();
		cy.contains('sidemenu.new_user.text').click();
		cy.contains('sidemenu.operations_list').click();
		cy.contains('sidemenu.vehicles_list').click();
		cy.contains('ades_options.web').click();
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_negative').click();
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_positive').click();
	});
	it('All buttons of the sidemenu - pilot', function() {
		cy.setCookie('sneaky', 'RenatePenvarden');
		cy.setCookie('hummingbird', 'xD6lJ9ATuA');
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.dshhome').click();
		cy.contains('sidemenu.changelanguage').click();
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.edit_your_info').click();
		cy.contains('sidemenu.operations_list_pilot').click();
		cy.contains('sidemenu.vehicles_new').click();
		cy.contains('sidemenu.vehicles_list_pilot').click();
	});

});