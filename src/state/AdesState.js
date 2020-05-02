import React from 'react';
import globalHook from '../libs/useGlobalHook';
import A from 'axios';
import S from 'sanctuary';

import { API } from '../consts';
import {Mutex} from 'async-mutex';
import {fM, maybeValues} from '../libs/SaferSanctuary';
import io from 'socket.io-client';

/**
 * Global state of Ades
 * @type {{operations: {list: Maybe, updated: number}, auth: {user: Maybe, username: string, token: Maybe}}}
 */

const Axios = A.create({
	baseURL: API,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	}
});

const initialState = {
	auth: {
		user: S.Nothing,
		username: '',
		token: S.Nothing
	},
	operations: {
		list: S.Nothing,
		updated: Date.now()
	},
	users: {
		list: S.Nothing,
		updated: 0 // We won't fetch it until we need it.
	},
	drones: {
		list: S.Nothing,
		updated: Date.now()
	},
	map: {
		cornerNW: { lat: -34.781788, lng: -56.225623},
		cornerSE: { lat: -34.927028, lng: -55.835540}
	}
};

/* Operations */
const validateOperation = (op) => {
	return true;
};

const convertCoordinates = (op) => {
	// Switch LngLat to LatLng
	return {
		...op, operation_volumes: op.operation_volumes.map(
			(volume) => {
				const coordinates = volume.operation_geography.coordinates.map((coords) =>
					coords.map((pos) => [pos[1], pos[0]])
				);
				const operationGeography = {...volume.operation_geography, coordinates: coordinates};
				return {...volume, operation_geography: operationGeography};
			}
		)
	};
};
const operationsMutex = new Mutex();

/* Drones */

const socket = io(API, {
	transports: ['websocket']
});

const droneMutex = new Mutex();
const initializer = (store) => {
	socket.on('new-position', function (info) {
		const info2 = {...info};
		//console.log('DroneState: new-position: ', info2);
		store.actions.drones.post(info2);
	});

	// Set default position for the map. If geolocation is allowed, it'll be the Operator current location.
	if (navigator.geolocation) {
		/// TODO: Force default even if geolocation is acquired (parameter)
		navigator.geolocation.getCurrentPosition((position) => {
			//store.actions.setPosition(position.coords.latitude, position.coords.longitude);
			const cornerNW = { lat: position.coords.latitude - 0.05, lng: position.coords.longitude + 0.05};
			const cornerSE = { lat: position.coords.latitude + 0.05, lng: position.coords.longitude - 0.05};
			store.actions.map.setCorners(cornerNW, cornerSE);
		});
	}
};

/* Actions helpers */
function addOperations(store, data) {
	operationsMutex
		.acquire()
		.then(function (release) {
			//console.log('OperationState: (NEW) ', data);
			const dataObtained = Array.from(data);
			const pairs = S.justs(dataObtained.map((op) => {
				return validateOperation(op) ? S.Just(S.Pair(op.gufi)(convertCoordinates(op))) : S.Nothing;
				// L, and therefore the web, uses LatLng coordinates
				// The DB stores LngLat
				// Therefore, we got to convert the coordinates of all volumes
			}));
			const operations = S.fromPairs(pairs);
			store.setState({ operations: { updated: Date.now(), list: S.Just(operations)}});
			release();
		});
}

function addUsers(store, data) {
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((user) => {
		return S.Just(S.Pair(user.username)(user));
	}));
	const users = S.fromPairs(pairs);
	store.setState({ users: { updated: Date.now(), list: S.Just(users)}});
}

