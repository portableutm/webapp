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

describe('Dashboard: UVR List', function () {
	before('Auth', function () {

		cy.server();           // enable response stubbing
		cy.route({
			method: 'GET',
			url: '/uasvolume',
			response: uvrs
		});
	});

	it('Clicks use case button', function () {
		cy.visit('http://localhost:2000/dashboard/uvrs');
		cy.get('[data-test-id="showHidePropertiesUVR_1"]').click();
		cy.get('[data-test-id="showHidePropertiesUVR_1"]').click();
		cy.get('[data-test-id="viewUVR_1"]').click();
		cy.visit('http://localhost:2000/dashboard/uvrs');
		cy.get('[data-test-id="editUVR_1"]').click();
	});

});