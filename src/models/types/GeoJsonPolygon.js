/* istanbul ignore file */

import { types } from 'mobx-state-tree';
import { extendObservable } from 'mobx';

export class Polygon {
	constructor(coordinates) {
		// coordinates is in an array of latlngs
		extendObservable(this, { coordinates });
	}

	toString() {
		return {
			'type': 'Polygon',
			'coordinates': [this.coordinates]
		};
	}
}

export const GeoJsonPolygon = types.custom({
	// Polygon without holes
	name: 'GeoJsonPolygon',
	fromSnapshot(value) {
		return new Polygon(value.coordinates[0]);
	},
	toSnapshot(value) {
		return value.toString();
	},
	isTargetType(value) {
		return value instanceof Polygon;
	},
	getValidationMessage(value) {
		if (value && value['coordinates'] && value['type'] && value['type']  === 'Polygon') return ''; // OK
		return `'${JSON.stringify(value)}' doesn't look like a valid GeoJson polygon`;
	}
});