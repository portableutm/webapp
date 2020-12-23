/* istanbul ignore file */

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-geometryutil';
import A from 'axios';
import { useStore } from 'mobx-store-provider';

function UseSimulatorLogic() {

	const [droneCurrentlyAdding, setDroneCurrentlyAdding] = useState(-1);
	const [paths, setPaths] = useState([[]]);
	const [timer, setTimer] = useState(null);

	const { API, authStore, mapStore } = useStore('RootStore', store => ({ API: store.API, authStore: store.authStore, mapStore: store.mapStore }));

	const setPath = (latlng, index = -1) => {
		setPaths(paths => {
			const newPaths = JSON.parse(JSON.stringify(paths));
			if (index >= 0) {
				newPaths[droneCurrentlyAdding][index] = [latlng.lat, latlng.lng];
			} else {
				newPaths[droneCurrentlyAdding].push([latlng.lat, latlng.lng]);
			}
			return newPaths;
		});
	};

	const addNewDrone = () => setPaths(paths => {
		const newPaths = JSON.parse(JSON.stringify(paths));
		newPaths.push([]);
		return newPaths;
	});

	const gufis = ['06124238-71c2-44a9-9f09-ca7652df37f3', '42a4516b-8a99-4aaf-9ebf-9aa086545c05', '7f982f0b-303b-4982-9487-1cb463b9dc9f', '1c2662dc-e1b5-4813-a060-66aa0781ae55'];

	const fly = (ratio) => {
		paths.forEach((path, index) => {
			const point = L.GeometryUtil.interpolateOnLine(mapStore.map, path, ratio);
			const nextPointIndex = point.predecessor < path.length - 1 ? point.predecessor + 1: 0;
			const nextPoint = { lat: path[nextPointIndex][0], lng: path[nextPointIndex][1] };
			const heading = L.GeometryUtil.bearing(point.latLng, nextPoint);
			console.log('POINT', point);
			const position = {
				'altitude_gps': 35,
				'location': {
					'type': 'Point',
					'coordinates': [
						point.latLng.lng,
						point.latLng.lat
					]
				},
				'heading': parseInt(''+ heading),
				'time_sent': '2019-12-11T19:59:10.000Z',
				'gufi': gufis[index%4]
			};
			console.log('POSITION', position);
			A.post(API + 'position', position, { headers: { auth: authStore.token } })
				.then(result => {
					console.log('POSITION', result.data);
				})
				.catch(error => {
					console.error('POSITION', error);
				});
		});

		if (ratio < 1) {
			const newTimer = setTimeout(() => fly(ratio + 0.02), 1000);
			setTimer(newTimer);
		} else {
			const newTimer = setTimeout(() => fly(0.02), 1000);
			setTimer(newTimer);
		}
	};

	const startFlying = () => {
		fly(0.01);
	};
	
	const stopFlying = () => {
		if (timer != null) {
			clearTimeout(timer);
		}
	};

	useEffect(() => {
		if (droneCurrentlyAdding < 0) {
			// When Map click should do nothing
			mapStore.removeMapOnClick();

		} else {
			mapStore.removeMapOnClick();
			mapStore.setMapOnClick(event => {
				const { latlng } = event;
				setPath(latlng);
			});
		}
	}, [droneCurrentlyAdding]); // eslint-disable-line react-hooks/exhaustive-deps

	return [paths, setPath, droneCurrentlyAdding, setDroneCurrentlyAdding, addNewDrone, startFlying, stopFlying];
}

export default UseSimulatorLogic;