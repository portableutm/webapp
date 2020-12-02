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
		dinacia_company: types.maybeNull(BaseDinaciaCompany)
	})
	.volatile(() => ({
		document_file: null,
		permit_front_file: null,
		permit_back_file: null
	}));

export const DinaciaUser = BaseDinaciaUser
	.named('DinaciaUser')
	.props({
		id: types.string,
		document_file_path: types.maybe(types.string),
		permit_front_file_path: types.maybe(types.string),
		permit_back_file_path: types.maybe(types.string),
		dinacia_company: types.maybeNull(DinaciaCompany)
	});