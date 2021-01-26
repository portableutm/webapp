import { types } from 'mobx-state-tree';

export const BaseDinaciaCompany = types
	// Used as a base class for vehicles. Mostly for data entry and publishing to the server.
	.model('BaseDinaciaCompany', {
		razon_social : types.maybeNull(types.string),
		nombre_comercial : types.maybeNull(types.string),
		domicilio : types.maybeNull(types.string),
		telefono : types.maybeNull(types.string),
		RUT : types.maybeNull(types.string),
	});

export const DinaciaCompany = BaseDinaciaCompany
	.named('DinaciaCompany')
	.props({
		id: types.string
	});

export const BaseDinaciaUser = types
	// Used as a base class for vehicles. Mostly for data entry and publishing to the server.
	.model('BaseDinaciaUser', {
		address: types.maybeNull(types.string),
		document_type: types.maybeNull(types.string),
		document_number: types.maybeNull(types.string),
		phone: types.maybeNull(types.string),
		cellphone: types.maybeNull(types.string),
		nationality: types.maybeNull(types.string),
		permit_expire_date: types.maybeNull(types.Date),
		// remote_sensor_id: types.maybeNull(types.string),
		dinacia_company: types.maybeNull(BaseDinaciaCompany)
	})
	.volatile(() => ({
		document_file: null,
		permit_front_file: null,
		permit_back_file: null,
		// remote_sensor_file: null
	}));

const DinaciaUserInternal = BaseDinaciaUser
	.named('DinaciaUser')
	.props({
		document_file_path: types.maybe(types.string),
		permit_front_file_path: types.maybe(types.string),
		permit_back_file_path: types.maybe(types.string),
		// remote_sensor_file_path: types.maybe(types.string),
		dinacia_company: types.maybeNull(DinaciaCompany)
	});

export const DinaciaUser = types.snapshotProcessor(DinaciaUserInternal, {
	preProcessor(snapshot) {
		if (snapshot != null) {
			return {
				permit_expire_date: new Date(snapshot.permit_expire_date)
			};
		} else {
			return null;
		}
	}
});