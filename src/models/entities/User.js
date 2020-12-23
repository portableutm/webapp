import { types } from 'mobx-state-tree';
import { BaseDinaciaUser, DinaciaUser } from './DinaciaUser';

export const BaseUser = types
	.model('BaseUser', {
		username: types.string,
		firstName: types.string,
		lastName: types.string,
		email: types.string,
		password: types.maybe(types.string),
		// TODO: We need it when creating a new User
		role: types.enumeration('UserRoles', ['admin', 'pilot']),
		dinacia_user: types.maybeNull(BaseDinaciaUser)
		// volumesOfInterest:
		// settings:
	})
	.actions((self) => ({
		setProperty(prop, value) {
			try {
				self[prop] = value;
				return true;
			} catch (error) {
				console.dir(error);
				return false;
			}
		},
		setDinaciaProperty(prop, value) {
			try {
				self.dinacia_user[prop] = value;
				return true;
			} catch (error) {
				console.dir(error);
				return false;
			}
		},
		setDinaciaCompanyProperty(prop, value) {
			try {
				self.dinacia_user.dinacia_company[prop] = value;
				return true;
			} catch (error) {
				console.dir(error);
				return false;
			}
		}
	}))
	.views(self => {
		return {
			get asDisplayString() {
				return `${self.firstName} ${self.lastName} (${self.username})`;
			}
		};
	});

export const User = BaseUser
	.named('User')
	.props({
		username: types.identifier,
		dinacia_user: types.maybeNull(DinaciaUser)
	});