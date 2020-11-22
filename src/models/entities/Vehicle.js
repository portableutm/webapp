import { types } from 'mobx-state-tree';
import { User } from './User';
import { BaseDinaciaVehicle, DinaciaVehicle } from './DinaciaVehicle';

export const BaseVehicle = types
	// Used as a base class for vehicles. Mostly for data entry and publishing to the server.
	.model('BaseVehicle', {
		nNumber: types.refinement(types.string, value => value.length < 10),
		faaNumber: types.string,
		vehicleName: types.string,
		manufacturer: types.string,
		model: types.string,
		'class': types.string,
		owner_id: types.maybe(types.string),
		operators: types.array(types.string),
		//registeredBy: types.string,
		dinacia_vehicle: types.maybeNull(BaseDinaciaVehicle) // If the instance is NOT DINACIA, this MUST BE null
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
			},
			setDinaciaProperty(prop, value) {
				try {
					if (prop === 'serial_number_file') {
						if (!(value instanceof File) || value.type.substring(0,5) !== 'image') {
							return false;
						}
					}
					self.dinacia_vehicle[prop] = value;
					return true;
				} catch (error) {
					return false;
				}
			},
			addOperator(username) {
				try {
					self.operators.push(username);
				} catch (error) {
					return false;
				}
			}
		};
	})
	.views(self => ({
		get operatorsBackend() {
			return self.operators.map(operatorString => ({ username : operatorString }));
		}
	}));

export const Vehicle = BaseVehicle
	.named('Vehicle')
	.props({
		uvin: types.identifier,
		date: types.Date,
		owner: User,
		registeredBy: User,
		dinacia_vehicle: types.maybeNull(DinaciaVehicle) // If the instance is NOT DINACIA, this MUST BE null
	})
	.views(self => ({
		get asShortDisplayString() {
			if (self.dinacia_vehicle === null) {
				return `${self.vehicleName} (${self.faaNumber})`;
			} else {
				return `${self.vehicleName} (${self.dinacia_vehicle.caa_registration})`;
			}
		},
		get asDisplayString() {
			if (self.dinacia_vehicle === null) {
				return `${self.vehicleName}: ${self.manufacturer} ${self.model} (${self.faaNumber}) - ${self.owner.asDisplayString}`;
			} else {
				return `${self.vehicleName}: ${self.manufacturer} ${self.model} (${self.dinacia_vehicle.caa_registration}) - ${self.owner.asDisplayString}`;
			}
		}
	}));