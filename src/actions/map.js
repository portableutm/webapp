import {print} from '../state/AdesState';

export const setCorners = (store, cornerNW, cornerSE) => {
	//console.log('MapState: (BOUND) ', JSON.stringify(cornerNW), JSON.stringify(cornerSE));
	//print(store.state, false, 'MapState', cornerNW, cornerSE);
	store.setState({map: {...store.state.map, cornerNW, cornerSE}});
};

export const addId = (store, id) => {
	const newIds = store.state.map.ids.slice();
	newIds.push(id);
	store.setState({map: {...store.state.map, ids: newIds}});
};

export const removeId = (store, id) => {
	store.setState({map: {...store.state.map, ids: store.state.map.ids.filter(idsaved => idsaved !== id)}});
};

export const onClicksDisabled = (store, flag) => {
	print(store.state, false, 'MapState', flag);
	store.setState({map: {...store.state.map, onClicksDisabled: flag}});
};