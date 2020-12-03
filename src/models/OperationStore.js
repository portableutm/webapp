/* Libraries */
import { flow, getRoot, types } from 'mobx-state-tree';
import { values } from 'mobx';
import _ from 'lodash';

import { Operation } from './entities/Operation';
import i18n from 'i18next';

export const OperationStore = types
	.model('OperationStore', {
		operations: types.map(Operation),
		oldOperations: types.map(Operation),
		filterShowAccepted: true,
		filterShowPending: true,
		filterShowActivated: true,
		filterShowRogue: true,
		filterShowClosed: false,
		filterShownIds: types.array(types.string),
		filterMatchingText: '',
		filterProperty: 'name',
		sortingProperty: 'name',
		sortingOrder: 'asc'
	})
	.volatile(() => ({
		hasFetched: false,
		isInHistoricalMode: false
	}))
	.actions(self => {
		const cleanOperation = (operation) => {
			const correctedOperation = _.cloneDeep(operation);
			correctedOperation.submit_time = new Date(operation.submit_time);
			correctedOperation.update_time = new Date(operation.update_time);
			correctedOperation.creator = operation.creator.username;
			correctedOperation.uas_registrations = operation.uas_registrations.map(uasr => {
				const newUasr = _.cloneDeep(uasr);
				newUasr.date = new Date(uasr.date);
				newUasr.operators = uasr.operators.map(user => user.username);
				return newUasr;
			});
			correctedOperation.operation_volumes = operation.operation_volumes.map(
				(volume) => {
					const coordinates = volume.operation_geography.coordinates[0].map((pos) => [pos[1], pos[0]]);
					const operationGeography = { ...volume.operation_geography, coordinates: [coordinates] };
					return { ...volume,
						min_altitude: parseInt(volume.min_altitude),
						max_altitude: parseInt(volume.max_altitude),
						effective_time_begin: new Date(volume.effective_time_begin),
						effective_time_end: new Date(volume.effective_time_end),
						operation_geography: operationGeography };
				}
			);
			return correctedOperation;
		};

		return {
			/* Requests */
			fetch: flow(function* fetch(allOperations = true /* fetch only the operations to which the current logged in user is the owner*/) {
				const response = yield getRoot(self).axiosInstance.get(allOperations ? 'operation' : 'operation/owner', { headers: { auth: getRoot(self).authStore.token } });
				self.hasFetched = true;
				const operations = response.data.ops;
				operations.forEach((dirtyOp) => {
					try {
						const correctedOperation = cleanOperation(dirtyOp);
						const qtyOperationVolumes = correctedOperation.operation_volumes.length;
						if (correctedOperation
							.operation_volumes[qtyOperationVolumes-1]
							.effective_time_end >= new Date()
						) {
							// Only operations that are yet to happen or in progress are considered
							self.operations.set(correctedOperation.gufi, correctedOperation);
						} else {
							self.oldOperations.set(correctedOperation.gufi, correctedOperation);
						}
					} catch (error) {
						console.group('/rootStore fetchOperations *error*');
						console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
						console.error(error);
						console.error(dirtyOp);
						console.groupEnd();
					}
				});
			}),
			fetchOne: flow(function* fetchOne(gufi) {
				try {
					const response = yield getRoot(self).axiosInstance.get(`operation/${gufi}`, { headers: { auth: getRoot(self).authStore.token } });
					const operation = response.data;
					const correctedOperation = cleanOperation(operation);
					const qtyOperationVolumes = correctedOperation.operation_volumes.length;
					if (correctedOperation
						.operation_volumes[qtyOperationVolumes-1]
						.effective_time_end >= new Date()
					) {
						// Only operations that are yet to happen or in progress are considered
						self.operations.set(correctedOperation.gufi, correctedOperation);
					}
				} catch (error) {
					console.group('operationStore fetchOne *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			post: flow(function* post(newOperation /* : <BaseOperation> */) {
				try {
					//const operationSnapshot = getSnapshot(newOperation);
					const response =
						yield getRoot(self).axiosInstance.post('operation', newOperation, { headers: { auth: getRoot(self).authStore.token } });
					yield self.fetch(getRoot(self).authStore.role === 'admin');
					getRoot(self).setFloatingText('Operation saved successfully');
					return response;
				} catch (error) {
					let errorString = error;
					if (error.response && error.response.data && error.response.data.message) errorString = error.response.data.message;
					getRoot(self).setFloatingText(`An error (${errorString}) has ocurred while saving the operation.`);
				}
			}),
			updatePending: flow(function* updatePending(gufi, comments, isApproved) {
				try {
					const data = { comments: comments, approved: isApproved };
					const response = yield getRoot(self).axiosInstance.post(
						`operation/${gufi}/pendingtoaccept`
						, data,
						{ headers: { auth: getRoot(self).authStore.token } });
					getRoot(self).setFloatingText(`The operation has been ${isApproved ? 'approved' : 'rejected'} successfully`);
					return response;
				} catch (error) {
					getRoot(self).setFloatingText('Error while updating Operation: ' + error);
				}
			}),
			updateState: flow(function* updateState(gufi, newState) {
				try {
					const data = { id: gufi, state: newState };
					const response = yield getRoot(self).axiosInstance.post(
						`operation/${gufi}/updatestate`
						, data,
						{ headers: { auth: getRoot(self).authStore.token } });
					getRoot(self).setFloatingText(`The state of operation ${gufi} has been updated successfully`);
					return response;
				} catch (error) {
					getRoot(self).setFloatingText('Error while updating operation state: ' + error);
				}
			}),
			/* Update internal state */
			updateOne(gufi, property, value) {
				const current = self.operations.get(gufi);
				if (current) {
					current[property] = value;
					if (property === 'state') {
						if (value === 'ROGUE') {
							// Send ROGUE notification
							getRoot(self).notificationStore.addOperationGoneRogue(gufi);
						} else {
							getRoot(self).notificationStore.addInformation({
								header: i18n.t('operation_state_changed'),
								body: i18n.t('operation_state_changed_text', { name: current.name, state: value })
							});
						}
					}
					self.operations.set(gufi, current);
				}
			},
			/* Filtering operations by state or text */
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
			setFilterClosed(flag) {
				self.filterShowClosed = flag;
			},
			setFilterByText(text) {
				self.filterMatchingText = text;
			},
			setFilterProperty(property) {
				self.filterProperty = property;
			},
			/* Sorting */
			setSortingProperty(prop) {
				self.sortingProperty = prop;
			},
			setSortingOrder(order) {
				self.sortingOrder = order;
			},
			/* Operations on One Operation */
			toggleVisibility(op) {
				if (_.includes(self.filterShownIds, op.gufi)) {
					self.filterShownIds.remove(op.gufi);
				} else {
					self.filterShownIds.push(op.gufi);
				}
			},
			/* Historical mode */
			toggleHistoricalMode() {
				self.isInHistoricalMode = !self.isInHistoricalMode;
			},
			reset() {
				// Cleans volatile state. The model itself is resetted by the RootStore
				self.hasFetched = false;
				self.isInHistoricalMode = false;
			}
		};
	})
	.views(self => ({
		get allOperations() {
			return values(self.operations).concat(values(self.oldOperations));
		},
		get allCurrentOperations() {
			return values(self.operations);
		},
		get shownOperations() {
			return _.filter(self.isInHistoricalMode ? self.allOperations : self.allCurrentOperations, (operation) => {
				if (self.filterShowAccepted && operation.state === 'ACCEPTED') {
					return true;
				} else if (self.filterShowPending && operation.state === 'PENDING') {
					return true;
				} else if (self.filterShowActivated && operation.state === 'ACTIVATED') {
					return true;
				} else if (self.filterShowRogue && operation.state === 'ROGUE') {
					return true;
				} else if (self.filterShowClosed && operation.state === 'CLOSED') {
					return true;
				} else if (_.includes(self.filterShownIds, operation.gufi)) {
					return true;
				}
			});
		},
		get operationsWithVisibility() {
			return _
				.chain(self.isInHistoricalMode ? self.allOperations : self.allCurrentOperations)
				.map((op) => {
					const opWithVisibility = _.cloneDeep(op);
					opWithVisibility.uas_registrations = op.uas_registrations.map(uasr => uasr.asDisplayString);
					opWithVisibility.owner.asDisplayString = op.owner.asDisplayString;
					opWithVisibility._matchesFiltersByStates =
						(self.filterShowAccepted && op.state === 'ACCEPTED') 	||
						(self.filterShowPending && op.state === 'PENDING') 		||
						(self.filterShowActivated && op.state === 'ACTIVATED') 	||
						(self.filterShowClosed && op.state === 'CLOSED') 	||
						(self.filterShowRogue && op.state === 'ROGUE');
					opWithVisibility._visibility = _.includes(self.filterShownIds, op.gufi);
					const matchingProperty = self.filterProperty !== 'owner' ? op[self.filterProperty].toLowerCase() : op.owner.asDisplayString.toLowerCase();
					opWithVisibility._matchesFiltersByNames = _.includes(
						matchingProperty,
						self.filterMatchingText.toLowerCase()
					);
					return opWithVisibility;})
				.orderBy(op => {
					if (self.sortingProperty === 'start') return op.operation_volumes[0].effective_time_begin.getTime();
					if (self.sortingProperty === 'end') return op.operation_volumes[op.operation_volumes.length-1].effective_time_end.getTime();
					if (self.sortingProperty === 'owner_name') return op.owner.firstName;
					if (self.sortingProperty === 'owner_lastname') return op.owner.lastName;
					if (self.sortingProperty === 'owner_username') return op.owner.username;
					return op[self.sortingProperty];
				}, self.sortingOrder)
				.value();
		},
		get counts() {
			const operations = self.isInHistoricalMode ? self.allOperations : self.allCurrentOperations;
			let operationCount = 0;
			let activeCount = 0;
			let acceptedCount = 0;
			let pendingCount = 0;
			let rogueCount = 0;
			let matchingTextAndStateCount = 0;
			_.forEach(operations, (operation) => {
				operationCount++;
				if (operation.state === 'ROGUE') rogueCount++;
				if (operation.state === 'ACTIVATED') activeCount++;
				if (operation.state === 'ACCEPTED') acceptedCount++;
				if (operation.state === 'PENDING') pendingCount++;
				const matchingProperty = self.filterProperty !== 'owner' ? operation[self.filterProperty].toLowerCase() : operation.owner.asDisplayString.toLowerCase();
				if (_.includes(
					matchingProperty,
					self.filterMatchingText.toLowerCase()
				) && ((self.filterShowAccepted && operation.state === 'ACCEPTED') ||
					(self.filterShowPending && operation.state === 'PENDING') ||
					(self.filterShowClosed && operation.state === 'CLOSED') ||
					(self.filterShowActivated && operation.state === 'ACTIVATED') ||
					(self.filterShowRogue && operation.state === 'ROGUE'))) matchingTextAndStateCount++;
			});
			return { operationCount, activeCount, acceptedCount, pendingCount, rogueCount, matchingTextAndStateCount };
		}
	}));