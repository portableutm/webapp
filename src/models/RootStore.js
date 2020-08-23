import {applySnapshot, flow, getSnapshot, types} from 'mobx-state-tree';
import A from 'axios';

import {API, DEBUG} from '../consts';
import {OperationStore} from './OperationStore';
import {AuthStore} from './AuthStore';
import {UvrStore} from './UvrStore';
import {MapStore} from './MapStore';
import {RfvStore} from './RfvStore';

export const RootStore = types
	.model('RootStore', {
		authStore: types.optional(AuthStore, {}),
		operationStore: types.optional(OperationStore, {operations: {}}),
		uvrStore: types.optional(UvrStore, {uvrs: {}}),
		rfvStore: types.optional(RfvStore, {rfvs: {}}),
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
			}}),
		API: API,
		debugIsDebug: DEBUG
	})
	.volatile(() => ({
		axiosInstance: null
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
						self.authStore.setToken(response.headers.token);
					}
					return response;
				}, function (error) {
					return Promise.reject(error);
				});
				initialState = getSnapshot(self);
			},
			fetchAll: flow(function* fetchAll() {
				yield [
					self.operationStore.fetchOperations(),
					self.uvrStore.fetchUvrs(),
					self.rfvStore.fetchRfvs()
				];
			}),
			reset: () => {
				// Reset to initial state
				applySnapshot(self, initialState);
			},
			/* DEBUG FUNCTIONS */
			debugSetDebugging: (flag) => {
				self.debugIsDebug = flag;
			}
		};
	});