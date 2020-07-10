import S from 'sanctuary';
import {Axios, print} from '../state/AdesState';
import {fM} from '../libs/SaferSanctuary';


const quickFlyLocations = [
	{
		name: 'DronfiesLabs',
		cornerNW: {
			type: 'Point',
			coordinates: [-56.27059936523438, -34.76615576940305]
		},
		cornerSE: {
			type: 'Point',
			coordinates: [-55.948905944824226, -34.95237014224681]
		}
	}
];

/* Auxiliaries */
function addQuickFly(store, data) {
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((qf) => {
		return S.Just(S.Pair(qf.name)(convertCoordinatesQF(qf)));
	}));
	const qfs = S.fromPairs(pairs);
	store.setState({quickFly: {updated: Date.now(), list: qfs}});
}

const convertCoordinatesQF = (qf) => {
	const cornerNWswap = [qf.cornerNW.coordinates[1], qf.cornerNW.coordinates[0]];
	const cornerSEswap = [qf.cornerSE.coordinates[1], qf.cornerSE.coordinates[0]];
	const newQf = {...qf};
	newQf.cornerNW = cornerNWswap;
	newQf.cornerSE = cornerSEswap;
	return newQf;
};


/* Actions */
export const fetch = (store) => {
	//addQuickFly(store, quickFlyLocations);
	Axios.get('quickfly', {headers: { auth: fM(store.state.auth.token) }})
		.then(result => {
			if (Array.from(result.data).length > 0) {
				addQuickFly(store, result.data);
			} else {
				addQuickFly(store, quickFlyLocations);
			}
		})
		.catch(error => {
			addQuickFly(store, quickFlyLocations);
			print(store.state, true, 'QuickFlyState', error);
		});
};
export const post = (store, data, callback, errorCallback) => {
	console.log('POSTQF', data);
	data.cornerNW = {
		type: 'Point',
		coordinates: []
	};
	data.cornerSE = {
		type: 'Point',
		coordinates: []
	};
	console.log('cornernw', data.cornerNW);
	data.cornerNW.coordinates = [store.state.map.cornerNW.lng, store.state.map.cornerNW.lat];
	data.cornerSE.coordinates = [store.state.map.cornerSE.lng, store.state.map.cornerSE.lat];
	//addQuickFly(store, olds);
	//callback && callback();
	Axios.post('quickfly', data, {headers: { auth: fM(store.state.auth.token) }})
		.then(result => {
			//addQuickFly(result.data);
			store.actions.quickFly.fetch();
			callback && callback();
		})
		.catch(error => {
			print(store.state, true, 'QuickFlyState', error);
			errorCallback && error.response && errorCallback(error.response.data);
		});
};