import {useEffect, useState} from 'react';
import S from 'sanctuary';
import _ from '../../libs/SaferSanctuary';
import {swap} from '../../Utils/coordsConverter';
import {useHistory} from 'react-router-dom';
import useAdesState from '../../state/AdesState';

/* Constants */
const DEFAULT_OPERATION_VALIDITY = 1; // Value to set by default in a new OperationVolume by defalt, in hours
const timeNow = new Date();
const timeNow2 = new Date();
timeNow2.setUTCHours(timeNow.getUTCHours() + DEFAULT_OPERATION_VALIDITY);

function UseEditorLogic(refMapOnClick) {
	const [operationInfo, setOperationInfo] = useState(S.Just({
		flight_comments: '',
		volumes_description: 'v0.1',
		flight_number: '12345678',
		submit_time: new Date().toISOString(), // TODO: Proper format for time 2019-12-11T19:59:10Z
		update_time: new Date().toISOString(),
		faa_rule: 0,
		state: 0,
		priority_elements: {
			priority_level: 1,
			priority_status: 'EMERGENCY_AIR_AND_GROUND_IMPACT'
		},
		uas_registrations: [],
		contingency_plans: [
			{
				contingency_cause: ['ENVIRONMENTAL', 'LOST_NAV'],
				contingency_location_description: 'OPERATOR_UPDATED',
				contingency_polygon: {
					type: 'Polygon',
					coordinates: [
						[
							[-56.15438461303711, -34.905501548851106],
							[-56.15138053894043, -34.90873940129964],
							[-56.14889144897461, -34.907437236859494],
							[-56.15112304687499, -34.9059942737644],
							[-56.15438461303711, -34.905501548851106]
						]
					]
				},
				contingency_response: 'LANDING',
				free_text: 'Texto libre DE prueba',
				loiter_altitude: 30,
				relative_preference: 30,
				relevant_operation_volumes: [1, 0],
				valid_time_begin: '2019-12-11T19:59:10Z',
				valid_time_end: '2019-12-11T20:59:10Z'
			}
		],
		operation_volumes: null,
		negotiation_agreements: [
			{
				free_text: 'Esto es solo una prueba PRUEBAAAA',
				discovery_reference: 'discovery reference',
				type: 'INTERSECTION',
				uss_name: 'dronfies',
				uss_name_of_originator: 'dronfies',
				uss_name_of_receiver: 'dronfies'
			},
			{
				free_text: '(2) Esto es solo una prueba',
				discovery_reference: '(2)discovery reference',
				type: 'INTERSECTION',
				uss_name: 'dronfies',
				uss_name_of_originator: 'dronfies',
				uss_name_of_receiver: 'dronfies'
			}
		]
	}));
	const [currentStep, setCurrentStep] = useState(0);
	const [volume, setVolumeInfo] = useState({
		near_structure: false,
		effective_time_begin: timeNow,
		effective_time_end: timeNow2,
		min_altitude: 0,
		max_altitude: 393,
		beyond_visual_line_of_sight: false
	}); // TODO: Support more than one volume
	const [polygons, setPolygons] = useState([[]]);
	const [errorOnSaveCallback, setErrorOnSaveCallback] = useState(() => () => {});
	const [, actions] = useAdesState();
	const history = useHistory();

	useEffect(() => {
		if (currentStep === 0) {
			// When Map click should do nothing
			refMapOnClick.current = () => {};
			actions.map.onClicksDisabled(false);
		} else if (currentStep === 1) {
			refMapOnClick.current = event => {
				const {latlng} = event;
				setPolygons(polygons => {
					const newPolygon = polygons[0].slice();
					newPolygon.push([latlng.lat, latlng.lng]);
					return [newPolygon];
				});
			};
			actions.map.onClicksDisabled(false);
		} else if (currentStep === 3) {
			const info = _(operationInfo);
			info.submit_time = new Date().toISOString();
			let volumeWithPolygons = {...volume};
			volumeWithPolygons.operation_geography = {
				type: 'Polygon',
				coordinates: polygons.map(listLngLat =>
					listLngLat.map(lngLat => swap(lngLat))
				)
			};
			info.operation_volumes = [volumeWithPolygons];
			const callback = () => history.push('/dashboard/operations');
			actions.operations.post(info, callback, errorOnSaveCallback);
			actions.map.onClicksDisabled(false);
		}
	}, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps
	
	return [operationInfo, setOperationInfo, volume, setVolumeInfo, polygons, setPolygons, setCurrentStep, setErrorOnSaveCallback];
}

export default UseEditorLogic;