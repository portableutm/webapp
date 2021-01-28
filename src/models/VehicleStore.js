import { flow, getRoot, getSnapshot, types } from 'mobx-state-tree';
import { values } from 'mobx';
import { Vehicle } from './entities/Vehicle';
import _ from 'lodash';
import { ISDINACIA } from '../consts';

const validateFields = (vehicle , prueba) => {
	console.log(`Validate field: ${JSON.stringify(vehicle)}, ${JSON.stringify(prueba)}`);
	let errors = [];
	if (!vehicle.dinacia_vehicle.serial_number_file) {
		errors.push('Serial number image can not be empty.');
	}
	if (!vehicle.vehicleName) {
		errors.push('Vehicle name can not be empty.');
	}
	if (!vehicle.manufacturer) {
		errors.push('Manufacturer can not be empty.');
	}
	if (!vehicle.model) {
		errors.push('Model can not be empty.');
	}
	if(ISDINACIA){
		if (!vehicle.dinacia_vehicle.year && !Number.isNaN(Number.parseInt(vehicle.dinacia_vehicle.year))) {
			errors.push('Year must be a number.');
		}
	}
	return errors;
};

export const VehicleStore = types
	.model('VehicleStore', {
		vehicles: types.map(Vehicle),
		filterMatchingText: '', // Those that match this string are displayed in the layers list (search)
		filterProperty: 'nNumber',
		sortingProperty: 'nNumber',
		sortingOrder: 'asc'
	})
	.volatile(() => ({
		hasFetched: false,
		hasError: false
	}))
	.actions(self => {
		function processVehicle(vehicle) {
			const newVehicle = _.cloneDeep(vehicle);
			newVehicle.date = new Date(vehicle.date);
			newVehicle.operators = vehicle.operators.map(operator => operator.username);
			return newVehicle;
		}
		return {
			fetch: flow(function* fetch() {
				try {
					if (getRoot(self).authStore.isAdmin) {
						// Admins can see all vehicles of the system
						const response = yield getRoot(self).axiosInstance.get('vehicle', { headers: { auth: getRoot(self).authStore.token } });
						self.hasFetched = true;
						const vehicles = response.data;
						self.vehicles.replace(
							vehicles.reduce((prior, vehicle) => {
								const processedVehicle = processVehicle(vehicle);
								return [...prior, [processedVehicle.uvin, processedVehicle]];
							}, [])
						);
					} else {
						// Pilots can see the vehicles of which they are owners or operators
						const responseOperator = yield getRoot(self).axiosInstance.get('vehicle/operator', { headers: { auth: getRoot(self).authStore.token } });
						const responseOwner = yield getRoot(self).axiosInstance.get('vehicle', { headers: { auth: getRoot(self).authStore.token } });
						self.hasFetched = true;
						const vehiclesOperator = responseOperator.data;
						self.vehicles.replace(
							vehiclesOperator.reduce((prior, vehicle) => {
								const processedVehicle = processVehicle(vehicle);
								return [...prior, [processedVehicle.uvin, processedVehicle]];
							}, [])
						);
						const vehiclesOwner = responseOwner.data;
						self.vehicles.merge(
							vehiclesOwner.reduce((prior, vehicle) => {
								const processedVehicle = processVehicle(vehicle);
								return [...prior, [processedVehicle.uvin, processedVehicle]];
							}, [])
						);
					}

				} catch (error) {
					self.hasError = true;
					console.group('vehicleStore fetch *error*');
					console.log('%cAn error has ocurred', 'color:red; font-size: 36px');
					console.error(error);
					console.groupEnd();
				}
			}),
			post: flow(function* post(vehicle) {
				try {
					const vehicleSnapshot = getSnapshot(vehicle);
					
					const errors = validateFields(vehicle, vehicleSnapshot);
					if (errors.length > 0) {
						getRoot(self).setFloatingText(`Error while saving Vehicle: ${errors.join(', ')}`);
					} else {
						const data = new FormData();
						for (const key in vehicleSnapshot) {
							if (key !== 'dinacia_vehicle' && key !== 'operators') {
								// noinspection JSUnfilteredForInLoop
								data.append(key, vehicleSnapshot[key]);
							}
						}
						if (ISDINACIA) {
							data.append('dinacia_vehicle_str', JSON.stringify(vehicleSnapshot.dinacia_vehicle));
							data.append('operators_str', JSON.stringify(vehicle.operatorsBackend));
							data.append('serial_number_file', vehicle.dinacia_vehicle.serial_number_file, 'serial_number_file');
							data.append('remote_sensor_file', vehicle.dinacia_vehicle.remote_sensor_file, 'remote_sensor_file');
						}
						console.dir(data);

						const response = yield getRoot(self)
							.axiosInstance
							.post('vehicle', data, { headers: { 'Content-Type': 'multipart/form-data', auth: getRoot(self).authStore.token } });
						if (response.status === 200) {
							yield self.fetch();
							getRoot(self).setFloatingText('Vehicle saved successfully! ');
						} else if (response.status === 400) {
							getRoot(self).setFloatingText(`Error while saving Vehicle: ${response.data}`);
							
						}
						return response;
					}
				} catch (error) {
					getRoot(self).setFloatingText('Error while saving Vehicle: ' + error);
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
			get allVehicles() {
				return values(self.vehicles);
			},
			get vehiclesWithVisibility() {
				return _
					.chain(values(self.vehicles))
					.map((vehicle) => {
						const vehicleWithVisibility = _.cloneDeep(vehicle);
						vehicleWithVisibility._matchesFiltersByNames = _.includes(
							vehicle[self.filterProperty].toLowerCase(),
							self.filterMatchingText.toLowerCase()
						);
						vehicleWithVisibility.asDisplayString = vehicle.asDisplayString;
						if (vehicleWithVisibility.owner) vehicleWithVisibility.owner.asDisplayString = vehicle.owner.asDisplayString;
						if (vehicleWithVisibility.registeredBy) vehicleWithVisibility.registeredBy.asDisplayString = vehicle.registeredBy.asDisplayString;
						vehicleWithVisibility.asShortDisplayString = vehicle.asShortDisplayString;
						return vehicleWithVisibility;
					})
					.orderBy(vehicle => {
						return vehicle[self.sortingProperty];
					}, self.sortingOrder)
					.value();
			},
			get isEmpty() {
				return self.vehicles.size === 0;
			},
			get counts() {
				const vehicles = values(self.vehicles);
				let vehicleCount = 0;
				let matchesFilters = 0;
				_.forEach(vehicles, (vehicle) => {
					vehicleCount++;
					if (_.includes(
						vehicle[self.filterProperty].toLowerCase(),
						self.filterMatchingText.toLowerCase()
					)) matchesFilters++;
				});
				return { vehicleCount, matchesFilters };
			}
		};
	});