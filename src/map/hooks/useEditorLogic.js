import {useEffect, useState} from 'react';
import S from 'sanctuary';

/* Internal */
import useAdesState from '../../state/AdesState';
import {fM} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';

const editorMode = {
	OPERATION: {
		EXISTING: 'OP-EXISTING',
		NEW: 'OP-NEW'
	},
	UVR: {
		EXISTING: 'UVR-EXISTING',
		NEW: 'UVR-NEW'
	},
	UNKNOWN: 'UNKNOWN' // Editor is turned off
};
const DEFAULT_UVR_VALIDITY = 2; // 2 hours

const defaultNewOperation = {
	name: 'Untitled',
	owner: 'admin',
	contact: '',
	contact_phone: '',
	flight_comments: '',
	volumes_description: 'v0.1',
	flight_number: Date.now(),
	submit_time: new Date().toISOString(), // TODO: Proper format for time 2019-12-11T19:59:10Z
	update_time: new Date().toISOString(),
	operation_volumes: [
		{
			near_structure: false,
			effective_time_begin: new Date(),
			effective_time_end: new Date(),
			min_altitude: 0,
			max_altitude: 120,
			beyond_visual_line_of_sight: false,
			operation_geography: {
				type: 'Polygon',
				coordinates: [[]]
			},
		}
	],
	faa_rule: 0,
	state: 0,
	controller_location: {
		'type': 'Point',
		'coordinates': [
			-56.15970075130463,
			-34.9119507320875
		]
	},
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
	negotiation_agreements: []
};
const defaultNewUVR = {
	actual_time_end: null,
	cause: 'SECURITY',
	effective_time_begin: new Date(),
	effective_time_end: new Date(),
	geography: {
		type: 'Polygon',
		coordinates: []
	},
	max_altitude: '50',
	min_altitude: '0',
	permitted_uas: ['PART_107'],
	reason: 'uasVolumeReservation.REASON',
	required_support: ['ENHANCED_SAFE_LANDING'],
	type: 'DYNAMIC_RESTRICTION',
	uss_name: null
};

// setUTCHours(volumeInfo.effective_time_end.getUTCHours() + DEFAULT_OPERATION_VALIDITY)

