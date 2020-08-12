/* Libraries */
import {flow, types} from 'mobx-state-tree';
import { values } from 'mobx';
import A from 'axios';
import _ from 'lodash';

import {Operation} from './Operation';
import {API} from '../consts';

export const OperationStore = types
	.model('OperationStore', {
		operations: types.map(Operation),
		filterShowAccepted: false,
		filterShowPending: true,
		filterShowActivated: true,
		filterShowRogue: true,
		filterShowOthers: false
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
			afterCreate() {
				Axios = A.create({
					baseURL: CurrentAPI,
					timeout: 15000,
					headers: {
						'Content-Type': 'application/json',
					}
				});
				/*Axios.interceptors.response.use(function (response) {
					if (response.headers.token) {
						setToken(response.headers.token);
					}
					return response;
				}, function (error) {
					return Promise.reject(error);
				});*/
				//self.operations.observe((value) => console.log('OperationState', value));
				self.fetchOperations();
			},
			setToken(newToken) {
				token = newToken;
			},
			fetchOperations: flow(function* fetchOperations() {
				try {
					const response = yield Axios.get('operation', {headers: {auth: token}});
					const operations = response.data.ops;
					self.operations.merge(
						operations.reduce((prior, operation) => {
							const correctedOperation = cleanOperation(operation);
							return [...prior, [correctedOperation.gufi, correctedOperation]];
						}, [])
					);
				} catch (error) {
					console.error('AdesStore::Operations', error);
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
				} else {
					return self.filterShowOthers;
				}
			});
		}
	}));