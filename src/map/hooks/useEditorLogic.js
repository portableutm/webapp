import {useEffect, useState} from 'react';
import S from 'sanctuary';
import _, {fM} from '../../libs/SaferSanctuary';
import {useHistory} from 'react-router-dom';
import useAdesState from '../../state/AdesState';

/* Constants */
const DEFAULT_OPERATION_VALIDITY = 1; // Value to set by default in a new OperationVolume by defalt, in hours
const timeNow = new Date();
const timeNow2 = new Date();
timeNow2.setUTCHours(timeNow.getUTCHours() + DEFAULT_OPERATION_VALIDITY);
const swap = (array) => [array[1], array[0]];

function UseEditorLogic(refMapOnClick, mapInitialized) {
	const [operationInfo, setOperationInfo] = useState(S.Just({
		contact: '',
		contact_phone: '',
		flight_comments: '',
		volumes_description: 'v0.1',
		flight_number: '',
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
		negotiation_agreements: []
	}));
	const [volume, setVolumeInfo] = useState({
		near_structure: false,
		effective_time_begin: timeNow,
		effective_time_end: timeNow2,
		min_altitude: 0,
		max_altitude: 120,
		beyond_visual_line_of_sight: false
	}); // TODO: Support more than one volume
	const [mbPolygons, setPolygons] = useState(S.Nothing);
	const [errorOnSaveCallback, setErrorOnSaveCallback] = useState(() => () => {});
	const [, actions] = useAdesState();
	const history = useHistory();
	const polygons = _(mbPolygons);

	useEffect(() => {
		if (mapInitialized) {
			refMapOnClick.current = event => {
				const {latlng} = event;
				actions.warning.close();
				setPolygons(mbPolygons => {
					let newPolygon;
					if (S.isJust(mbPolygons)) {
						newPolygon = (fM(mbPolygons))[0].slice();
					} else {
						newPolygon = [];
					}
					newPolygon.push([latlng.lat, latlng.lng]);
					return S.Just([newPolygon]);
				});
			};
			setVolumeInfo(volumeInfo => {
				volumeInfo.effective_time_begin = new Date();
				volumeInfo.effective_time_end = new Date();
				volumeInfo.effective_time_end.setUTCHours(volumeInfo.effective_time_end.getUTCHours() + DEFAULT_OPERATION_VALIDITY);
				return volumeInfo;
			});
			actions.map.onClicksDisabled(false);
		} else {
			refMapOnClick.current = () => {};
		}
	}, [mapInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

	const saveOperation = () => {
		actions.map.onClicksDisabled(false);
		/* Check polygon has been created */
		if (S.isNothing(mbPolygons)) {
			actions.warning.setWarning('The OPERATION could not be created, ' +
				'as the polygon was not defined. Please, define a polygon for where the vehicle can fly, ' +
				'by clicking on the map on the appropiate positions');
			return false;
		}
		refMapOnClick.current = () => {};
		const info = _(operationInfo);
		info.submit_time = new Date().toISOString();
		let volumeWithPolygons = {...volume};
		volumeWithPolygons.operation_geography = {
			type: 'Polygon',
			coordinates: mbPolygons.map(listLngLat =>
				listLngLat.map(lngLat => swap(lngLat))
			)
		};
		info.operation_volumes = [volumeWithPolygons];
		const callback = () => history.push('/dashboard/operations');
		actions.operations.post(info, callback, errorOnSaveCallback);
	};

	return [operationInfo, setOperationInfo, volume, setVolumeInfo, polygons, setPolygons, saveOperation, setErrorOnSaveCallback];
}

export default UseEditorLogic;