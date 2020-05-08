import React, {useState, useEffect, useRef} from 'react';

import '../Ades.css';

/* Leaflet */
//import L from 'leaflet';
import L from '../libs/wise-leaflet-pip';
import '../css/leaflet.css';

/* Sanitization */
//import PropTypes from 'prop-types';
import S from 'sanctuary';

/* UI */
import {Card} from '@blueprintjs/core';

/* Components */
import MapMain from './MapElements';
import Layers from './actions/Layers';
import QuickFly from './actions/QuickFly';
import DroneMarker from './elements/DroneMarker';
import OperationPolygon from './elements/OperationPolygon';
import OperationInfoEditor from './editor/OperationInfoEditor';
import OperationVolumeInfoEditor from './editor/OperationVolumeInfoEditor';
import LeftOverlay from './generic/LeftOverlay';

/* Hooks */
import useOperationFilter from './hooks/useOperationFilter';
import useAdesState from '../state/AdesState';
import {fM, maybeValues} from '../libs/SaferSanctuary';

/* Auxiliaries */
import {initializeLeaflet} from './MapAuxs';
import useEditorStepText from './hooks/useEditorStepText';
import OperationEditMarker from './elements/OperationEditMarker';
import useEditorLogic from './hooks/useEditorLogic';
import RightArea from '../layout/RightArea';


