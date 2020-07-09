import {fM} from '../libs/SaferSanctuary';
import {Axios, print} from '../state/AdesState';
import S from 'sanctuary';
import {OperationGoneRogue} from '../entities/Notification';

/* Auxiliaries */
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

function addOperations(store, data) {
	print(store.state, false, 'OperationState', data);
	const dataObtained = Array.from(data);
	const pairs = S.justs(dataObtained.map((op) => {
		return validateOperation(op) ? S.Just(S.Pair(op.gufi)(convertCoordinates(op))) : S.Nothing;
		// Leaflet, and therefore the web, uses LatLng coordinates
		// The DB stores LngLat
		// Therefore, we got to convert the coordinates of all volumes
	}));
	const operations = S.fromPairs(pairs);
	store.setState({operations: {updated: Date.now(), list: operations}});
}

function updateOperationState(store, gufi, info) {
	print(store.state, false, 'OperationState', 'state changed',gufi, info);
	const currentOperations = store.state.operations.list;
	const isRogue = info === 'ROGUE';
	console.log(gufi, info);
	const mbCurrentOperation = S.value(gufi)(currentOperations);
	if (S.isJust(mbCurrentOperation)) {
		const currentOperation = fM(mbCurrentOperation);
		if (isRogue) store.actions.notifications.add(
			new OperationGoneRogue(currentOperation.flight_comments)
		);
		currentOperation.state = info;
		const newOperations = S.insert(gufi)(currentOperation)(currentOperations);
		store.setState({operations: {updated: Date.now(), list: newOperations}});
	} else {
		store.actions.operations.fetch(store);
	}
}

function prepareOperation(operation) {
	operation.operation_volumes.map(volume => {
		const newVolume = {...volume};
		newVolume.operation_geography.coordinates[0].push(newVolume.operation_geography.coordinates[0][0]);
		return newVolume;
	});
	return operation;
}

/* Actions */
export const fetch = (store) => {
	Axios.get('operation', {headers: {auth: fM(store.state.auth.token)}})
		.then(result => addOperations(store, result.data.ops)) // TODO: Contract
		.catch(error => print(store.state, true, 'OperationState', error));
};
export const post = (store, operation, callback, errorCallback) => {
	const operationCleaned = prepareOperation(operation);
	Axios.post('operation', operationCleaned, {headers: {auth: fM(store.state.auth.token)}})
		.then(result => {
			//addOperations(store, result.data);
			// TODO: Don't ask the server for the operations...
			store.actions.operations.fetch(store);
			callback && callback();
		})
		.catch(error => {
			print(store.state, true, 'OperationState', error);
			errorCallback && error.response && errorCallback(error.response.data);
		});
};
export const pendingacceptation = (store, gufi, comments, isApproved) => {
	const data = {comments: comments, approved: isApproved};
	Axios.post('operation/' + gufi + '/pendingtoaccept', data, {headers: {auth: fM(store.state.auth.token)}})
		.then(() => {
			// TODO:
			//  updateOperationState(store, gufi, isApproved ? 'ACCEPTED' : 'NOT_ACCEPTED');
		})
		.catch(error => {
			print(store.state, true, 'OperationState', error);
			//errorCallback && error.response && errorCallback(error.response.data);
		});
};
export const updateOne = (store, gufi, info) => {
	updateOperationState(store, gufi, info);
};