/* istanbul ignore file */

import {useEffect, useState} from 'react';
import L from 'leaflet';
import 'leaflet-geometryutil';
import A from 'axios';
import {API} from '../../consts';

function UseSimulatorLogic(refMapOnClick, map, token) {

	const [droneCurrentlyAdding, setDroneCurrentlyAdding] = useState(-1);
	const [paths, setPaths] = useState([[]]);
	const [timer, setTimer] = useState(null);

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

	const gufis = ['903d458c-0a96-4b72-9626-d8000e70c640', 'ff4b6505-c282-42b1-b013-66f02137f5d5', 'a20ef8d5-506d-4f54-a981-874f6c8bd4de', 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'];

	const fly = (ratio) => {
		paths.forEach((path, index) => {
			const point = L.GeometryUtil.interpolateOnLine(map.current, path, ratio);
			const nextPointIndex = point.predecessor < path.length - 1 ? point.predecessor + 1: 0;
			const nextPoint = {lat: path[nextPointIndex][0], lng: path[nextPointIndex][1]};
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
				'gufi': gufis[index]
			};
			console.log('POSITION', position);
			A.post(API + 'position', position, {headers: { auth: token }})
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
			refMapOnClick.current = () => {};
		} else {
			refMapOnClick.current = event => {
				const {latlng} = event;
				setPath(latlng);
			};
		}
	}, [droneCurrentlyAdding]); // eslint-disable-line react-hooks/exhaustive-deps

	return [paths, setPath, droneCurrentlyAdding, setDroneCurrentlyAdding, addNewDrone, startFlying, stopFlying];
}

export default UseSimulatorLogic;