describe('SPx: (Registration)', function () {
	beforeEach('Intercept add', function () {

	});

	// it('Fills info of user', function () {
	// 	cy.visit('http://localhost:2000/registration');
	// 	cy.get('input[id="input-first-name"]').type('Juan');
	// 	cy.get('input[id="input-last-name"]').type('Perez');
	// 	cy.get('input[id="input-email"]').type('jperez@dronfies.com');
	// 	cy.get('input[id="input-username"]').type('jperez');
	// 	cy.get('input[id="input-password"]').type('jperez');
	// 	cy.get('input[id="input-repeat-password"]').type('jperez');
	// 	cy.contains('login.register').click();
	// 	cy.wait('@postUser');
	// });

	// it('fills info wronlgy', function () {
	// 	cy.visit('http://localhost:2000/registration/');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-first-name').type('w');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-last-name').type('w');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-email').type('test@example.com');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-username').type('1');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-password').type('2134');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// 	cy.get('#input-repeat-password').type('1234');
	// 	cy.contains('login.register').click();
	// 	cy.contains('OK').click();
	// });


	it('Register user', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/user/register',
			response: {},
			status: 200
		}).as('postUser');
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_positive').click();
		cy.contains('login.register').click();
		cy.get('#input-username').type('newUserTest');
		cy.get('#input-firstName').type('UnUsuario');
		cy.get('#input-lastName').type('Nuevo');
		cy.get('#input-email').type('newUser@dronfies.com');
		cy.get('#input-address').type('Av Siempre Viva 1234');
		cy.get('#input-document_type').type('ci');
		cy.get('#input-document_number').type('0987654321');
		cy.get('#input-phone').type('1234567890');
		cy.get('#input-cellphone').type('1029384765');
		cy.get('#input-nationality').type('uy');

		 
		cy.get('#document_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_front_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_back_file > input').attachFile('images/newVehicle.png');
		
		cy.get('#input-password').type('1234');
		cy.get('#input-passwordverification').type('1234');

		cy.get('form').submit();
		cy.contains('login.registered');

	});

	it('Error user user name repeated', function () {
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_positive').click();
		cy.contains('login.register').click();
		cy.get('#input-username').type('admin');
		cy.get('#input-firstName').type('UnUsuario');
		cy.get('#input-lastName').type('Nuevo');
		cy.get('#input-email').type('newUser@dronfies.com');
		cy.get('#input-address').type('Av Siempre Viva 1234');
		cy.get('#input-document_type').type('ci');
		cy.get('#input-document_number').type('0987654321');
		cy.get('#input-phone').type('1234567890');
		cy.get('#input-cellphone').type('1029384765');
		cy.get('#input-nationality').type('uy');

		 
		cy.get('#document_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_front_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_back_file > input').attachFile('images/newVehicle.png');
		
		cy.get('#input-password').type('1234');
		cy.get('#input-passwordverification').type('1234');

		cy.get('form').submit();
		cy.contains('login.register_error');

	});


	it('Error user no username', function () {
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_positive').click();
		cy.contains('login.register').click();
		cy.get('#input-firstName').type('UnUsuario');
		cy.get('#input-lastName').type('Nuevo');
		cy.get('#input-email').type('newUser@dronfies.com');
		cy.get('#input-address').type('Av Siempre Viva 1234');
		cy.get('#input-document_type').type('ci');
		cy.get('#input-document_number').type('0987654321');
		cy.get('#input-phone').type('1234567890');
		cy.get('#input-cellphone').type('1029384765');
		cy.get('#input-nationality').type('uy');

		 
		cy.get('#document_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_front_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_back_file > input').attachFile('images/newVehicle.png');
		
		cy.get('#input-password').type('1234');
		cy.get('#input-passwordverification').type('1234');

		cy.get('form').submit();
		cy.contains('login.register_error');

	});

	it('Error user no email', function () {
		cy.visit('http://localhost:2000/dashboard');
		cy.contains('sidemenu.logout').click();
		cy.contains('sidemenu.logout_positive').click();
		cy.contains('login.register').click();
		cy.get('#input-username').type('admin');
		cy.get('#input-firstName').type('UnUsuario');
		cy.get('#input-lastName').type('Nuevo');
		// cy.get('#input-email').type('newUser@dronfies.com');
		cy.get('#input-address').type('Av Siempre Viva 1234');
		cy.get('#input-document_type').type('ci');
		cy.get('#input-document_number').type('0987654321');
		cy.get('#input-phone').type('1234567890');
		cy.get('#input-cellphone').type('1029384765');
		cy.get('#input-nationality').type('uy');

		 
		cy.get('#document_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_front_file > input').attachFile('images/newVehicle.png');
		cy.get('#permit_back_file > input').attachFile('images/newVehicle.png');
		
		cy.get('#input-password').type('1234');
		cy.get('#input-passwordverification').type('1234');

		cy.get('form').submit();
		cy.get('.registrationCard').then($el => {
			expect($el).to.contain('email_is_not_valid');
		});
	});


	
	   


});
