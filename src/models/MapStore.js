import { getRoot, types } from 'mobx-state-tree';
import { GeoJsonPoint, Point } from './types/GeoJsonPoint';
import { BaseOperation, Operation } from './entities/Operation';
import _ from 'lodash';
import i18n from 'i18next';
import Uvr from './entities/Uvr';

const defaultNewOperation = {
	name: 'Untitled',
	contact: '',
	contact_phone: '',
	flight_comments: '',
	volumes_description: 'v0.1',
	flight_number: Date.now(),
	operation_volumes: [
		{
			near_structure: false,
			effective_time_begin: new Date(),
			effective_time_end: new Date(),
			min_altitude: 0,
			max_altitude: 120,
			beyond_visual_line_of_sight: false,
			operation_geography: {
				type: 'Polygon',
				coordinates: [[]]
			},
		}
	],
	controller_location: {
		'type': 'Point',
		'coordinates': [
			-56.15970075130463,
			-34.9119507320875
		]
	},
	priority_elements: {
		priority_level: 1,
		priority_status: 'EMERGENCY_AIR_AND_GROUND_IMPACT'
	},
	uas_registrations: [],
	contingency_plans: [
		{
			contingency_cause: ['ENVIRONMENTAL', 'LOST_NAV'],
			contingency_location_description: 'OPERATOR_UPDATED',
			contingency_polygon: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.15438461303711, -34.905501548851106],
						[-56.15138053894043, -34.90873940129964],
						[-56.14889144897461, -34.907437236859494],
						[-56.15112304687499, -34.9059942737644],
						[-56.15438461303711, -34.905501548851106]
					]
				]
			},
			contingency_response: 'LANDING',
			free_text: 'Texto libre DE prueba',
			loiter_altitude: 30,
			relative_preference: 30,
			relevant_operation_volumes: [1, 0],
			valid_time_begin: '2019-12-11T19:59:10Z',
			valid_time_end: '2019-12-11T20:59:10Z'
		}
	],
	negotiation_agreements: []
};

export const MapStore = types
	.model('MapStore', {
		cornerNW: GeoJsonPoint,
		cornerSE: GeoJsonPoint,
		/* Selected entity, to highlight in map and show properties */
		selectedDrone: types.maybeNull(types.string), // If set to a string, the positions of the drone that flew associated to this operation will be shown
		selectedOperation: types.maybeNull(types.string),
		/* Entity under creation */
		editorOperation: types.maybeNull(BaseOperation),
		editorUvr: types.maybeNull(Uvr)
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
					if (!self.csIsMapOnClickSelectionFinished) {
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
					} else {
						self.internalResetMapOnClickSelection();
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
		/* Editor actions */
		startOperationEditor(existing) {
			const operation = _.cloneDeep(existing ? existing : defaultNewOperation);
			operation.owner = getRoot(self).authStore.username;
			operation.operation_volumes[0].effective_time_begin = new Date();
			operation.operation_volumes[0].effective_time_end = new Date();
			operation.operation_volumes[0].effective_time_end.setUTCHours(operation.operation_volumes[0].effective_time_end.getUTCHours() + 1);
			self.editorOperation = operation;
			const drawPolygonPointOnClick = (event) => {
				const { latlng } = event;
				self.addOperationVolumePoint(0, latlng.lat, latlng.lng);
				getRoot(self).hideFloatingText();
			};
			self.setMapOnClick(drawPolygonPointOnClick);
		},
		setOperationInfo(property, value) {
			self.editorOperation[property] = value;
		},
		setOperationVolumeInfo(volumeIndex, property, value) {
			self
				.editorOperation
				.operation_volumes[volumeIndex]
				[property]
			= value;
		},
		addOperationVolumePoint(volumeIndex, lat, lng) {
			self.editorOperation
				.operation_volumes[volumeIndex]
				.operation_geography
				.coordinates
				.push([lat, lng]);
		},
		editOperationVolumePoint(volumeIndex, pointIndex, lat, lng) {
			self.editorOperation
				.operation_volumes[volumeIndex]
				.operation_geography
				.coordinates[pointIndex] = [lat, lng];
		},
		removeOperationVolumePoint(volumeIndex, pointIndex) {
			_.pullAt(self.editorOperation
				.operation_volumes[volumeIndex]
				.operation_geography
				.coordinates, pointIndex);
		},
		saveOperation: (function* saveOperation() {
			self.removeMapOnClick();
			/* Check polygon has been created */
			if (self
				.editorOperation
				.operation_volumes[0]
				.operation_geography.coordinates.length === 0)
				getRoot(self).setFloatingText(i18n.t('editor.cant_finish'));

			self.editorOperation.submit_time = new Date().toISOString();
			self.editorOperation.operation_volumes = self.editorOperation.operation_volumes.map((opVolume) => {
				const newCoordinates =
					opVolume.operation_geography.coordinates[0].map(lngLat => [lngLat[1], lngLat[0]]);
				return {
					...opVolume,
					operation_geography: {
						...opVolume.operation_geography,
						coordinates: [[...newCoordinates, newCoordinates[0]]] // First and last point should be the same
					}
				};
			});
			yield getRoot(self).operationStore.post(self.editorOperation); // If there is an error, it is managed by the OperationStore directly
		}),
		stopEditor() {
			self.editorOperation = null;
			self.removeMapOnClick();
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
		},
		get hasToShowDefaultMapPanels() {
			return !self.isEditingOperation	&& !self.isOperationSelected && !self.isDroneSelected;
		},
		/* Map editor */
		get isEditingOperation() {
			return self.editorOperation !== null;
		},
		get isEditingUvr() {
			return false;
		}
	}))
;