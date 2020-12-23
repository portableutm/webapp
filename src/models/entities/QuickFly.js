import { types } from 'mobx-state-tree';
import { GeoJsonPoint } from '../types/GeoJsonPoint';

export const QuickFly = types
	.model('QuickFly', {
		id: types.identifier,
		name: types.string,
		cornerNW: GeoJsonPoint,
		cornerSE: GeoJsonPoint
	})
	.views(self => {
		return {
			get asBackendFormat() {
				return {
					name: self.name,
					cornerNW: {
						type: 'Point',
						coordinates: [self.cornerNW.lng, self.cornerNW.lat]
					},
					cornerSE: {
						type: 'Point',
						coordinates: [self.cornerSE.lng, self.cornerSE.lat]
					}
				};
			}
		};
	});