/* Main function */
function Map({ mode }) {
	const map = useRef(null);
	/* 	It's important to hold a reference to map that survives through the application
		and that is only used after correctly initializing Leaflet. 	*/

	/* 	State holders	 */
	const [state, actions] = useAdesState();
	const [drones, setDrones] = useState([]);

	/* Map */
	const [mapInitialized, setMapInitialized] = useState(false);
	const refMapOnClick = useRef(() => {
	});

	/* Editor state */
	const [isOperationInfoPopupOpen, setOperationInfoPopupOpen] = useState(false);
	const [operationInfo, setOperationInfo, volume, setVolumeInfo, polygons, setPolygons, setCurrentStep, setErrorOnSaveCallback] = useEditorLogic(refMapOnClick);

	const [stepsToDefineOperation, stepText, stepsDisabled] =
		useEditorStepText(setOperationInfo, setOperationInfoPopupOpen, setCurrentStep, setErrorOnSaveCallback);

	const [maybeEditingOpVolume, setEditingOperationVolume] = useState(S.Maybe.Nothing);
	//const notifications = useNotificationStore();
	//const statusOverMapNotifs =
	//	notifications.state.all.size > 0
	//		? ' statusOverMapNotifs'
	//		: ' statusOverMapNoNotifs';
	const statusOverMapNotifs = ' statusOverMapNoNotifs';

	/* Viewer state */
	const [ops, opsFiltered, id, ids, filtersSelected, setFiltersSelected, setIds] = useOperationFilter();


	/* 	Drone related logic	 */
	useEffect(() => {
		const allDrones = state.drones.list;
		setDrones(maybeValues(allDrones).map((drone) => {
			// TODO: This should be done in the backend
			const operationDrone = ops.find((op) => op.gufi === drone.gufi);
			let risk = 'EXTREME';
			if (operationDrone) {
				// Drone has an associated Operation
				risk = 'MEDIUM';
				const polygon = L.polygon(operationDrone.operation_volumes[0].operation_geography.coordinates);
				if (polygon.contains(drone.location.coordinates)) {
					risk = 'LOW';
				}
			}
			return {...drone, risk};
		}));
	}, [state.drones.updated]); // eslint-disable-line react-hooks/exhaustive-deps


	/*	 Effects 	*/
	// Leaflet map initialization
	useEffect(() => {
		const mapClick = e => {
			refMapOnClick.current(e);
		};
		initializeLeaflet(
			map,
			mapClick,
			() => {
				const cornerNW = map.current.getBounds().getNorthWest();
				const cornerSE = map.current.getBounds().getSouthEast();
				actions.map.setCorners(cornerNW, cornerSE);
			},
			setMapInitialized);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		// Each time we visualize another Operation, we clear the feature group not to mix their volumes
		if (id != null && opsFiltered.length > 0) {
			const polygon = L.polygon(opsFiltered[0].operation_volumes[0].operation_geography.coordinates);
			actions.map.setCorners(polygon.getBounds().getNorthWest(), polygon.getBounds().getSouthEast());
		}
	}, [id, opsFiltered]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Change map position if it has changed in the state
		if (map.current) {
			const bounds = L.latLngBounds(state.map.cornerNW, state.map.cornerSE);
			map.current.fitBounds(bounds);
		}
	}, [JSON.stringify(state.map.cornerNW), JSON.stringify(state.map.cornerSE)]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.count('mapUpdated');
	}, [JSON.stringify(ops), JSON.stringify(opsFiltered), JSON.stringify(drones), JSON.stringify(polygons)]); // eslint-disable-line react-hooks/exhaustive-deps

	/*	Helpers */

	const quickFlyOnClick = (location) => actions.map.setCorners(location.cornerNW, location.cornerSE);

	return (
		<>
			{/* Panels of MapEditor */}
			{S.isJust(mode) && fM(mode) === 'new' &&
			<>
				{isOperationInfoPopupOpen &&
					<OperationInfoEditor
						isOpen={isOperationInfoPopupOpen}
						setOpen={setOperationInfoPopupOpen}
						info={operationInfo}
						setInfo={setOperationInfo}
					/>
				}
				<OperationVolumeInfoEditor
					info={volume}
					setInfo={setVolumeInfo}
					opVolumeIndex={maybeEditingOpVolume}
					setOpVolumeIndex={setEditingOperationVolume}
				/>
				<Card
					elevation={4}
					data-test-id='mapElementEditorStatus'
					className={'statusOverMap animated fadeInUpBig' + statusOverMapNotifs}
				>
					{stepText}
				</Card>
				<LeftOverlay disabled={stepsDisabled}>
					{stepsToDefineOperation}
				</LeftOverlay>
			</>
			}
			<MapMain map={map.current} mapInitialized={mapInitialized}>
				{/* Live map */}
				{drones.map((drone) =>
					<DroneMarker
						map={map.current}
						key={drone.gufi}
						id={drone.gufi}
						heading={drone.heading}
						altitude={drone.altitude_gps}
						position={drone.location.coordinates}
						risk={drone.risk}
					/>
				)}
				{opsFiltered.map((op) => {
					return op.operation_volumes.map((volume) => {
						return <OperationPolygon
							map={map.current}
							key={op.gufi + '#' + volume.id}
							id={op.gufi + '#' + volume.id}
							latlngs={volume.operation_geography.coordinates}
							state={op.state}
							info={op}
						/>;
					});
				})}
				{/* Operation creation */}
				{S.isJust(mode) && fM(mode) === 'new' && polygons.map((polygon, index) => {
					return (
						<OperationPolygon
							map={map.current}
							id={'polygon' + index}
							key={'polygon' + index}
							latlngs={Array.from(polygon)}
							popup={'Volume of operation in construction'}
							operationInfo={{gufi: '', flight_comments: '** Editing **', state: '**EDITOR'}}
							onClick={() => setEditingOperationVolume(S.Maybe.Just(index))}
						/>
					);
				})}
				{S.isJust(mode) && fM(mode) === 'new' && polygons.map((polygon, index) => {
					return polygon.map((latlng, index2) => {
						return (
							<OperationEditMarker
								map={map.current}
								id={'marker' + index2 + 'p' + index}
								key={'marker' + index2 + 'p' + index}
								onDrag={latlng => {
									setPolygons(polygons => {
										// Change position of dragged marker (update polygon)
										const clonedPolygons = polygons.slice();
										clonedPolygons[index][index2] = [latlng.lat, latlng.lng];
										return clonedPolygons;
									});
								}}
								latlng={latlng}
							/>
						);
					});
				})}
			</MapMain>
			<RightArea>
				<QuickFly
					onClick={quickFlyOnClick}
				/>
				<Layers
					filtersSelected={filtersSelected}
					setFiltersSelected={setFiltersSelected}
					operations={ops}
					idsSelected={ids}
					setIdsSelected={setIds}
					disabled={id != null}
				/>
			</RightArea>
		</>
	);
}

/*Map.propTypes = {
	mode: PropTypes.oneOf(S.Maybe.Just)
};*/

export default Map;
// Might be useful later:
// https://github.com/Igor-Vladyka/leaflet.motion
// https://openmaptiles.com/downloads/europe/
