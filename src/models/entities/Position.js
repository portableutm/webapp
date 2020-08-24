import { types } from 'mobx-state-tree';
import { GeoJsonPoint } from '../types/GeoJsonPoint';

export const Position = types
	.model('Position', {
		id: types.identifierNumber,
		altitude_gps: types.integer,
		location: GeoJsonPoint,
		controller_location: types.maybeNull(GeoJsonPoint),
		gufi: types.string, // TODO: This actually represents the operation, but there could be more than one drone
		// time_sent:
		heading: types.integer
	})
	.views(self => {
		return {
			get isControllerLocationSet() {
				return self.controller_location !== null;
			}
		};
	});