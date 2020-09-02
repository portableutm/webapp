import { getRoot, types } from 'mobx-state-tree';
import { GeoJsonPoint, Point } from './types/GeoJsonPoint';

export const MapStore = types
	.model('MapStore', {
		cornerNW: GeoJsonPoint,
		cornerSE: GeoJsonPoint,
		selectedDrone: types.maybeNull(types.string), // If set to a string, the positions of the drone that flew associated to this operation will be shown
		selectedOperation: types.maybeNull(types.string)
	})
	.volatile(() => ({
		map: null,
		/* Volatile state for the selection of click function when many are possible */
		/* cs - click selection */
		csIsMapOnClickActivated: false,
		csIsMapOnClickSelectionActivated: false,
		csIsMapOnClickSelectionFinished: false,
		csMapOnClickFn: null,
		csCapturedFns: [],
		csX: 0,
		csY: 0,

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
				const mapOnClickCapture = (evt) => {
					if (evt.currentTarget !== evt.target && // This means we didn't click in the map directly, but on a child
						self.csIsMapOnClickActivated) {
						self.internalSetMapOnClickSelectionActivated(evt.x, evt.y);
					}
				};
				const mapOnClickBubbling = (leafletEvent) => {
					if (self.csIsMapOnClickActivated &&
						self.csIsMapOnClickSelectionActivated) {
						// Executes captured click functions
						if (self.csCapturedFns.length > 0) {
							// Executes for actual clicks, not events like a drag.
							self.internalSetMapOnClickSelectionFinished();
						} else {
							self.internalResetMapOnClickSelection();
							self.csMapOnClickFn(leafletEvent);
						}
					} else if (self.csIsMapOnClickActivated) {
						self.csMapOnClickFn(leafletEvent);
					}
				};

				newMapRef.getContainer().addEventListener('click', mapOnClickCapture, { capture: true });
				// We use Leaflet owns event handler to have correct positions of click
				// newMapRef.getContainer().addEventListener('click', mapOnClickBubbling, { capture: false });
				newMapRef.on('click', mapOnClickBubbling);

				self.map = newMapRef;

				const latLngCNW = newMapRef.getBounds().getNorthWest();
				const latLngCSE = newMapRef.getBounds().getSouthEast();
				self.cornerNW = new Point(latLngCNW.lat, latLngCNW.lng);
				self.cornerSE = new Point(latLngCSE.lat, latLngCSE.lng);
			} else {
				throw new Error('MapStore -> mapRef is already set!');
			}
		},
		/* Map OnClick functions - allows to select one of many if many are allowed */
		internalSetMapOnClickSelectionActivated(x, y) {
			// Do not use outside of the store. This action exists to allow 'mapOnClickCapture' to run normally.
			self.csIsMapOnClickSelectionActivated = true;
			self.csX = x;
			self.csY = y;
		},
		internalResetMapOnClickSelection() {
			self.csIsMapOnClickSelectionActivated = false;
			self.csIsMapOnClickSelectionFinished = false;
			self.csCapturedFns = [];
		},
		internalSetMapOnClickSelectionFinished() {
			// Do not use outside of the store. This action exists to allow 'mapOnClickBubbling' to run normally.
			self.csCapturedFns.push({ label: 'Map', fn: () => {
				self.internalResetMapOnClickSelection();
				self.csMapOnClickFn(self.csEvt);
			} });
			self.csIsMapOnClickSelectionFinished = true;
		},
		setMapOnClick(fn) {
			self.csIsMapOnClickActivated = true;
			self.csMapOnClickFn = fn;
		},
		removeMapOnClick() {
			self.csIsMapOnClickActivated = false;
			self.csMapOnClickFn = null;
		},
		executeFunctionInMap(mapFn, label, evt) {
			if (self.csIsMapOnClickSelectionActivated) {
				const mapFnAndFinishClickSelection = (evt) => {
					self.internalResetMapOnClickSelection();
					mapFn(evt);
				};
				self.csEvt = evt;
				self.csCapturedFns.push({ label, fn: mapFnAndFinishClickSelection });
			} else {
				mapFn(evt);
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
		/* Actions related to the logic of clicking in the map and choosing the correct onClick to be called */
		/* setMapOnClick(fn) {
			if (self.isInitialized) {

				store.state.map.mapRef.current.getContainer().addEventListener('click', clickListener, { capture: true });
				store.state.map.mapRef.current.on('click', (evt) => {
					executeOrAddToClickSelection(store, 'MAP: add new point', () => fn(evt), true);
				});
				store.state.map.mapRef.current.on('contextmenu', (evt) => {
					fn(evt);
				});
				store.state.map.mapRef.current.on('drag', () => {
					disableClickSelection(store);
				});
			}
		}, */
		/* Set selected entity to display in sidebar */
		setSelectedOperation(gufi) {
			self.unsetSelectedDrone();
			self.selectedOperation = gufi;
		},
		unsetSelectedOperation() {
			self.selectedOperation = null;
		},
		setSelectedDrone(gufi) {
			self.selectedDrone = gufi;
		},
		unsetSelectedDrone() {
			self.selectedDrone = null;
		},
		reset() {
			// Cleans volatile state. The model itself is resetted by the RootStore
			self.map = null;
			self.csIsMapOnClickActivated = false;
			self.csIsMapOnClickSelectionActivated = false;
			self.csIsMapOnClickSelectionFinished = false;
			self.csMapOnClickFn = null;
			self.csCapturedFns = [];
			self.csX = 0;
			self.csY = 0;
		}
	}))
	.views(self => ({
		get isInitialized() {
			return self.map !== null;
		},
		get isOperationSelected() {
			return self.selectedOperation !== null;
		},
		get getSelectedOperation() {
			const operation = getRoot(self).operationStore.operations.get(self.selectedOperation);
			return [
				['operations.name', operation.name],
				['ID',operation.gufi],
				['operations.state', operation.state],
				['operations.owner', operation.owner.asDisplayString],
				['operations.contact', operation.contact],
				['operations.phone', operation.contact_phone],
				['volumes.effective_time_begin', new Date(operation.operation_volumes[0].effective_time_begin).toLocaleString()],
				['volumes.effective_time_end', new Date(operation.operation_volumes[0].effective_time_end).toLocaleString()],
				['volumes.max_altitude', operation.operation_volumes[0].max_altitude+'m'],
				['operations.flight_comments', operation.flight_comments]
			];
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