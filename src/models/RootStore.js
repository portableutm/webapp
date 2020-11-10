import { applySnapshot, flow, getSnapshot, types } from 'mobx-state-tree';
import A from 'axios';

import { API, DEBUG } from '../consts';
import { OperationStore } from './OperationStore';
import { AuthStore } from './AuthStore';
import { UvrStore } from './UvrStore';
import { MapStore } from './MapStore';
import { RfvStore } from './RfvStore';
import { UserStore } from './UserStore';
import { PositionStore } from './PositionStore';
import { QuickFlyStore } from './QuickFlyStore';
import { VehicleStore } from './VehicleStore';
import { NotificationStore } from './NotificationStore';

export const RootStore = types
	.model('RootStore', {
		authStore: types.optional(AuthStore, {}),
		operationStore: types.optional(OperationStore, { operations: {}, oldOperations: {}, filterShownIds: [] }),
		uvrStore: types.optional(UvrStore, { uvrs: {} }),
		rfvStore: types.optional(RfvStore, { rfvs: {} }),
		mapStore: types.optional(MapStore, {
			cornerNW: {
				'type': 'Point',
				'coordinates': [
					-34.72355492704219,
					-56.3873291015625
				]
			},
			cornerSE: {
				'type': 'Point',
				'coordinates': [
					-34.95461870738241,
					-55.96916198730469
				]
			} }),
		userStore: types.optional(UserStore, { users: {} }),
		positionStore: types.optional(PositionStore, { positions: {} }),
		quickFlyStore: types.optional(QuickFlyStore, { quickflies: {} }),
		vehicleStore: types.optional(VehicleStore, { vehicles: {} }),
		notificationStore: types.optional(NotificationStore, { notifications: {} }),
		API: API,
		debugIsDebug: DEBUG
	})
	.volatile(() => ({
		axiosInstance: null,
		floatingText: null // Floating text normally used for warnings throught the App
	}))
	.actions(self => {
		let initialState = {};
		return {
			afterCreate() {
				self.axiosInstance = A.create({
					baseURL: API,
					timeout: 15000,
					headers: {
						'Content-Type': 'application/json',
					}
				});
				self.axiosInstance.interceptors.response.use(function (response) {
					if (response.headers.token) {
						self.authStore.setTokenLimited(response.headers.token);
					}
					return response;
				}, function (error) {
					return Promise.reject(error);
				});
				initialState = getSnapshot(self);
			},
			fetchAll: flow(function* fetchAll() {
				if (self.authStore.role === 'admin') {
					yield [
						self.quickFlyStore.fetch(),
						self.operationStore.fetch(),
						self.uvrStore.fetchUvrs(),
						self.rfvStore.fetchRfvs(),
						self.vehicleStore.fetch()
					];
				} else {
					yield [
						self.quickFlyStore.fetch(),
						self.operationStore.fetch(false),
						self.uvrStore.fetchUvrs(),
						self.userStore.fetchOne(self.authStore.username),
						self.rfvStore.fetchRfvs(),
						self.vehicleStore.fetch()
					];
				}
			}),
			reset: () => {
				// Reset to initial state
				console.group('Resetting to');
				console.dir(initialState);
				console.groupEnd();
				// Reset all volatiles states of each store
				self.authStore.reset();
				self.operationStore.reset();
				self.uvrStore.reset();
				self.rfvStore.reset();
				self.mapStore.reset();
				self.userStore.reset();
				self.positionStore.reset();
				self.quickFlyStore.reset();
				self.vehicleStore.reset();
				applySnapshot(self, initialState);
			},
			/* Instance */
			setAPI(newApi) {
				// TODO: change socket API url too...
				self.API = newApi;
				self.axiosInstance = A.create({
					baseURL: newApi,
					timeout: 15000,
					headers: {
						'Content-Type': 'application/json',
					}
				});
				self.axiosInstance.interceptors.response.use(function (response) {
					if (response.headers.token) {
						self.authStore.setTokenLimited(response.headers.token);
					}
					return response;
				}, function (error) {
					return Promise.reject(error);
				});
			},
			/* Floating Text */
			setFloatingText(text) {
				self.floatingText = text;
			},
			hideFloatingText() {
				self.floatingText = null;
			},
			/* DEBUG FUNCTIONS */
			debugSetDebugging: (flag) => {
				self.debugIsDebug = flag;
			}
		};
	})
	.views(self => {
		return {
			get isFloatingTextEnabled() {
				return self.floatingText !== null;
			}
		};
	});