import {types} from 'mobx-state-tree';

export class Point {
	constructor(lat, lng) {
		this.lat = lat;
		this.lng = lng;
	}

	toString() {
		return {
			'type': 'Point',
			'coordinates': [this.lat, this.lng]
		};
	}
}

export const GeoJsonPoint = types.custom({
	name: 'GeoJsonPoint',
	fromSnapshot(value) {
		return new Point(value.coordinates[0], value.coordinates[1]);
	},
	toSnapshot(value) {
		return value.toString();
	},
	isTargetType(value) {
		return value instanceof Point;
	},
	getValidationMessage(value) {
		if (value && value['coordinates'] && value['type'] && value['type']  === 'Point') return ''; // OK
		return `'${JSON.stringify(value)}' doesn't look like a valid GeoJson point`;
	}
});