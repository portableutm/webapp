import {API} from '../../src/consts';

const operations = {
	count: 5,
	ops: [
		{
			gufi: '4e1c5d47-5e6d-4893-84b6-ed3c15059564',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T09:10:21.654Z',
			update_time: '2020-04-13T10:07:31.180Z',
			aircraft_comments: null,
			flight_comments: 'PROPOSED',
			volumes_description: 'v0.1 - Restricted to one volume.',
			airspace_authorization: null,
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
					effective_time_begin: '2020-04-13T11:07:24.364Z',
					effective_time_end: '2020-04-13T12:07:24.364Z',
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
		},
		{
			gufi: 'a20ef8d5-506d-4f54-a981-874f6c8bd4de',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T08:59:46.146Z',
			update_time: '2020-04-13T09:00:31.552Z',
			aircraft_comments: null,
			flight_comments: 'ACCEPTED',
			volumes_description: 'Simple polygon',
			airspace_authorization: null,
			flight_number: '12345678',
			state: 'ACCEPTED',
			controller_location: null,
			gcs_location: null,
			faa_rule: 'PART_107',
			contact: 'Charly Good',
			priority_elements: {
				priority_level: 'ALERT',
				priority_status: 'NONE'
			},
			operation_volumes: [
				{
					id: 2,
					ordinal: 0,
					volume_type: null,
					near_structure: null,
					effective_time_begin: '2019-12-11T19:59:10.000Z',
					effective_time_end: '2019-12-11T20:59:10.000Z',
					actual_time_end: null,
					min_altitude: '10',
					max_altitude: '70',
					operation_geography: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.161937713623,
									-34.9027563130683
								],
								[
									-56.1612510681152,
									-34.9066277728799
								],
								[
									-56.1549854278564,
									-34.9064869957211
								],
								[
									-56.1557579040527,
									-34.9023339609562
								],
								[
									-56.161937713623,
									-34.9027563130683
								]
							]
						]
					},
					beyond_visual_line_of_sight: true
				}
			],
			uas_registrations: [],
			contingency_plans: [
				{
					contingency_id: 2,
					contingency_cause: [
						'ENVIRONMENTAL',
						'MECHANICAL_PROBLEM'
					],
					contingency_response: 'LANDING',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1636114120483,
									-34.9068213410793
								],
								[
									-56.1632251739502,
									-34.9112556875821
								],
								[
									-56.1545348167419,
									-34.9138950658402
								],
								[
									-56.1540627479553,
									-34.9090209476524
								],
								[
									-56.1636114120483,
									-34.9068213410793
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
					message_id: '6137fbfb-c38f-41f4-b8c6-cfc7fb48a8d8',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: 'Esto es solo una prueba',
					discovery_reference: 'discovery reference',
					type: 'INTERSECTION'
				},
				{
					message_id: 'be458f47-acbe-411b-92d9-3d12f098ee32',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: '(2) Esto es solo una prueba',
					discovery_reference: '(2)discovery reference',
					type: 'REPLAN'
				}
			]
		},
		{
			gufi: 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T08:59:49.740Z',
			update_time: '2020-04-13T09:00:01.482Z',
			aircraft_comments: null,
			flight_comments: 'ACTIVATED',
			volumes_description: 'Simple polygon',
			airspace_authorization: null,
			flight_number: '12345678',
			state: 'ACTIVATED',
			controller_location: null,
			gcs_location: null,
			faa_rule: 'PART_107',
			contact: 'Charly Good',
			priority_elements: {
				priority_level: 'ALERT',
				priority_status: 'NONE'
			},
			operation_volumes: [
				{
					id: 4,
					ordinal: 0,
					volume_type: null,
					near_structure: null,
					effective_time_begin: '2019-12-11T19:59:10.000Z',
					effective_time_end: '2019-12-11T20:59:10.000Z',
					actual_time_end: null,
					min_altitude: '10',
					max_altitude: '70',
					operation_geography: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1636114120483,
									-34.9068213410793
								],
								[
									-56.1632251739502,
									-34.9112556875821
								],
								[
									-56.1545348167419,
									-34.9138950658402
								],
								[
									-56.1540627479553,
									-34.9090209476524
								],
								[
									-56.1636114120483,
									-34.9068213410793
								]
							]
						]
					},
					beyond_visual_line_of_sight: true
				}
			],
			uas_registrations: [],
			contingency_plans: [
				{
					contingency_id: 4,
					contingency_cause: [
						'ENVIRONMENTAL',
						'MECHANICAL_PROBLEM'
					],
					contingency_response: 'LANDING',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1636114120483,
									-34.9068213410793
								],
								[
									-56.1632251739502,
									-34.9112556875821
								],
								[
									-56.1545348167419,
									-34.9138950658402
								],
								[
									-56.1540627479553,
									-34.9090209476524
								],
								[
									-56.1636114120483,
									-34.9068213410793
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
					message_id: '52a9e43f-884d-4107-a5c2-d0a3d83cd650',
					negotiation_id: 'toUpdate',
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: 'Esto es solo una prueba',
					discovery_reference: 'discovery reference',
					type: 'INTERSECTION'
				},
				{
					message_id: 'db69ad5d-8ed7-4ca7-bbeb-b9bd89ee8e2d',
					negotiation_id: 'toUpdate',
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: '(2) Esto es solo una prueba',
					discovery_reference: '(2)discovery reference',
					type: 'REPLAN'
				}
			]
		},
		{
			gufi: 'f7891e78-9bb4-431d-94d3-1a506910c254',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T08:59:47.892Z',
			update_time: '2020-04-13T09:00:00.885Z',
			aircraft_comments: null,
			flight_comments: 'CLOSED',
			volumes_description: 'Simple polygon',
			airspace_authorization: null,
			flight_number: '12345678',
			state: 'CLOSED',
			controller_location: null,
			gcs_location: null,
			faa_rule: 'PART_107',
			contact: 'Charly Good',
			priority_elements: {
				priority_level: 'ALERT',
				priority_status: 'NONE'
			},
			operation_volumes: [
				{
					id: 3,
					ordinal: 0,
					volume_type: null,
					near_structure: null,
					effective_time_begin: '2019-12-11T19:59:10.000Z',
					effective_time_end: '2019-12-11T20:59:10.000Z',
					actual_time_end: null,
					min_altitude: '10',
					max_altitude: '70',
					operation_geography: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1532688140869,
									-34.9046568706926
								],
								[
									-56.1554145812988,
									-34.9102175088809
								],
								[
									-56.1483764648438,
									-34.9107805904837
								],
								[
									-56.1483764648438,
									-34.9099359666314
								],
								[
									-56.1445140838623,
									-34.9066277728799
								],
								[
									-56.1532688140869,
									-34.9046568706926
								]
							]
						]
					},
					beyond_visual_line_of_sight: true
				}
			],
			uas_registrations: [],
			contingency_plans: [
				{
					contingency_id: 3,
					contingency_cause: [
						'ENVIRONMENTAL',
						'MECHANICAL_PROBLEM'
					],
					contingency_response: 'LANDING',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1636114120483,
									-34.9068213410793
								],
								[
									-56.1632251739502,
									-34.9112556875821
								],
								[
									-56.1545348167419,
									-34.9138950658402
								],
								[
									-56.1540627479553,
									-34.9090209476524
								],
								[
									-56.1636114120483,
									-34.9068213410793
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
					message_id: '36267184-f3dd-430d-b0a4-d131f4288f2f',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: '(2) Esto es solo una prueba',
					discovery_reference: '(2)discovery reference',
					type: 'REPLAN'
				},
				{
					message_id: '4b38c92a-6bed-4476-9279-aa80da440a44',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: 'Esto es solo una prueba',
					discovery_reference: 'discovery reference',
					type: 'INTERSECTION'
				}
			]
		},
		{
			gufi: 'ff4b6505-c282-42b1-b013-66f02137f5d5',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T08:59:44.339Z',
			update_time: '2020-04-13T09:00:31.161Z',
			aircraft_comments: null,
			flight_comments: 'ROGUE',
			volumes_description: 'Simple polygon',
			airspace_authorization: null,
			flight_number: '12345678',
			state: 'ROGUE',
			controller_location: null,
			gcs_location: null,
			faa_rule: 'PART_107',
			contact: 'Charly Good',
			priority_elements: {
				priority_level: 'ALERT',
				priority_status: 'NONE'
			},
			operation_volumes: [
				{
					id: 1,
					ordinal: 0,
					volume_type: null,
					near_structure: null,
					effective_time_begin: '2019-12-11T19:59:10.000Z',
					effective_time_end: '2019-12-11T20:59:10.000Z',
					actual_time_end: null,
					min_altitude: '10',
					max_altitude: '70',
					operation_geography: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1532688140869,
									-34.899940591293
								],
								[
									-56.1538696289062,
									-34.9040937470933
								],
								[
									-56.1476898193359,
									-34.9036714018596
								],
								[
									-56.1508655548096,
									-34.9003629557135
								],
								[
									-56.1532688140869,
									-34.899940591293
								]
							]
						]
					},
					beyond_visual_line_of_sight: true
				}
			],
			uas_registrations: [],
			contingency_plans: [
				{
					contingency_id: 1,
					contingency_cause: [
						'ENVIRONMENTAL',
						'MECHANICAL_PROBLEM'
					],
					contingency_response: 'LANDING',
					contingency_polygon: {
						type: 'Polygon',
						coordinates: [
							[
								[
									-56.1636114120483,
									-34.9068213410793
								],
								[
									-56.1632251739502,
									-34.9112556875821
								],
								[
									-56.1545348167419,
									-34.9138950658402
								],
								[
									-56.1540627479553,
									-34.9090209476524
								],
								[
									-56.1636114120483,
									-34.9068213410793
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
					message_id: '328d523c-3eaa-4711-922b-480100c2341a',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: 'Esto es solo una prueba',
					discovery_reference: 'discovery reference',
					type: 'INTERSECTION'
				},
				{
					message_id: '8aaaf8f2-c748-4993-9fee-d7251f969cb6',
					negotiation_id: null,
					uss_name: 'dronfies',
					uss_name_of_originator: 'dronfies',
					uss_name_of_receiver: 'dronfies',
					free_text: '(2) Esto es solo una prueba',
					discovery_reference: '(2)discovery reference',
					type: 'REPLAN'
				}
			]
		}
	]
};

describe('SP2: (Dashboard)', function () {
	beforeEach('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/operation',    //
			response: operations
		});
	});

	it('Visits Web and navigate to Dashboard', function () {
		cy.visit('http://localhost:2000/');
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('contextualmenu_dashboard').click();
	});
	it('Finds Operations button', function () {
		cy.contains('dsh.operations_list').click();
	});
	it('Find operation named ACTIVATED and check it id matches', function () {
		cy.get('[data-test-id="opACTIVATED"]').click().then(($el) => {
			expect($el).to.contain('b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63');
		});
		cy.contains('show_on_map').click();
		cy.wait(2000);
		cy.get('[data-test-id="mapButtonMenu"]').click();
		cy.contains('contextualmenu_dashboard').click();
		cy.contains('dsh.operations_list').click();
		cy.get('[data-test-id="opACTIVATED"]').click();
		cy.contains('remove_from_map').click();
	});
});
