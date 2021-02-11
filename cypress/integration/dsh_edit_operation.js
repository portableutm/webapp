const date1 = new Date();
const date2 = new Date();
date2.setUTCHours(date2.getUTCHours() + 4);
const operations = {
	'count': 1,
	'ops': [
		{
			'gufi': 'c8270484-4ce2-4035-89b4-4e4e5fe2c839',
			'name': 'DEV MISSION NOT REAL TESTING',
			'uss_name': null,
			'discovery_reference': null,
			'submit_time': '2020-12-02T19:11:54.843Z',
			'update_time': '2020-12-02T19:12:30.259Z',
			'aircraft_comments': null,
			'flight_comments': '',
			'volumes_description': 'v0.1',
			'airspace_authorization': null,
			'flight_number': null,
			'state': 'ACTIVATED',
			'controller_location': {
				'type': 'Point',
				'coordinates': [
					-56.1597007513046,
					-34.9119507320875
				]
			},
			'gcs_location': null,
			'faa_rule': null,
			'contact': 'Pepe Mujica',
			'contact_phone': 'pmujica@dronfies.com',
			'priority_elements': {
				'priority_level': '1',
				'priority_status': 'EMERGENCY_AIR_AND_GROUND_IMPACT'
			},
			'owner': {
				'username': 'admin',
				'firstName': 'Admin',
				'lastName': 'Admin',
				'email': 'admin@dronfies.com',
				'role': 'admin',
				'VolumesOfInterest': null,
				'settings': {
					'langauge': 'EN'
				},
				'dinacia_user': {
					'id': '22584b14-8175-4f04-9923-942c38d8a51a',
					'address': null,
					'document_type': null,
					'document_number': null,
					'phone': '123456789',
					'cellphone': '987654321',
					'nationality': null,
					'permit_expire_date': '2022-01-12T00:00:00.000Z',
					'document_file_path': null,
					'permit_front_file_path': null,
					'permit_back_file_path': null,
					'dinacia_company': null
				}
			},
			'operation_volumes': [
				{
					'id': 17,
					'ordinal': 0,
					'volume_type': null,
					'near_structure': false,
					effective_time_begin: date1.toISOString(),
					effective_time_end: date2.toISOString(),
					'actual_time_end': null,
					'min_altitude': '0',
					'max_altitude': '120',
					'operation_geography': {
						'type': 'Polygon',
						'coordinates': [
							[
								[
									-56.162109375,
									-34.9138774702661
								],
								[
									-56.1609721183777,
									-34.9105342427577
								],
								[
									-56.1568737030029,
									-34.9102175088809
								],
								[
									-56.156702041626,
									-34.914299763003
								],
								[
									-56.162109375,
									-34.9138774702661
								]
							]
						]
					},
					'beyond_visual_line_of_sight': false
				}
			],
			'uas_registrations': [
				{
					'uvin': '0a694894-16b9-4572-9180-3517c73d2e8d',
					'date': '2020-11-22T16:13:07.862Z',
					'nNumber': '',
					'faaNumber': '',
					'vehicleName': 'Matrice 100 ',
					'manufacturer': 'TTWSW',
					'model': 'WWS',
					'class': 'MULTIROTOR',
					'accessType': null,
					'vehicleTypeId': null,
					'org-uuid': null,
					'trackerId': 'xxxxxxx',
					'authorized': 'AUTHORIZED',
					'registeredBy': {
						'username': 'admin',
						'firstName': 'Admin',
						'lastName': 'Admin',
						'email': 'admin@dronfies.com',
						'role': 'admin',
						'VolumesOfInterest': null,
						'settings': {
							'langauge': 'EN'
						},
						'dinacia_user': {
							'id': '22584b14-8175-4f04-9923-942c38d8a51a',
							'address': null,
							'document_type': null,
							'document_number': null,
							'phone': '123456789',
							'cellphone': '987654321',
							'nationality': null,
							'permit_expire_date': '2022-01-12T00:00:00.000Z',
							'document_file_path': null,
							'permit_front_file_path': null,
							'permit_back_file_path': null,
							'dinacia_company': null
						}
					},
					'owner': {
						'username': 'admin',
						'firstName': 'Admin',
						'lastName': 'Admin',
						'email': 'admin@dronfies.com',
						'role': 'admin',
						'VolumesOfInterest': null,
						'settings': {
							'langauge': 'EN'
						},
						'dinacia_user': {
							'id': '22584b14-8175-4f04-9923-942c38d8a51a',
							'address': null,
							'document_type': null,
							'document_number': null,
							'phone': '123456789',
							'cellphone': '987654321',
							'nationality': null,
							'permit_expire_date': null,
							'document_file_path': null,
							'permit_front_file_path': null,
							'permit_back_file_path': null,
							'dinacia_company': null
						}
					},
					'operators': [
						{
							'username': 'RenatePenvarden',
							'firstName': 'Renate',
							'lastName': 'Penvarden',
							'email': 'renate@dronfies.com',
							'role': 'pilot',
							'VolumesOfInterest': null,
							'settings': {
								'langauge': 'EN'
							},
							'dinacia_user': null
						}
					],
					'dinacia_vehicle': {
						'id': '11162e59-130e-4f10-87c6-4a39ec286736',
						'authorized': false,
						'caa_registration': 'CX-2020-1',
						'serial_number_file_path': 'http://68.183.22.43:3000/uploads/1606061586086-363749549-serial_number_file.jpg',
						'usage': null,
						'construction_material': null,
						'year': null,
						'serial_number': null,
						'empty_weight': 0,
						'max_weight': 0,
						'takeoff_method': null,
						'sensor_type_and_mark': null,
						'packing': null,
						'longitude': 0,
						'height': 0,
						'color': null,
						'max_speed': 0,
						'cruise_speed': 0,
						'landing_speed': 0,
						'time_autonomy': null,
						'radio_accion': null,
						'ceiling': null,
						'communication_control_system_command_navigation_vigilance': null,
						'maintenance_inspections': null,
						'remarks': null,
						'engine_manufacturer': null,
						'engine_type': null,
						'engine_model': null,
						'engine_power': null,
						'engine_fuel': null,
						'engine_quantity_batteries': null,
						'propeller_type': null,
						'propeller_model': null,
						'propeller_material': null,
						'remote_sensor_file_path': null,
						'remote_sensor_id': null
					}
				}
			],
			'creator': {
				'username': 'operator',
				'firstName': 'Operator',
				'lastName': '-',
				'email': 'operator@dronfies.com',
				'role': 'admin',
				'VolumesOfInterest': {
					'type': 'Polygon',
					'coordinates': [
						[
							[
								-56.160736,
								-34.899941
							],
							[
								-56.159706,
								-34.922816
							],
							[
								-56.170607,
								-34.917748
							],
							[
								-56.172495,
								-34.901419
							],
							[
								-56.160736,
								-34.899941
							]
						]
					]
				},
				'settings': {
					'langauge': 'EN'
				},
				'dinacia_user': {
					'id': '9cd3e07c-38f8-491c-af27-8928818f57b2',
					'address': null,
					'document_type': null,
					'document_number': null,
					'phone': null,
					'cellphone': null,
					'nationality': null,
					'permit_expire_date': '2022-12-23T00:00:00.000Z',
					'document_file_path': null,
					'permit_front_file_path': null,
					'permit_back_file_path': null,
					'dinacia_company': null
				}
			},
			'contingency_plans': [
				{
					'contingency_id': 17,
					'contingency_cause': [
						'ENVIRONMENTAL',
						'LOST_NAV'
					],
					'contingency_response': 'LANDING',
					'contingency_polygon': {
						'type': 'Polygon',
						'coordinates': [
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
					'loiter_altitude': 30,
					'relative_preference': 30,
					'contingency_location_description': 'OPERATOR_UPDATED',
					'relevant_operation_volumes': [
						'1',
						'0'
					],
					'valid_time_begin': '2020-11-01T18:18:36.000Z',
					'valid_time_end': '2020-11-01T18:48:36.000Z',
					'free_text': 'Texto libre DE prueba'
				}
			],
			'negotiation_agreements': []
		}
	]
};


describe('Edit operation', function () {
	before('Auth', function () {
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/operation',    //
			response: operations
		});
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/dashboard/operations');
		cy.contains('edit_on_map').click();
		cy.window().then((win) => {
			win.store.mapStore.editOperationVolumePoint(0, 0, 0, 0);
			win.store.mapStore.removeOperationVolumePoint(0, 0);
		});
	});
});
