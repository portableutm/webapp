import {types} from 'mobx-state-tree';
import {GeoJsonPoint, Point} from './types/GeoJsonPoint';

export const MapStore = types
	.model('MapStore', {
		cornerNW: GeoJsonPoint,
		cornerSE: GeoJsonPoint
	})
	.volatile(self => ({
		map: null,
		clickIsSelecting: false,
		clickListIsComplete: false, // true when click reaches parent - topmost of bubbling
		clickListFns: [] // [{label: 'map', fn: () => {}}]
	}))
	.actions(self => ({
		setMapRef(newMapRef) {
			if (self.map === null) {
				/*
				newMapRef.on('drag', function () {
					const latLngCNW = newMapRef.getBounds().getNorthWest();
					const latLngCSE = newMapRef.getBounds().getSouthEast();
					self.setCorners(
						new Point(latLngCNW.lat, latLngCNW.lng),
						new Point(latLngCSE.lat, latLngCSE.lng)
					);
				});
				newMapRef.on('zoomend', function () {
					const latLngCNW = newMapRef.getBounds().getNorthWest();
					const latLngCSE = newMapRef.getBounds().getSouthEast();
					self.setCorners(
						new Point(latLngCNW.lat, latLngCNW.lng),
						new Point(latLngCSE.lat, latLngCSE.lng)
					);
				});
				 */

				self.map = newMapRef;
				const latLngCNW = newMapRef.getBounds().getNorthWest();
				const latLngCSE = newMapRef.getBounds().getSouthEast();
				self.cornerNW = new Point(latLngCNW.lat, latLngCNW.lng);
				self.cornerSE = new Point(latLngCSE.lat, latLngCSE.lng);
			} else {
				throw new Error('MapStore -> mapRef is already set!');
			}
		},
		setCorners(cornerNW, cornerSE) {
			self.cornerNW = cornerNW;
			self.cornerSE = cornerSE;
		}
	}))
	.views(self => ({
		get isInitialized() {
			return self.map !== null;
		}
	}))
;