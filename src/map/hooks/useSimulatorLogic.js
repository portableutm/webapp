/* istanbul ignore file */

import {useEffect, useState} from 'react';
import L from 'leaflet';
import 'leaflet-geometryutil';
import A from 'axios';
import {API} from '../../consts';

function UseSimulatorLogic(refMapOnClick, map, token) {

	const [droneCurrentlyAdding, setDroneCurrentlyAdding] = useState(-1);
	const [paths, setPaths] = useState(
		[
			[
				[-34.91847120110969, -56.14774286808794],
				[-34.91502430311888, -56.147785762143506],
				[-34.91090893942617, -56.14328188630902],
				[-34.910557189369605, -56.139893255919276],
				[-34.91090893942617, -56.14328188630902],
				[-34.91502430311888, -56.147785762143506],
				[-34.91847120110969, -56.14774286808794]

				//[-34.918826, -56.151252]
			],
			[
				[-34.89952650787734, -56.14495730846219],
				[-34.90244637990491, -56.14555782524012],
				[-34.90227048693805, -56.1440458097814],
				[-34.89971999658466, -56.14616906553195],
				[-34.89952650787734, -56.14495730846219]	
			],
			[
				[-34.897931356156526, -56.152546533960496],
				[-34.89831834063094, -56.156149634628086],
				[-34.89677039179392, -56.15838012551754],
				[-34.894589141646854, -56.1586803839065],
				[-34.89254856488077, -56.157951184961874],
				[-34.8920560042744, -56.15546332973902],
				[-34.894131775399615, -56.1520318052937],
				[-34.897931356156526, -56.152546533960496]
			]
		]
	);
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

	const gufis = [
		'41e6d97f-3e6c-44db-8548-939e73dc01ee',
		'71dcae5b-4007-44ef-8a1b-6e1cbd14989d',
		'878a76c1-81fc-427d-8832-abad9273d796'
	];

	const fly = (ratio) => {
		paths.forEach((path, index) => {
			const point = L.GeometryUtil.interpolateOnLine(map.current, path, ratio);
			const nextPointIndex = point.predecessor < path.length - 1 ? point.predecessor + 1: 0;
			const nextPoint = {lat: path[nextPointIndex][0], lng: path[nextPointIndex][1]};
			const heading = L.GeometryUtil.bearing(point.latLng, nextPoint);
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
			const newTimer = setTimeout(() => fly(ratio + 0.02), 100);
			setTimer(newTimer);
		} else {
			const newTimer = setTimeout(() => fly(0.02), 100);
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