import { types } from 'mobx-state-tree';

export const BaseDinaciaVehicle = types
	// Used as a base class for vehicles. Mostly for data entry and publishing to the server.
	.model('BaseDinaciaVehicle', {
		caa_registration: types.maybeNull(types.string),
		usage: types.maybeNull(types.string),
		construction_material: types.maybeNull(types.string),
		year: types.maybeNull(types.string),
		serial_number: types.maybeNull(types.string),
		empty_weight: types.maybeNull(types.number),
		max_weight: types.maybeNull(types.number),
		takeoff_method: types.maybeNull(types.string),
		sensor_type_and_mark: types.maybeNull(types.string),
		packing: types.maybeNull(types.string),
		longitude: types.maybeNull(types.number),
		height: types.maybeNull(types.number),
		color: types.maybeNull(types.string),
		max_speed: types.maybeNull(types.number),
		cruise_speed: types.maybeNull(types.number),
		landing_speed: types.maybeNull(types.number),
		time_autonomy: types.maybeNull(types.string),
		radio_accion: types.maybeNull(types.string),
		ceiling: types.maybeNull(types.string),
		communication_control_system_command_navigation_vigilance: types.maybeNull(types.string),
		maintenance_inspections: types.maybeNull(types.string),
		remarks: types.maybeNull(types.string),
		engine_manufacturer: types.maybeNull(types.string),
		engine_type: types.maybeNull(types.string),
		engine_model: types.maybeNull(types.string),
		engine_power: types.maybeNull(types.string),
		engine_fuel: types.maybeNull(types.string),
		engine_quantity_batteries: types.maybeNull(types.string),
		propeller_type: types.maybeNull(types.string),
		propeller_model: types.maybeNull(types.string),
		propeller_material: types.maybeNull(types.string),
		remote_sensor_id: types.maybeNull(types.string),

	})
	.volatile(() => ({
		serial_number_file: null,
		remote_sensor_file: null
	}))
;

export const DinaciaVehicle = BaseDinaciaVehicle
	.named('DinaciaVehicle')
	.props({
		id: types.string,
		authorized: types.boolean,
		serial_number_file_path: types.maybeNull(types.string),
		remote_sensor_file_path: types.maybeNull(types.string),
	})
;