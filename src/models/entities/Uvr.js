import { types } from 'mobx-state-tree';
import { GeoJsonPolygon } from '../types/GeoJsonPolygon';

const Uvr = types
	.model({
		message_id: types.identifier, // Automated
		uss_name: types.maybeNull(types.string),
		type: types.optional(types.enumeration('UvrType', ['DYNAMIC_RESTRICTION', 'STATIC_ADVISORY']), 'DYNAMIC_RESTRICTION'),
		cause: types.optional(types.enumeration('UvrCause', ['WEATHER','ATC', 'SECURITY', 'SAFETY', 'MUNICIPALITY', 'OTHER']), 'OTHER'),
		reason: types.refinement(types.string, value => value.length < 1000),
		geography: GeoJsonPolygon,
		effective_time_begin: types.Date,
		effective_time_end: types.Date,
		min_altitude: types.refinement(types.integer, value => value >= 0),
		max_altitude: types.refinement(types.integer, value => value >= 0),
		permitted_uas: types.optional(types.array(types.enumeration('UvrPermittedUAS', ['NOT_SET', 'PUBLIC_SAFETY', 'SECURITY', 'NEWS_GATHERING', 'VLOS', 'SUPPORT_LEVEL', 'PART_107', 'PART_101E', 'PART_107X', 'RADIO_LINE_OF_SIGHT'])), ['NOT_SET'])
	});

export default Uvr;
/*

actual_time_end: null,
cause: 'SECURITY',
effective_time_begin: new Date(),
effective_time_end: new Date(),
geography: {
	type: 'Polygon',
	coordinates: []
},
max_altitude: '50',
min_altitude: '0',
permitted_uas: [],
reason: 'Unknown',
required_support: ['ENHANCED_SAFE_LANDING'],
type: 'DYNAMIC_RESTRICTION',
uss_name: null

 */