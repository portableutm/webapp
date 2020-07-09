import {fM} from '../libs/SaferSanctuary';
import {Axios, print} from '../state/AdesState';
import S from 'sanctuary';

/* Auxiliaries */
function addRFV(store, data) {
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((rfv) => {
		return S.Just(S.Pair(rfv.id)(convertCoordinatesRFV(rfv)));
	}));
	const rfvs = S.fromPairs(pairs);
	print(store.state, false, 'RFVState', rfvs);
	store.setState({rfv: {updated: Date.now(), list: rfvs}});
}

const convertCoordinatesRFV = (rfv) => {
	// Switch LngLat to LatLng
	const coordinates = rfv.geography.coordinates.map((coords) =>
		coords.map((pos) => [pos[1], pos[0]])
	);
	return {...rfv, geography: {...rfv.geography, coordinates}};
};

/* Actions */
export const fetch = (store) => {
	Axios.get('restrictedflightvolume', {headers: {auth: fM(store.state.auth.token)}})
		.then(result => addRFV(store, result.data))
		.catch(error => print(store.state, true, 'RFVState', error));
};