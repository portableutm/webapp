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
			reset() {

			}
		};
	})
	.views(self => {
		return {
			get allUsers() {
				if (!self.hasFetched) self.fetchUsers();
				return values(self.users);
			}
		};
	});
