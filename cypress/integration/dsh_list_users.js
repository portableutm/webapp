import {API} from '../../src/consts';

const users = [
	{
		username: 'jperez',
		firstName: 'Juan',
		lastName: 'Perez',
		email: 'jperez@dronfies.com',
		password: '$2a$08$yo5DQQPG1PD5/vCQNSCEKuR33aBcT5uwLZmGL3TisAnYR8Ir.S2Lu',
		role: 'admin'
	},
	{
		username: 'mfulana',
		firstName: 'Manola',
		lastName: 'Fulana',
		email: 'mfulana@dronfies.com',
		password: '$2a$08$ixYB4W.ZHszpc/XAIHFDaO7vzhDIhAmHSU/PRaZIG3u6E1WmsWl.y',
		role: 'pilot'
	}
];

describe('SP2: (Dashboard): All Users', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/user',    //
			response: users
		});
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('contextualmenu_dashboard').click();
	});
	it('Finds Users button', function () {
		cy.contains('dsh.all_users').click();
	});

	it('Find user jperez and check it id matches, edits it', function () {
		cy.get('#usersList').then(($el) => {
			expect($el).to.contain('Juan');
			expect($el).to.contain('Perez');
			expect($el).to.contain('jperez@dronfies.com');
			expect($el).to.contain('admin');
			expect($el).to.contain('Manola');
			expect($el).to.contain('Fulana');
			expect($el).to.contain('mfulana@dronfies.com');
			expect($el).to.contain('pilot');
		});
		cy.contains('edit').first().click();
	});

});
