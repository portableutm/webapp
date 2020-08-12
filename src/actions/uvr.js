import S from 'sanctuary';
import {Axios, print} from '../state/AdesState';
import {fM} from '../libs/SaferSanctuary';

function addUVR(store, data) {
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((uvr) => {
		return S.Just(S.Pair(uvr.message_id)(convertCoordinatesUVR(uvr)));
	}));
	const uvrs = S.fromPairs(pairs);
	print(store.state, false, 'UVRState', uvrs);
	//store.setState({uvr: {updated: Date.now(), list: uvrs}});
}

const convertCoordinatesUVR = (uvr) => {
	// Switch LngLat to LatLng
	const coordinates = uvr.geography.coordinates.map((coords) =>
		coords.map((pos) => [pos[1], pos[0]])
	);
	coordinates[0].push(coordinates[0][0]); // Last coordinate should be the same than the first
	return {...uvr, geography: {...uvr.geography, coordinates}};
};

export const fetch = (store) => {
	Axios.get('uasvolume', {headers: {auth: fM(store.state.auth.token)}})
		.then(result => addUVR(store, result.data))
		.catch(error => print(store.state, true, 'UVRState', error));
};

export const post = (store, uvr, callback, errorCallback) => {
	const uvrCorrected = convertCoordinatesUVR(uvr);
	Axios.post('uasvolume', uvrCorrected, {headers: {auth: fM(store.state.auth.token)}})
		.then(() => {
			//addOperations(store, result.data);
			// TODO: Don't ask the server for the operations...
			fetch(store);
			callback && callback();
		})
		.catch(error => {
			console.error('ErrorWTF', error);
			if (error) {
				print(store.state, true, 'UVRState', error);
				store.actions.warning.setWarning(error.response.data.detail);
				errorCallback && error.response && errorCallback(error.response.data);
			}
		});
};