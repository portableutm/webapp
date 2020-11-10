import { flow, getRoot, getSnapshot, types } from 'mobx-state-tree';
import { values } from 'mobx';
import { Vehicle } from './entities/Vehicle';
import _ from 'lodash';
import { ISDINACIA } from '../consts';

export const VehicleStore = types
	.model('VehicleStore',{
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
			return newVehicle;
		}
		return {
			fetch: flow(function* fetch() {
				try {
					const response = yield getRoot(self).axiosInstance.get('vehicle', { headers: { auth: getRoot(self).authStore.token } });
					self.hasFetched = true;
					const vehicles = response.data;
					self.vehicles.replace(
						vehicles.reduce((prior, vehicle) => {
							const processedVehicle = processVehicle(vehicle);
							return [...prior, [processedVehicle.uvin, processedVehicle]];
						}, [])
					);
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
					const data = new FormData();
					for (const key in vehicleSnapshot) {
						if (key !== 'dinacia_vehicle') {
							// noinspection JSUnfilteredForInLoop
							data.append(key, vehicleSnapshot[key]);
						} else if (ISDINACIA) {
							data.append('dinacia_vehicle_str', JSON.stringify(vehicleSnapshot.dinacia_vehicle));
							data.append('serial_number_file', vehicle.dinacia_vehicle.serial_number_file);
						}
					}
					const response = yield getRoot(self)
						.axiosInstance
						.post('vehicle', data,{ headers: { 'Content-Type': 'multipart/form-data', auth: getRoot(self).authStore.token } });
					yield self.fetch();
					getRoot(self).setFloatingText('Vehicle saved successfully! ');
					return response;
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
						vehicleWithVisibility.owner.asDisplayString = vehicle.owner.asDisplayString;
						vehicleWithVisibility.registeredBy.asDisplayString = vehicle.registeredBy.asDisplayString;
						vehicleWithVisibility.asShortDisplayString = vehicle.asShortDisplayString;
						return vehicleWithVisibility;})
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