import {types} from 'mobx-state-tree';
import {GeoJsonPolygon} from '../types/GeoJsonPolygon';

const Rfv = types
	.model({
		id: types.identifier, // Automated
		geography: GeoJsonPolygon,
		min_altitude: types.refinement(types.integer, value => value >= 0),
		max_altitude: types.refinement(types.integer, value => value >= 0),
		comments: types.string
	});

export default Rfv;
/*
id: string,
geography: polygon
min_altitude
max_altitude
comments: string
 */