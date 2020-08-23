/* Libraries */
import {flow, getRoot, types} from 'mobx-state-tree';
import { values } from 'mobx';
import _ from 'lodash';

import {Operation} from './entities/Operation';

export const OperationStore = types
	.model('OperationStore', {
		operations: types.map(Operation),
		filterShowAccepted: false,
		filterShowPending: true,
		filterShowActivated: true,
		filterShowRogue: true,
		filterShowOthers: false,
		filterShownIds: types.array(types.string),
		layersShowLabelsOnlyMatchingText: ''
	})
	.actions(self => {
		const cleanOperation = (operation) => {
			const correctedOperation = _.cloneDeep(operation);
			correctedOperation.owner = operation.owner ? operation.owner.username : null;
			correctedOperation.submit_time = new Date(operation.submit_time);
			correctedOperation.update_time = new Date(operation.update_time);
			correctedOperation.operation_volumes = operation.operation_volumes.map(
				(volume) => {
					const coordinates = volume.operation_geography.coordinates.map((coords) =>
						coords.map((pos) => [pos[1], pos[0]])
					);
					const operationGeography = {...volume.operation_geography, coordinates: [coordinates]};
					return {...volume,
						min_altitude: parseInt(volume.min_altitude),
						max_altitude: parseInt(volume.max_altitude),
						effective_time_begin: new Date(volume.effective_time_begin),
						effective_time_end: new Date(volume.effective_time_end),
						operation_geography: operationGeography};
				}
			);
			return correctedOperation;
		};

		return {
			fetchOperations: flow(function* fetchOperations() {
				try {
					const response = yield getRoot(self).axiosInstance.get('operation', {headers: {auth: getRoot(self).authStore.token}});
					const operations = response.data.ops;
					self.operations.merge(
						operations.reduce((prior, operation) => {
							const correctedOperation = cleanOperation(operation);
							const qtyOperationVolumes = correctedOperation.operation_volumes.length;
							if (correctedOperation
								.operation_volumes[qtyOperationVolumes-1]
								.effective_time_end >= new Date()
							) {
								// Only operations that are yet to happen or in progress are considered
								return [...prior, [correctedOperation.gufi, correctedOperation]];
							} else {
								return [...prior];
							}
						}, [])
					);
				} catch (error) {
					console.group('/rootStore fetchOperations *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			setFilterAccepted(flag) {
				self.filterShowAccepted = flag;
			},
			setFilterPending(flag) {
				self.filterShowPending = flag;
			},
			setFilterActivated(flag) {
				self.filterShowActivated = flag;
			},
			setFilterRogue(flag) {
				self.filterShowRogue = flag;
			},
			setFilterOthers(flag) {
				self.filterShowOthers = flag;
			},
			toggleVisibility(op) {
				if (_.includes(self.filterShownIds, op.gufi)) {
					self.filterShownIds.remove(op.gufi);
				} else {
					self.filterShownIds.push(op.gufi);
				}
			},
			setTextToMatchToDisplayInLayersList(text) {
				self.layersShowLabelsOnlyMatchingText = text;
			}
		};
	})
	.views(self => ({
		get shownOperations() {
			return _.filter(values(self.operations), (operation) => {
				if (self.filterShowAccepted && operation.state === 'ACCEPTED') {
					return true;
				} else if (self.filterShowPending && operation.state === 'PENDING') {
					return true;
				} else if (self.filterShowActivated && operation.state === 'ACTIVATED') {
					return true;
				} else if (self.filterShowRogue && operation.state === 'ROGUE') {
					return true;
				} else if (_.includes(self.filterShownIds, operation)) {
					return true;
				} else {
					return self.filterShowOthers;
				}
			});
		},
		get operationsWithVisibility() {
			return _.map(values(self.operations), (op) => {
				const opWithVisibility = _.cloneDeep(op);
				opWithVisibility._visibility = _.includes(self.filterShownIds, op.gufi);
				opWithVisibility._showInLayers = _.includes(
					op.name.toLowerCase(),
					self.layersShowLabelsOnlyMatchingText.toLowerCase()
				);
				return opWithVisibility;
			});
		}
	}));