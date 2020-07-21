import {fM} from '../libs/SaferSanctuary';
import S from 'sanctuary';
import {Axios, print} from '../state/AdesState';

/* Constants */
const VEHICLES_DATA_TOO_OLD = 2 * 60000;

/* Auxiliary functions */
function addVehicles(store, data) {
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((vehicle) => {
		return S.Just(S.Pair(vehicle.uvin)(vehicle));
	}));
	const vehicles = S.fromPairs(pairs);
	store.setState({vehicles: {updated: Date.now(), list: vehicles}});
}

function addVehicle(store, data) {
	store.setState({
		vehicles: {
			updated: Date.now(),
			list: S.insert
			(data.uvin)
			(data)
			(store.state.vehicles.list)
		}
	});
}

/* Actions */
export const fetch = (store) => {
	Axios.get('vehicle', {headers: {auth: fM(store.state.auth.token)}})
		.then(result => addVehicles(store, result.data))
		.catch(error => {
			print(store.state, true, 'VehicleState', error);
			store.setState({vehicles: {updated: 0, error: true, list: S.Nothing}});
		});
};

export const fetchIfOld = (store) => {
	if (Date.now() - store.state.vehicles.updated > VEHICLES_DATA_TOO_OLD) {
		store.actions.vehicles.fetch(store);
	}
};

export const post = (store, vehicle, callback, errorCallback) => {
	Axios.post('vehicle', vehicle, {headers: {auth: fM(store.state.auth.token)}})
		.then(result => {
			addVehicle(store, result.data);
			callback && callback();
		})
		.catch(error => {
			print(store.state, true, 'VehicleState', error);
			errorCallback && error.response && errorCallback(error.response.data);
		});
};

export const debugSetError = (store) => {
	print(store.state, true, 'VehicleState', 'manual');
	store.setState({vehicles: {updated: Date.now(), error: true, list: S.Nothing}});
};