/* Actions */
const actions = {
	auth: {
		login: (store, username, password, callback, errorCallback) => {
			const authInfo = JSON.stringify({
				username: username,
				password: password
			});
			Axios.post('auth/login', authInfo)
				.then(result => {
					const token = result.data;
					store.setState({ auth: { ...store.state.auth, token: S.Just(token), username: username }});
					callback && callback();
				})
				.catch(error => {
					console.error('AdesState: (ERROR)', error);
					errorCallback && error.response && errorCallback(error.response.data);
				});
		},

		info: (store, token, username, okCallback, errorCallback) => {
			Axios.get('user/' + username, {headers: {'auth': token}})
				.then(result => {
					store.setState({ auth: { ...store.state.auth, token: S.Just(token), user: S.Just(result.data) }});
					okCallback && okCallback(result.data);
				})
				.catch(error => {
					console.error('AdesState: (ERROR)', error);
					store.setState(initialState);
					errorCallback && errorCallback();
				});
		},
		logout: (store) => {
			store.setState(initialState);
		}
	},
	users: {
		fetch: (store) => {
			Axios.get(API + 'user', {headers: { auth: fM(store.state.auth.token) }})
				.then(result => addUsers(store, result.data))
				.catch(error => console.error('AdesState: (Users)', error));
		}
	},
	operations: {
		fetch: (store) => {
			console.log('Fetch');
			A.get(API + 'operation', {headers: { auth: fM(store.state.auth.token) }})
				.then(result => addOperations(store, result.data.ops)) // TODO: Contract
				.catch(error => console.error('OperationState: (ERROR) ', error));
		},
		post: (store, operation, callback, errorCallback) => {
			A.post(API + 'operation', operation, {headers: { auth: fM(store.state.auth.token) }})
				.then(result => {
					addOperations(store, result.data);
					callback && callback();
				})
				.catch(error => {
					console.error('OperationState: (ERROR', error);
					errorCallback && error.response && errorCallback(error.response.data);
				});
		}
	},
	drones: {
		post: (store, data) => {
			droneMutex
				.acquire()
				.then(function(release) {
					const drones = store.state.drones.list;
					const locationLatLng = {...data.location,
						coordinates: {lat: data.location.coordinates[1], lng: data.location.coordinates[0]}};
					const dataLatLng = {...data, location: locationLatLng};
					const defaultValue = S.singleton(data.gufi)(dataLatLng);
					store.setState({
						drones: {
							updated: Date.now(),
							list: S.Just(
								S.maybe
								(defaultValue)
								(S.insert(dataLatLng.gufi)(dataLatLng))
								(drones)
							)
						}}); // Creates a new StrMap if it doesn't exist, if not it inserts new position data into it.
					release();
				});
		}
	},
	map: {
		setCorners: (store, cornerNW, cornerSE) => {
			//console.log('MapState: (BOUND) ', JSON.stringify(cornerNW), JSON.stringify(cornerSE));
			store.setState({ map: { cornerNW, cornerSE }});
		}
	}
};

/* OPERATIONS */
/* Extract data from global state */

const extractOperationsFromState = (adesState) => {
	return maybeValues(adesState.operations.list);
};

/* Helper functions */

const filterOperationsByState = states => operations => {
	// Unwrap Operations, then filter operations that are not opState
	// //console.log('filterOperationsByState', operations);
	return S.filter ((op) => states.includes(op.state)) (operations);
};

const filterOperationsByIds = ids => operations => {
	//console.log('filterOperationsByIds', ids, operations);
	return S.filter((op) => ids.includes(op.gufi)) (operations);
};

const useAdesState = globalHook(React, initialState, actions, initializer);

export {
	useAdesState as default,
	extractOperationsFromState,
	filterOperationsByState,
	filterOperationsByIds
};

/* Notification state to be added

import React, {createContext, useReducer, useContext} from 'react';
import {
    Just, isJust, Nothing
} from 'sanctuary';
import _ from '../libs/SaferSanctuary.js'

const localNotifications = localStorage.getItem("notifications");
const notifications = new Map(localNotifications != null ? JSON.parse(localNotifications) : []);
notifications.forEach((elem) => elem.recent = false);
const defaultState = {
    all: notifications
};

const NotificationContext = createContext(null);
const useNotificationStore = () => useContext(NotificationContext);

function reducer(state = defaultState, action = Nothing) {
    if (isJust(action)) {
        const reduce = _(action);
        const notices = new Map(state.all);
        const value = reduce.value;
        switch(reduce.type) {
            case "ADD":
                const data = {...value, recent: true};
                notices.set(value.message_id, data);
                localStorage.setItem(
                    "notifications",
                    JSON.stringify(Array.from(notices.entries()))
                ); // Survive across browser-reloads
                return {...state, all: notices};
            case "REMOVE":
                notices.delete(value);
                notices.forEach((elem) => elem.recent = false);
                localStorage.setItem(
                    "notifications",
                    JSON.stringify(Array.from(notices.entries()))
                ); // Survive across browser-reloads
                return {...state, all: notices};
            default:
                //console.log("NotificationProvider: No type identified", value);
                return state;
        }
    } else {
        return state;
    }
}

function NotificationProvider({children}) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    // Debug code: Respond to broadcast channel messages
    const bc = new BroadcastChannel('simulator');
    bc.onmessage = (event) => {
        dispatch(Just({type: "ADD", value: event.data}));
    };
    const value = {state, dispatch};
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

function notifCount (state) {
	return state.all.size;
}

export {NotificationProvider, useNotificationStore, notifCount}

 */