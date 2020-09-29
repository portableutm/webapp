import { flow, getRoot, types } from 'mobx-state-tree';
import { User } from './entities/User';
import { values } from 'mobx';

export const UserStore = types
	.model('UserStore', {
		users: types.map(User)
	})
	.volatile(() => ({
		hasFetched: false
	}))
	.actions(self => {
		return {
			fetchUsers: flow(function* fetchUsers() {
				try {
					const response = yield getRoot(self).axiosInstance.get(
						'user',
						{ headers: { auth: getRoot(self).authStore.token } }
					);
					self.hasFetched = true;
					const users = response.data;
					self.users.replace(
						users.reduce((prior, user) => {
							return [...prior, [user.username, user]];
						}, [])
					);
				} catch (error) {
					console.group('/userStore fetchUsers *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			fetchOne: flow(function* fetchOne(username) {
				try {
					const response = yield getRoot(self).axiosInstance.get(
						`user/${username}`,
						{ headers: { auth: getRoot(self).authStore.token } }
					);
					self.users.set(response.data.username, response.data);
				} catch (error) {
					console.group('/userStore fetchOne *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			reset() {
				self.hasFetched = false;
			}
		};
	})
	.views(self => {
		return {
			get allUsers() {
				if (!self.hasFetched) self.fetchUsers();
				return values(self.users);
			},
			get hasLoggedInUserInformation() {
				// Retrieves whether the information about the current logged in user is in the list or not.
				// In case of a Pilot, naturally this should be the only user in the list.
				return self.users.has(getRoot(self).authStore.username);
			},
			get loggedInUserInformation() {
				if (self.hasLoggedInUserInformation) {
					return self.users.get(getRoot(self).authStore.username);
				} else {
					return null;
				}
			}
		};
	});
