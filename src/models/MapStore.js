import { types } from 'mobx-state-tree';
import { GeoJsonPoint, Point } from './types/GeoJsonPoint';

export const MapStore = types
	.model('MapStore', {
		cornerNW: GeoJsonPoint,
		cornerSE: GeoJsonPoint,
		selectedDrone: types.maybeNull(types.string) // If set to a string, the positions of the drone that flew associated to this operation will be shown
	})
	.volatile(() => ({
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
		/* Navigational actions */
		setCorners(cornerNW, cornerSE) {
			self.cornerNW = cornerNW;
			self.cornerSE = cornerSE;
		},
		panTo(point) {
			if (self.isInitialized) {
				self.map.panTo(point, { animate: true, duration: 0.1 });
			}
		},
		/* Display in Sidebar */
		setSelectedDrone(gufi) {
			self.selectedDrone = gufi;
		},
		unsetSelectedDrone() {
			self.selectedDrone = null;
		},
		reset() {
			// Cleans volatile state. The model itself is resetted by the RootStore
			self.map = null;
			self.clickIsSelecting = false;
			self.clickListIsComplete = false;
			self.clickListFns = [];
		}
	}))
	.views(self => ({
		get isInitialized() {
			return self.map !== null;
		},
		get isDroneSelected() {
			return self.selectedDrone !== null;
		},
		get mapCorners() {
			const latLngCNW = self.map.getBounds().getNorthWest();
			const latLngCSE = self.map.getBounds().getSouthEast();
			const cornerNW = new Point(latLngCNW.lat, latLngCNW.lng);
			const cornerSE = new Point(latLngCSE.lat, latLngCSE.lng);
			return { cornerNW: cornerNW, cornerSE: cornerSE };
		}
	}))
;