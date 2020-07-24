import S from 'sanctuary';
import {Mutex} from 'async-mutex';
/* Constants */
const droneMutex = new Mutex();

/* Actions */
export const add = (store, data) => {
	droneMutex
		.acquire()
		.then(function (release) {
			const drones = store.state.drones.list;
			const locationLatLng = {
				...data.location,
				coordinates: {lat: data.location.coordinates[1], lng: data.location.coordinates[0]}
			};

			const pilotLocationLatLng = {
				...data.controller_location,
				coordinates: {lat: data.controller_location.coordinates[1], lng: data.controller_location.coordinates[0]}
			};

			const dataLatLng = {...data, location: locationLatLng, controller_location: pilotLocationLatLng};
			store.setState({
				drones: {
					updated: Date.now(),
					list: S.insert (dataLatLng.gufi) (dataLatLng) (drones)
				}
			}); // Creates a new StrMap if it doesn't exist, if not it inserts new position data into it.
			release();
		});
};

