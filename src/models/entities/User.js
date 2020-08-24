import { types } from 'mobx-state-tree';

export const User = types
	.model('User', {
		username: types.identifier,
		firstName: types.string,
		lastName: types.string,
		email: types.string,
		password: types.string,
		// TODO: We need it when creating a new User
		role: types.enumeration('UserRoles', ['admin', 'pilot']),
		// volumesOfInterest:
		// settings:
	});