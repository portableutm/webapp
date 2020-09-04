import { flow, getRoot, types } from 'mobx-state-tree';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

export const AuthStore = types
	.model('AuthStore', {
		token: types.maybeNull(types.string),
		role: types.optional(types.enumeration('AuthRoles', ['admin', 'pilot', 'NOTLOGGED']), 'NOTLOGGED'),
		username: types.maybeNull(types.string),
		email: types.maybeNull(types.string),
		expireDate: types.optional(types.Date, new Date(0))
	})
	.actions(self => {
		let socket = null;
		let tokenLimitedTimeout = null;
		let tokenLogoutTimeout = null;

		return {
			setTokenLimited(newToken) {
				/* 	This action sets the token after a small delay has happened, 
					to avoid changing the token too frequently 
				*/
				if (tokenLimitedTimeout !== null) {
					clearTimeout(tokenLimitedTimeout);
					tokenLimitedTimeout = null;
				}
				tokenLimitedTimeout = setTimeout(() => self.setToken(newToken), 5000);
			},
			setToken(newToken) {
				try {
					if (tokenLogoutTimeout !== null) {
						clearTimeout(tokenLogoutTimeout);
						tokenLogoutTimeout = null;
					}
					self.token = newToken;
					/* Reconnect to socket.io as this new token is longer lasting */
					//if (socket) socket.disconnect();
					if (socket !== null) socket.disconnect();

					socket = io(
						getRoot(self).API + '?token=' + newToken
					);

					socket.on('new-position', function (info) {
						getRoot(self).positionStore.addPosition(info);
					});

					socket.on('new-operation', function (info) {
						getRoot(self).operationStore.fetchOne(info.gufi);
					});

					socket.on('operation-state-change', function (info) {
						getRoot(self).operationStore.updateOne(info.gufi, 'state', info.state);
					});

					socket.connect();

					const decoded = jwtDecode(newToken);
					/* Save users data parsed from token */
					self.role = decoded.role;
					self.username = decoded.username;
					self.email = decoded.email;
					self.expireDate = new Date((decoded.exp - 3500) * 1000);
					tokenLogoutTimeout = setTimeout(() => getRoot(self).reset(), self.expireDate - Date.now());
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
			}),
			reset() {
				// Cleans volatile state. The model itself is resetted by the RootStore
				socket = null;
				if (tokenLimitedTimeout !== null) {
					clearTimeout(tokenLimitedTimeout);
					tokenLimitedTimeout = null;
				}
			}
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