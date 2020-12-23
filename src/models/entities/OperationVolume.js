import { types } from 'mobx-state-tree';
import { GeoJsonPolygon } from '../types/GeoJsonPolygon';

export const BaseOperationVolume = types
	.model({
		ordinal: types.optional(types.integer, 0),
		volume_type: types.maybeNull(types.enumeration('VolumeType', ['TBOV', 'ABOV'])),
		near_structure: types.maybeNull(types.boolean),
		effective_time_begin: types.Date,
		effective_time_end: types.Date,
		actual_time_end: types.maybeNull(types.Date),
		min_altitude: types.refinement(types.integer, value => value >= -100),
		max_altitude: types.refinement(types.integer, value => value >= -100),
		operation_geography: types.optional(GeoJsonPolygon, GeoJsonPolygon.create({ type: 'Polygon', coordinates: [[]] })),
		beyond_visual_line_of_sight: types.optional(types.boolean, true)
	});


export const OperationVolume = BaseOperationVolume
	.named('OperationVolume')
	.props({
		id: types.identifierNumber
	});
