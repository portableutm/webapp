const operations = {
	count: 1,
	ops: [
		{
			gufi: '4e1c5d47-5e6d-4893-84b6-ed3c15059564',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T09:10:21.654Z',
			update_time: '2020-04-13T10:07:31.180Z',
			aircraft_comments: null,
			name: 'PROPOSED',
			volumes_description: 'v0.1 - Restricted to one volume.',
			airspace_authorization: null,
			owner: { firstName: 'test', lastName: 'test', username: 'test', email: 'spam@example.com', password: 'fake', role: 'pilot' },
			flight_number: '12345678',
			state: 'PROPOSED',
			controller_location: null,
			gcs_location: null,
			faa_rule: '0',
			contact: null,
			priority_elements: {
				priority_level: '1',
				priority_status: 'EMERGENCY_AIR_AND_GROUND_IMPACT'
			},
			operation_volumes: [
				{
					id: 5,
					ordinal: 0,
					volume_type: null,
					near_structure: false,
					effective_time_begin: (new Date()).toISOString(),
					effective_time_end: (new Date()).toISOString(),
					actual_time_end: null,
					min_altitude: '0',
					max_altitude: '393',
					operation_geography: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.0309278259604,
									-34.8541760552493
								],
								[
									-56.0306649582548,
									-34.8548628275481
								],
								[
									-56.0298924490791,
									-34.8549860937642
								]
							]
						]
					},
					beyond_visual_line_of_sight: false
				}
			],
			uas_registrations: [],
			contingency_plans: [
				{
					contingency_id: 5,
					contingency_cause: [
						'ENVIRONMENTAL',
						'LOST_NAV'
					],
					contingency_response: 'LANDING',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1543846130371,
									-34.9055015488511
								],
								[
									-56.1513805389404,
									-34.9087394012996
								],
								[
									-56.1488914489746,
									-34.9074372368595
								],
								[
									-56.151123046875,
									-34.9059942737644
								],
								[
									-56.1543846130371,
									-34.9055015488511
								]
							]
						]
					},
					loiter_altitude: 30,
					relative_preference: 30,
					contingency_location_description: 'OPERATOR_UPDATED',
					relevant_operation_volumes: [
						'1',
						'0'
					],
					valid_time_begin: '2019-12-11T19:59:10.000Z',
					valid_time_end: '2019-12-11T20:59:10.000Z',
					free_text: 'Texto libre DE prueba'
				}
			],
			negotiation_agreements: [
				{
					message_id: '649e1d41-072b-4264-8280-13bebff670d0',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: 'Esto es solo una prueba PRUEBAAAA',
					discovery_reference: 'discovery reference',
					type: 'INTERSECTION'
				},
				{
					message_id: 'af9da74a-7533-47c5-a6bb-47bb3eb059f7',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: '(2) Esto es solo una prueba',
					discovery_reference: '(2)discovery reference',
					type: 'INTERSECTION'
				}
			]
		}
	]
};


describe('Special Use Case: Notifications', function() {
	before('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/operation',    //
			response: operations
		});
	});

	it('Login and suceeds', function() {
		cy.visit('http://localhost:2000/');
		cy.window().then((win) => {
			win.store.notificationStore.addInformation({ header: 'test', body: 'test' });
			cy.get('.bp3-card').first().click();
			cy.get('[data-test-id="acknowledgeNotification"]').first().click();
			cy.get('[data-test-id="deleteNotification"]').first().click();
			win.store.notificationStore.addOperationGoneRogue('4e1c5d47-5e6d-4893-84b6-ed3c15059564');
			cy.get('.bp3-card').first().click();
			cy.get('[data-test-id="acknowledgeNotification"]').first().click();
			cy.get('[data-test-id="deleteNotification"]').first().click();
			win.store.notificationStore.addUTMMessage({
				message_id: 'TEST',
				severity: 'EMERGENCY',
				time_sent: 11111111,
				body: 'whatever'
			});
			cy.get('.bp3-card').first().click();
			cy.get('[data-test-id="acknowledgeNotification"]').first().click();
			cy.get('[data-test-id="deleteNotification"]').first().click();
		});
	});
});
