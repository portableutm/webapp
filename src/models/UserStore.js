import { flow, getRoot, getSnapshot, types } from 'mobx-state-tree';
import { User } from './entities/User';
import { values } from 'mobx';
import _ from 'lodash';
import { BaseDinaciaUser, DinaciaUser } from './entities/DinaciaUser';

export const UserStore = types
	.model('UserStore', {
		users: types.map(User),
		filterMatchingText: '', // Those that match this string are displayed in the layers list (search)
		filterProperty: 'username',
		sortingProperty: 'username',
		sortingOrder: 'asc'
	})
	.volatile(() => ({
		hasFetched: false,
		hasError: false
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
					console.dir(users);
					self.users.replace(
						users.reduce((prior, user) => {
							if (user.dinacia_user) {
								const dinaciaUserSnapshot = user.dinacia_user;
								const dinaciaUser = DinaciaUser.create({
									...dinaciaUserSnapshot,
									permit_expire_date: new Date(dinaciaUserSnapshot.permit_expire_date),
									permit_back_file_path: dinaciaUserSnapshot.permit_back_file_path,
									permit_front_file_path: dinaciaUserSnapshot.permit_front_file_path,
									document_file_path: dinaciaUserSnapshot.document_file_path
								});
								console.log(dinaciaUser);
							}
							return [...prior, [user.username, user]];
						}, [])
					);
				} catch (error) {
					self.hasError = true;
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
			reset() {
				self.hasFetched = false;
				self.hasError = false;
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
			},
			get usersWithVisibility() {
				return _
					.chain(values(self.users))
					.map((user) => {
						const userWithVisibility = _.cloneDeep(user);
						userWithVisibility._matchesFiltersByNames = _.includes(
							user[self.filterProperty].toLowerCase(),
							self.filterMatchingText.toLowerCase()
						);
						return userWithVisibility;})
					.orderBy(user => {
						return user[self.sortingProperty];
					}, self.sortingOrder)
					.value();
			},
			get counts() {
				const users = values(self.users);
				let userCount = 0;
				let matchesFilters = 0;
				_.forEach(users, (user) => {
					userCount++;
					if (_.includes(
						user[self.filterProperty].toLowerCase(),
						self.filterMatchingText.toLowerCase()
					)) matchesFilters++;
				});
				return { userCount, matchesFilters };
			}
		};
	});
