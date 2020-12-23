/* istanbul ignore file */

import { types } from 'mobx-state-tree';
import { values } from 'mobx';
import { Position } from './entities/Position';
import { ParagliderPosition } from './entities/ParagliderPosition';

export const PositionStore = types
	.model('PositionStore', {
		positions: types.map(types.array(Position)),
		paraglidersPositions: types.map(types.array(ParagliderPosition))
	})
	.volatile(() => ({
		hasFetched: false
	}))
	.actions(self => {
		return {
			addPosition(position) {
				const locationLatLng = {
					...position.location,
					coordinates: [position.location.coordinates[1], position.location.coordinates[0]]
				};
				const pilotLocationLatLng =
					position.controller_location ? {
						...position.controller_location,
						coordinates: [
							position.controller_location.coordinates[1],
							position.controller_location.coordinates[0]
						]
					}: null;
				const correctedPosition = { ...position, location: locationLatLng, controller_location: pilotLocationLatLng };
				if (self.positions.has(position.gufi)) {
					self.positions.get(position.gufi).push(correctedPosition);
				} else {
					self.positions.set(position.gufi, [correctedPosition]);
				}
			},
			addParagliderPosition(position) {
				const locationLatLng = {
					...position.location,
					coordinates: [position.location.coordinates[1], position.location.coordinates[0]]
				};
				const correctedPosition = { ...position, location: locationLatLng, username: position.user.username, time_sent: new Date(position.time_sent) };
				if (self.paraglidersPositions.has(correctedPosition.username)) {
					self.paraglidersPositions.get(correctedPosition.username).push(correctedPosition);
				} else {
					self.paraglidersPositions.set(correctedPosition.username, [correctedPosition]);
				}
			},
			reset() {
				self.hasFetched = false;
			}
		};
	})
	.views(self => {
		return {
			get allPositions() {
				return values(self.positions);
			},
			get allParagliderPositions() {
				return values(self.paraglidersPositions);
			}
		};
	});