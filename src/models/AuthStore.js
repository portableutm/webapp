import {flow, getRoot, types} from 'mobx-state-tree';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

export const AuthStore = types
	.model('AuthStore', {
		token: types.maybeNull(types.string),
		role: types.optional(types.enumeration('AuthRoles', ['admin', 'pilot', 'NOTLOGGED']), 'NOTLOGGED'),
		username: types.maybeNull(types.string),
		expireDate: types.optional(types.Date, new Date(0))
	})
	.actions(self => {
		let socket;

		return {
			setToken(newToken) {
				try {
					self.token = newToken;
					/* Reconnect to socket.io as this new token is longer lasting */
					if (socket) socket.disconnect();
					socket = io(getRoot(self).API + '?token=' + newToken);
					const decoded = jwtDecode(newToken);
					/* Save users data parsed from token */
					self.role = decoded.role;
					self.username = decoded.username;
					self.expireDate.setUTCSeconds(decoded.exp);

					socket.on('new-position', function (info) {
						// const info2 = {...info};
						//console.log('DroneState: new-position: ', info2);
						//store.actions.drones.add(info2);
					});

					socket.on('operation-state-change', function (info) {
						//console.log('Operation-state-change', info);
						//store.actions.operations.updateOne(info.gufi, info.state);
					});
					socket.connect();
				} catch (error) {
					console.error('Error setting token', error);
				}
			},
			login: flow(function* login(username, password, callback, errorCallback) {
				try {
					const authInfo = JSON.stringify({
						username: username,
						password: password
					});
					const authResponse = yield getRoot(self).axiosInstance.post('auth/login', authInfo);
					self.setToken(authResponse.data);
					// Token's been set, load all data that should be loaded
					yield getRoot(self).fetchAll();
					if (callback) callback();
				} catch (error) {
					if (errorCallback && error.response) errorCallback(error.response.data);
				}
			})
		};
	})
	.views(self => ({
		get isLoggedIn() {
			return self.role !== 'NOTLOGGED';
		},
		get isAdmin() {
			return self.role === 'admin';
		},
		get isPilot() {
			return self.role === 'pilot';
		}
	}));