import { types } from 'mobx-state-tree';
import { User } from './User';

export const BaseVehicle = types
	// Used as a base class for vehicles. Mostly for data entry and publishing to the server.
	.model('BaseVehicle', {
		nNumber: types.refinement(types.string, value => value.length < 10),
		faaNumber: types.string,
		vehicleName: types.string,
		manufacturer: types.string,
		model: types.string,
		'class': types.enumeration('VehicleType', ['MULTIROTOR', 'FIXEDWING']),
		owner: types.string,
		registeredBy: types.string
	})
	.actions(self => {
		return {
			setProperty(prop, value) {
				try {
					self[prop] = value;
					return true;
				} catch (error) {
					return false;
				}
			}
		};
	});

export const Vehicle = BaseVehicle
	.named('Vehicle')
	.props({
		uvin: types.identifier,
		date: types.Date,
		owner: User,
		registeredBy: User
	})
	.views(self => ({
		get asDisplayString() {
			return `${self.vehicleName}: ${self.manufacturer} ${self.model} (${self.faaNumber}) - ${self.owner.asDisplayString}`;
		}
	}));