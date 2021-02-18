import { API } from '../../src/consts';

const users = [
	{
		username: 'jperez',
		firstName: 'Juan',
		lastName: 'Perez',
		email: 'jperez@dronfies.com',
		password: '$2a$08$yo5DQQPG1PD5/vCQNSCEKuR33aBcT5uwLZmGL3TisAnYR8Ir.S2Lu',
		role: 'admin',
		'settings': {
			'langauge': 'EN'
		},
		'dinacia_user': {
			'id': '77cb04f2-8b0e-4b3d-8adc-553cb3882322',
			'address': 'Av Siempre Viva 1234',
			'document_type': 'ci',
			'document_number': '0987654321',
			'phone': '1234567890',
			'cellphone': '1029384765',
			'nationality': 'uy',
			'permit_expire_date': null,
			'document_file_path': 'src\\uploads\\1613081303599-207910351-newVehicle.png.jpg',
			'permit_front_file_path': 'src\\uploads\\1613081303600-890064766-newVehicle.png.jpg',
			'permit_back_file_path': 'src\\uploads\\1613081303600-815946939-newVehicle.png.jpg',
			'dinacia_company': null
		}
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
			response: users,
			status: 200
		});
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('hamburger.dashboard').click();
	});
	it('Finds Users button', function () {
		cy.contains('sidemenu.all_users').click();
	});

	it('Find user jperez and check it id matches, edits it', function () {
		cy.get('[data-test-id="jperez"]').within(($el) => {
			cy.get('[data-test-id="collapser"]').click();
			cy.get('[data-test-id="collapser"]').click();
			cy.get('[data-test-id="edit"]').click();
			cy.get('[data-test-id="vehicles"]').click();
		});
		cy.visit('http://localhost:2000/dashboard/users');
		cy.get('[data-test-id="jperez"]').within(($el) => {
			cy.get('[data-test-id="collapser"]').click();
		});
		cy.get('[data-test-id="document_file_image"]').click();
		cy.get('[data-test-id="permit_front_file_image"]').click();
		cy.get('[data-test-id="permit_back_file_image"]').click();
		cy.contains('edit').first().click();
	});
});
