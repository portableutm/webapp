/* istanbul ignore file */

import { types } from 'mobx-state-tree';
import { GeoJsonPoint } from '../types/GeoJsonPoint';

export const ParagliderPosition = types
	.model('ParagliderPosition', {
		id: types.identifierNumber,
		altitude_gps: types.integer,
		location: GeoJsonPoint,
		time_sent: types.Date,
		username: types.string,
	});