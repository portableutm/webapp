import {types} from 'mobx-state-tree';
import {GeoJsonPolygon} from './types/GeoJsonPolygon';

export const OperationVolume = types
	.model({
		id: types.identifierNumber,
		ordinal: types.optional(types.integer, 0),
		volume_type: types.maybeNull(types.enumeration('VolumeType', ['TBOV', 'ABOV'])),
		near_structure: types.maybeNull(types.boolean),
		effective_time_begin: types.Date,
		effective_time_end: types.Date,
		actual_time_end: types.maybeNull(types.Date),
		min_altitude: types.integer,
		max_altitude: types.integer,
		operation_geography: types.maybeNull(GeoJsonPolygon),
		beyond_visual_line_of_sight: types.optional(types.boolean, true)
	});
