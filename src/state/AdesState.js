import React from 'react';
import globalHook from '../libs/useGlobalHook';
import S from 'sanctuary';
import A from 'axios';
import {API, DEBUG} from '../consts';
import {fM, } from '../libs/SaferSanctuary';
import * as importedActions from '../actions';
import io from 'socket.io-client';

let Axios;
let socket;

const initialState = {
	auth: {
		user: S.Nothing,
		username: '',
		token: S.Nothing
	},
	operations: {
		list: {},
		updated: 0
	},
	/*users: {
		list: S.Nothing,
		updated: 0, // We won't fetch it until we need it.
		error: false
	},*/
	vehicles: {
		list: {},
		updated: 0,
		error: false
	},
	drones: {
		list: {},
		updated: 0
	},
	map: {
		/* Uruguay
		cornerNW: { lat: -34.781788, lng: -56.225623},
		cornerSE: { lat: -34.927028, lng: -55.835540},
		*/
		isInitialized: false,
		clickSelection: {
			isSelecting: false,
			listIsComplete: false, // true when click reaches parent - topmost of bubbling
			listFns: [] // [{label: 'map', fn: () => {}}]
		},
		cornerNW: {lat: -90, lng: 180},
		cornerSE: {lat: 90, lng: -180},
		ids: [],
	},
	map_dialog: {
		open: false,
		title: '',
		text: '',
		rightButtonText: S.Nothing,
		rightButtonOnClick: S.Nothing
	},
	quickFly: {
		list: {},
		updated: 0
	},
	rfv: {
		list: {},
		updated: 0
	},
	uvr: {
		list: {},
		updated: 0
	},
	warning: S.Nothing,
	notifications: {
		list: {},
		updated: 0
	},
	debug: DEBUG,
	api: API
};

const initializer = (store) => {
	// Set default position for the map. If geolocation is allowed, it'll be the Operator current location.
	if (navigator.geolocation) {
		/// TODO: Force default even if geolocation is acquired (parameter)
		navigator.geolocation.getCurrentPosition((position) => {
			//store.actions.setPosition(position.coords.latitude, position.coords.longitude);
			const cornerNW = {lat: position.coords.latitude - 0.05, lng: position.coords.longitude + 0.05};
			const cornerSE = {lat: position.coords.latitude + 0.05, lng: position.coords.longitude - 0.05};
			store.actions.map.setCorners(cornerNW, cornerSE);
		});
	}
};

/* Actions */
const internalActions = {
	auth: {
		login: (store, username, password, callback, errorCallback) => {


		},
		info: (store, username, okCallback, errorCallback) => {
			Axios.get('user/' + username, {headers: {auth: fM(store.state.auth.token)}})
				.then(result => {
					print(store.state, false, 'InfoState', result.data);
					store.setState({auth: {...store.state.auth, user: S.Just(result.data)}});
					okCallback && okCallback(result.data);
				})
				.catch(error => {
					print(store.state, true, 'AuthState', error);
					store.setState(initialState);
					errorCallback && errorCallback();
				});
		},
		updateToken: (store, newToken) => {
			if (fM(store.state.auth.token) !== newToken) {
				print(store.state, false, 'Token', newToken);
				store.setState({auth: {...store.state.auth, token: S.Just(newToken)}});
			}
		},
		logout: (store) => {
			store.setState(initialState);
		}
	},
	debug: (store, toggle) => {
		store.setState({debug: toggle});
	},
	api: (store, newApi) => {
		store.setState({api: newApi});
		store.actions.auth.logout();
	}
};

const actions = {...importedActions, ...internalActions};


/* OPERATIONS */
/* Extract data from global state */

const extractOperationsFromState = (adesState) => {
	return S.values(adesState.operations.list);
};

/* Helper functions */

const filterOperationsByState = states => operations => {
	// Unwrap Operations, then filter operations that are not opState
	// //console.log('filterOperationsByState', operations);
	return S.filter((op) => states.includes(op.state))(operations);
};

const filterOperationsByIds = ids => operations => {
	//console.log('filterOperationsByIds', ids, operations);
	return S.filter((op) => ids.includes(op.gufi))(operations);
};

/* Debug console */
const print = (adesState, isError, origin, ...args) => {
	if (adesState.debug) {
		if (isError) {
			console.error('(' + origin + ')', ...args);
		} else {
			console.log('(' + origin + ')', ...args);
		}
	}
};

const useAdesState = globalHook(React, initialState, actions, initializer);

export {
	useAdesState as default,
	extractOperationsFromState,
	filterOperationsByState,
	filterOperationsByIds,
	print,
	Axios
};