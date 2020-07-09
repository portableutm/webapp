import S from 'sanctuary';

const quickFlyLocations = [
	{
		name: 'DronfiesLabs',
		cornerNW: [-56.27059936523438, -34.76615576940305],
		cornerSE: [-55.948905944824226, -34.95237014224681]
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
	const cornerNWswap = [qf.cornerNW[1], qf.cornerNW[0]];
	const cornerSEswap = [qf.cornerSE[1], qf.cornerSE[0]];
	const newQf = {...qf};
	newQf.cornerNW = cornerNWswap;
	newQf.cornerSE = cornerSEswap;
	return newQf;
};


/* Actions */
export const fetch = (store) => {
	addQuickFly(store, quickFlyLocations);
	/*
	Axios.get('quickfly', {headers: { auth: fM(store.state.auth.token) }})
		.then(result => addQuickFly(store, result.data))
		.catch(error => {
			addQuickFly(store, quickFlyLocations);
			print(store.state, true, 'QuickFlyState', error);
		});*/
};
export const post = (store, data, callback, ) => {
	const olds = S.values(store.state.quickFly.list);
	data.cornerNW = [data.cornerNW.lng, data.cornerNW.lat];
	data.cornerSE = [data.cornerSE.lng, data.cornerSE.lat];
	olds.push(data);
	addQuickFly(store, olds);
	callback && callback();
	/*Axios.add('quickfly', data, {headers: { auth: fM(store.state.auth.token) }})
		.then(result => {
			addQuickFly(result.data);
			callback && callback();
		})w
		.catch(error => {
			print(store.state, true, 'QuickFlyState', error);
			errorCallback && error.response && errorCallback(error.response.data);
		});*/
};