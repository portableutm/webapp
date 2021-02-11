/*
	SP1: Map - Layers filtering
*/


import { API } from '../../src/consts';

const date1 = new Date();
const date2 = new Date();
date2.setUTCHours(date2.getUTCHours() + 4);

const operations = {
	count: 5,
	ops: [
		{
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
			gufi: '4e1c5d47-5e6d-4893-84b6-ed3c15059564',
			uss_name: null,
			discovery_reference: null,
			submit_time: '2020-04-13T09:10:21.654Z',
			update_time: '2020-04-13T10:07:31.180Z',
			aircraft_comments: null,
			name: 'PROPOSED',
			volumes_description: 'v0.1 - Restricted to one volume.',
			airspace_authorization: null,
			owner: {
				firstName: 'test',
				lastName: 'test',
				username: 'test',
				email: 'spam@example.com',
				password: 'fake',
				role: 'pilot'
			},
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
					effective_time_begin: date1.toISOString(),
					effective_time_end: date2.toISOString(),
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
			gufi: 'a20ef8d5-506d-4f54-a981-874f6c8bd4de',
			uss_name: null,
			discovery_reference: null,
			owner: {
				firstName: 'test',
				lastName: 'test',
				username: 'test',
				email: 'spam@example.com',
				password: 'fake',
				role: 'pilot'
			},
			submit_time: '2020-04-13T08:59:46.146Z',
			update_time: '2020-04-13T09:00:31.552Z',
			aircraft_comments: null,
			name: 'ACCEPTED',
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
					effective_time_begin: date1.toISOString(),
					effective_time_end: date2.toISOString(),
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
			gufi: 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63',
			uss_name: null,
			discovery_reference: null,
			owner: {
				firstName: 'test',
				lastName: 'test',
				username: 'test',
				email: 'spam@example.com',
				password: 'fake',
				role: 'pilot'
			},
			submit_time: '2020-04-13T08:59:49.740Z',
			update_time: '2020-04-13T09:00:01.482Z',
			aircraft_comments: null,
			name: 'ACTIVATED',
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
					effective_time_begin: date1.toISOString(),
					effective_time_end: date2.toISOString(),
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
			gufi: 'f7891e78-9bb4-431d-94d3-1a506910c254',
			uss_name: null,
			discovery_reference: null,
			owner: {
				firstName: 'test',
				lastName: 'test',
				username: 'test',
				email: 'spam@example.com',
				password: 'fake',
				role: 'pilot'
			},
			submit_time: '2020-04-13T08:59:47.892Z',
			update_time: '2020-04-13T09:00:00.885Z',
			aircraft_comments: null,
			name: 'PENDING',
			volumes_description: 'Simple polygon',
			airspace_authorization: null,
			flight_number: '12345678',
			state: 'PENDING',
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
					effective_time_begin: date1.toISOString(),
					effective_time_end: date2.toISOString(),
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
			gufi: 'ff4b6505-c282-42b1-b013-66f02137f5d5',
			uss_name: null,
			discovery_reference: null,
			owner: {
				firstName: 'test',
				lastName: 'test',
				username: 'test',
				email: 'spam@example.com',
				password: 'fake',
				role: 'pilot'
			},
			submit_time: '2020-04-13T08:59:44.339Z',
			update_time: '2020-04-13T09:00:31.161Z',
			aircraft_comments: null,
			name: 'ROGUE',
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
					effective_time_end: date2.toISOString(),
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
const uvrs = [{
	'message_id': 'a7563257-214b-4060-a463-5e817aa3b90d',
	'uss_name': null,
	'type': 'DYNAMIC_RESTRICTION',
	'permitted_uas': [],
	'required_support': ['ENHANCED_SAFE_LANDING'],
	'cause': 'SECURITY',
	'geography': {
		'type': 'Polygon',
		'coordinates': [[[-56.1577962941741, -34.9235413280114], [-56.1586868079393, -34.9249445306604], [-56.1563425036297, -34.9261365742477], [-56.1539821056977, -34.9243199105009], [-56.1558920151171, -34.923805174418]]]
	},
	'effective_time_begin': '2020-08-07T13:36:57.716Z',
	'effective_time_end': '2021-08-07T15:36:57.716Z',
	'actual_time_end': null,
	'min_altitude': '0',
	'max_altitude': '50',
	'reason': 'UVR 1'
}, {
	'message_id': 'b875b36b-df8e-4ca9-924c-93399be258ca',
	'uss_name': null,
	'type': 'DYNAMIC_RESTRICTION',
	'permitted_uas': [],
	'required_support': null,
	'cause': 'SECURITY',
	'geography': {
		'type': 'Polygon',
		'coordinates': [[[-56.0820284259118, -34.9162024293944], [-56.0805692785329, -34.9227481561825], [-56.0736168704337, -34.9166951366758], [-56.0820284259118, -34.9162024293944]]]
	},
	'effective_time_begin': '2020-09-09T15:12:31.497Z',
	'effective_time_end': '2020-09-09T17:12:31.497Z',
	'actual_time_end': null,
	'min_altitude': '0',
	'max_altitude': '50',
	'reason': 'UVR 2'
}];
const rfvs = [{
	'id': '056ccb91-c58c-439b-93a0-592e19cba0b8',
	'geography': {
		'type': 'Polygon',
		'coordinates': [[[-56.04538, -34.816622], [-56.058598, -34.850016], [-56.04744, -34.864666], [-56.007099, -34.85396], [-55.992165, -34.828741], [-55.996971, -34.81634], [-56.016884, -34.81479], [-56.04538, -34.816622]]]
	},
	'min_altitude': '0',
	'max_altitude': '50',
	'comments': 'RFV 1'
}];

describe('SP1: (Map) Layers', function () {
	before('Auth', function () {
		cy.setCookie('sneaky', 'admin');
		cy.setCookie('hummingbird', 'admin');
		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',      // Route all GET requests
			url: '/operation',    //
			response: operations
		});
		cy.route({
			method: 'GET',
			url: '/restrictedflightvolume',
			response: rfvs
		});
		cy.route({
			method: 'GET',
			url: '/uasvolume',
			response: uvrs
		});
	});

	it('Clicks use case button', function () {
		cy.visit('http://localhost:2000/');
		cy.contains('filter.bystate').click();
		//cy.get('[data-test-id="mapButtonLayers"]').click();
	});

	it('Deselects all', function () {
		/*cy.get('[data-test-id="layersPROPOSED"]').uncheck({force: true});*/
		cy.get('[data-test-id="layersACCEPTED"]').uncheck({ force: true });
		cy.get('[data-test-id="layersACTIVATED"]').uncheck({ force: true });
		cy.get('[data-test-id="layersPENDING"]').uncheck({ force: true });
		cy.get('[data-test-id="layersROGUE"]').uncheck({ force: true });
		cy.contains('UVR 1').click({ force: true });
	});
	/*it('Check PROPOSED operation', function () {
		cy.get('[data-test-id="layersPROPOSED"]').check({force: true});
		cy.get('.leaflet-interactive').click({force: true});
		cy.get('.leaflet-popup-content').then(($el) =>
			expect($el).to.contain('Operation PROPOSED')
		);
		cy.get('[data-test-id="layersPROPOSED"]').uncheck({force: true});
	});*/
	/*it('Check ACCEPTED operation', function () {
		cy.get('[data-test-id="mapButtonLayers"]').click();
		cy.get('[data-test-id="layersACCEPTED"]').check({force: true});
		cy.get('.leaflet-interactive').click({force: true});
		cy.get('.leaflet-popup-content').then(($el) =>
			expect($el).to.contain('Operation ACCEPTED')
		);
		cy.get('[data-test-id="layersACCEPTED"]').uncheck({force: true});
	});*/
	it('Check ACTIVATED operation', function () {
		//cy.get('[data-test-id="rightAreaOpener"]').click();
		//cy.get('[data-test-id="mapButtonLayers"]').click();
		cy.get('[data-test-id="layersACTIVATED"]').check({ force: true });
		cy.get('[data-test-id="rightAreaCloser"]').click();
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.get('[data-test-id="layersACTIVATED"]').uncheck({ force: true });
	});
	it('Check PENDING operation', function () {
		//cy.get('[data-test-id="rightAreaOpener"]').click();
		//cy.get('[data-test-id="mapButtonLayers"]').click();
		cy.get('[data-test-id="layersPENDING"]').check({ force: true });
		cy.get('[data-test-id="rightAreaCloser"]').click();
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.get('[data-test-id="layersPENDING"]').uncheck({ force: true });
	});
	it('Check ROGUE operation', function () {
		//cy.get('[data-test-id="rightAreaOpener"]').click();
		//cy.get('[data-test-id="mapButtonLayers"]').click();
		cy.get('[data-test-id="layersROGUE"]').check({ force: true });
		cy.get('[data-test-id="rightAreaCloser"]').click();
		cy.get('[data-test-id="rightAreaOpener"]').click();
		cy.get('[data-test-id="layersROGUE"]').uncheck({ force: true });
	});
	it('Tries the filter by name function', function () {
		cy.get('.bp3-input').type('CLOSED');
		cy.get('#rightAreaInside').then($el =>
			expect($el).not.to.contain('CLOSED')
		);
		cy.get('.bp3-input').clear();
		cy.get('.bp3-input').type('ACTIVATED');
		cy.get('#rightAreaInside').then($el =>
			expect($el).to.contain('ACTIVATED')
		);
	});
	it('Deselects all', function () {
		/*cy.get('[data-test-id="layersPROPOSED"]').uncheck({force: true});*/
		cy.get('[data-test-id="layersACCEPTED"]').uncheck({ force: true });
		cy.get('[data-test-id="layersACTIVATED"]').uncheck({ force: true });
		cy.get('[data-test-id="layersPENDING"]').uncheck({ force: true });
		cy.get('[data-test-id="layersROGUE"]').uncheck({ force: true });
	});
	it('Tries out the RFVs', function () {
		cy.get('.bp3-input').clear();
		cy.get('.bp3-input').type('UVR 1');
		cy.get('#rightAreaInside').then($el =>
			expect($el).to.contain('UVR 1')
		);
		cy.get('.bp3-input').clear();
		cy.get('.bp3-input').clear();
		cy.contains('ACTIVATED').click();
	});
	it('Select and unselect an Operation', function () {
		cy.window().then((win) => {
			win.store.mapStore.setSelectedOperation('a20ef8d5-506d-4f54-a981-874f6c8bd4de');
			win.store.mapStore.unsetSelectedOperation();
		});
	});
});