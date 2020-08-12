import {flow, types} from 'mobx-state-tree';
import {OperationStore} from './OperationStore';
import {API} from '../consts';
import A from 'axios';
import {Axios, print} from '../state/AdesState';
import S from 'sanctuary';
import io from 'socket.io-client';
import {fM} from '../libs/SaferSanctuary';

export const RootStore = types
	.model('RootStore', {
		operationStore: OperationStore,
		API: API,
		authToken: types.string,
		authUsername: types.maybeNull(types.string),
		authExpireDate: types.optional(types.Date, new Date(0))
	})
	.actions(self => {
		let Axios;
		let socket;

		return {
			afterCreate() {
				Axios = A.create({
					baseURL: self.API,
					timeout: 15000,
					headers: {
						'Content-Type': 'application/json',
					}
				});
				Axios.interceptors.response.use(function (response) {
					if (response.headers.token) {
						self.setToken(response.headers.token);
					}
					return response;
				}, function (error) {
					return Promise.reject(error);
				});
			},
			setToken(newToken) {
				self.token = newToken;
				socket = io(self.API + '?token=' + newToken);
				const decoded = S.isJust(state.auth.token) ? jwtDecode(fM(state.auth.token)) : {exp: 0};
				self.authExpireDate.setUTCSeconds(decoded.exp);

				socket.on('new-position', function (info) {
					const info2 = {...info};
					//console.log('DroneState: new-position: ', info2);
					//store.actions.drones.add(info2);
				});

				socket.on('operation-state-change', function (info) {
					//console.log('Operation-state-change', info);
					//store.actions.operations.updateOne(info.gufi, info.state);
				});
				socket.connect();
			},
			login: flow(function* login(username, password, callback, errorCallback) {
				try {
					const authInfo = JSON.stringify({
						username: username,
						password: password
					});
					const authResponse = yield Axios.post('auth/login', authInfo);
					self.setToken(authResponse.data);
					if (callback) callback();
				} catch (error) {
					if (errorCallback && error.response) errorCallback(error.response.data);
				}
			})
		};
	});