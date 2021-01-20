
/*
UseCase 01A: Create new Operation
 */
describe('Use Case: Add new vehicle', function () {

	beforeEach('Auth', function () {

		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'POST',      // Route all GET requests
			url: '/vehicle'    //
		}).as('postVehicle');
	});

	it('Create valid vehicle for admin', function () {
		cy.visit('http://localhost:2000/dashboard/vehicles/admin');
		cy.contains('add_vehicle').click();
		cy.wait(1000);
		// cy.get('#text-nNumber').type('13245', { force: true });
		// cy.get('#text-faaNumber').type('NJ371', { force: true });

		cy.get('#text-vehicleName').type('Air Force One', { force: true });
		cy.get('#text-manufacturer').type('DJI', { force: true });
		cy.get('#text-model').type('Phantom', { force: true });
		// cy.get('#text-usage').type('Recreativo', { force: true });
		// cy.get('#text-construction_material').type('Plastico', { force: true });

		cy.get('#text-year').clear().type('2021', { force: true });
		// cy.get('#text-serial_number').type('SN0987654321', { force: true });
		
		cy.get('input[type=file]').attachFile('images/newVehicle.png');
		cy.get('#add_vehicle_btn').click();
		cy.wait(1000);
		cy.contains('Vehicle saved successfully')

	})

	it('Error while crete vehicle name cant be empty', function () {
		cy.visit('http://localhost:2000/dashboard/vehicles/admin');
		cy.contains('add_vehicle').click();
		cy.wait(1000);

		// cy.get('#text-vehicleName').type('Air Force One', { force: true });
		cy.get('#text-manufacturer').type('DJI', { force: true });
		cy.get('#text-model').type('Phantom', { force: true });
		// cy.get('#text-usage').type('Recreativo', { force: true });
		// cy.get('#text-construction_material').type('Plastico', { force: true });

		cy.get('#text-year').clear().type('2021', { force: true });x
		
		// cy.get('#text-serial_number').type('SN0987654321', { force: true });
		
		cy.get('input[type=file]').attachFile('images/newVehicle.png');
		cy.get('#add_vehicle_btn').click();
		cy.wait(1000);
		// cy.contains('Error')
		cy.contains('Error').contains('Vehicle name')


	})

	it('Error while crete vehicle image serial number cant be empty', function () {
		cy.visit('http://localhost:2000/dashboard/vehicles/admin');
		cy.contains('add_vehicle').click();
		cy.wait(1000);

		// cy.get('#text-vehicleName').type('Air Force One', { force: true });
		cy.get('#text-manufacturer').type('DJI', { force: true });
		cy.get('#text-model').type('Phantom', { force: true });
		// cy.get('#text-usage').type('Recreativo', { force: true });
		// cy.get('#text-construction_material').type('Plastico', { force: true });

		cy.get('#text-year').clear().type('2021', { force: true });
		
		// cy.get('#text-serial_number').type('SN0987654321', { force: true });
		
		// cy.get('input[type=file]').attachFile('images/newVehicle.png');
		cy.get('#add_vehicle_btn').click();
		cy.wait(1000);
		cy.contains('Error').contains('Serial number')

	})

	/*
	it('Finish and add', function () {
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