function useEditorLogic(mode = editorMode.UNKNOWN, currentInfo = null) {

	const { t } = useTranslation('map');
	const [state, actions] = useAdesState(state => state.map, actions => actions);
	const [mbInfo, setMbInfo] = useState(S.Nothing);

	const setInfo = (partialOrCompleteInfo) =>
		setMbInfo(oldInfo => S.Just({...fM(oldInfo), ...partialOrCompleteInfo}));
	const setVolumeInfo = (volumeId, partialOrCompleteInfo) =>
		setMbInfo(mbOldInfo => {
			const currentInfo = fM(mbOldInfo);
			const volumes =  [...currentInfo.operation_volumes];
			volumes[volumeId] = {...volumes[volumeId],
				...partialOrCompleteInfo};
			return S.Just({
				...fM(mbOldInfo),
				operation_volumes: volumes
			});
		});
	/* fnPolygon - fn that receives the current polygon of an operation volume and transforms it, returning it */
	const setCoordinatesOfVolume = (volumeId, fnPolygon) => setMbInfo(oldInfo => {
		const newInfo = {...fM(oldInfo)};
		newInfo.operation_volumes[volumeId].operation_geography.coordinates =
			fnPolygon(newInfo.operation_volumes[volumeId].operation_geography.coordinates);
		return S.Just(newInfo);
	});
	const setCoordinatesOfUVR = (fnPolygon) => setMbInfo(oldInfo => {
		const newInfo = {...fM(oldInfo)};
		newInfo.geography.coordinates = fnPolygon(newInfo.geography.coordinates);
		return S.Just(newInfo);
	});

	const save = (savingFinishedCallback) => {
		actions.map.disableMapOnClick();
		/* Check polygon has been created */
		if (mode === editorMode.OPERATION.NEW || mode === editorMode.OPERATION.EXISTING) {
			if (fM(mbInfo).operation_volumes[0].operation_geography.coordinates.length === 0)
				actions.warning.setWarning(t('editor.cant_finish'));
		} else if (mode === editorMode.UVR.NEW || mode === editorMode.UVR.EXISTING) {
			if (fM(mbInfo).geography.coordinates.length === 0)
				actions.warning.setWarning(t('editor.cant_finish'));
		}

		const info = fM(mbInfo);
		info.submit_time = new Date().toISOString();
		if (mode === editorMode.OPERATION.NEW || mode === editorMode.OPERATION.EXISTING) {
			info.operation_volumes = info.operation_volumes.map((opVolume) => {
				const newCoordinates =
					opVolume.operation_geography.coordinates[0].map(lngLat => [lngLat[1], lngLat[0]]);
				return {
					...opVolume,
					operation_geography: {
						...opVolume.operation_geography,
						coordinates: [newCoordinates]
					}
				};
			});
		} else if (mode === editorMode.UVR.NEW || mode === editorMode.UVR.EXISTING) {
			const uvrCoordsSwapped = info.geography.coordinates[0].map(coordLatLng => [coordLatLng[1], coordLatLng[0]]);
			info.geography = {
				...info.geography,
				coordinates: [uvrCoordsSwapped]
			};
		}
		const callback = () => {
			savingFinishedCallback();
			//history.push('/dashboard/operations');
		};
		const errorCallback = () => {
			savingFinishedCallback();
		};
		console.log('NEWINFO', info);
		//actions.operations.post(info, callback, errorCallback);
	};

	useEffect(() => {
		/* Load appropiate information into the editor according to the mode being used */
		if (mode !== editorMode.UNKNOWN) {
			switch (mode) {
				case editorMode.OPERATION.NEW: {
					setInfo(defaultNewOperation);
					break;
				}
				case editorMode.OPERATION.EXISTING: {
					const operationVolume = {
						...currentInfo.operation_volumes[0],
						effective_time_begin: new Date(currentInfo.operation_volumes[0].effective_time_begin),
						effective_time_end: new Date(currentInfo.operation_volumes[0].effective_time_end)
					};
					// This only works if there's only one opeseration volume... iterate over operation volumes
					// if there is more than one
					const info = {
						...currentInfo,
						owner: currentInfo.owner.username,
						operation_volumes: [operationVolume]
					};
					setInfo(info);
					break;
				}
				case editorMode.UVR.NEW: {
					setInfo(defaultNewUVR);
					break;
				}
				default: {
					break;
				}
			}
		}
	}, [mode]);

	useEffect(() => {
		/* Map initialized - clicking on map should draw a polygon for the Operation or UVR */
		if (state.isInitialized && mode !== editorMode.UNKNOWN) {
			const drawPolygonPointOnClick = (event) => {
				const {latlng} = event;
				if (mode === editorMode.OPERATION.NEW || mode === editorMode.OPERATION.EXISTING) {
					setCoordinatesOfVolume(0, oldCoordinates => {
						const newCoordinates = oldCoordinates.length === 0 ? [] : oldCoordinates[0].slice();
						newCoordinates.push([latlng.lat, latlng.lng]);
						return [newCoordinates];
					});
				} else if (mode === editorMode.UVR.NEW || mode === editorMode.UVR.EXISTING) {
					setCoordinatesOfUVR(oldCoordinates => {
						const newCoordinates = oldCoordinates.length === 0 ? [] : oldCoordinates[0].slice();
						newCoordinates.push([latlng.lat, latlng.lng]);
						return [newCoordinates];
					});
				}
				actions.warning.close();
			};
			actions.map.setMapOnClick(drawPolygonPointOnClick);
			setInfo(info => {
				const newInfo = {...info};
				if (mode === editorMode.OPERATION.NEW) {
					newInfo.operation_volumes[0].effective_time_begin = new Date();
					newInfo.operation_volumes[0].effective_time_end = new Date();
					newInfo.operation_volumes[0].effective_time_end.setUTCHours(newInfo.effective_time_end.getUTCHours() + DEFAULT_UVR_VALIDITY);
				} else if (mode === editorMode.UVR.NEW) {
					newInfo.effective_time_begin = new Date();
					newInfo.effective_time_end = new Date();
					newInfo.effective_time_end.setUTCHours(newInfo.effective_time_end.getUTCHours() + DEFAULT_UVR_VALIDITY);
				}
				return newInfo;
			});
		} else if (!state.isInitialized) {
			actions.map.disableMapOnClick();
		}
	}, [state.isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

	return [mbInfo, {setInfo, setVolumeInfo, setCoordinatesOfUVR, setCoordinatesOfVolume}, save];
}

export {useEditorLogic as default, editorMode};