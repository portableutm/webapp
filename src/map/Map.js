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
import RestrictedFlightVolume from './elements/RestrictedFlightVolume';
import SelectedOperation from './viewer/SelectedOperation';
import SimulatorPanel from './actions/SimulatorPanel';
import EditorPanel from './actions/EditorPanel';
import OperationEditMarker from './elements/OperationEditMarker';

/* Hooks */
import useOperationFilter from './hooks/useOperationFilter';
import useAdesState from '../state/AdesState';
import useEditorStepText from './hooks/useEditorStepText';
import useEditorLogic from './hooks/useEditorLogic';
import useSimulatorLogic from './hooks/useSimulatorLogic';

/* Auxiliaries */
import {initializeLeaflet} from './MapAuxs';

import RightArea from '../layout/RightArea';

import Polyline from './elements/Polyline';
import _, {fM, mapValues, maybeValues} from '../libs/SaferSanctuary';



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

	const isEditor = S.isJust(mode) && fM(mode) === 'new';

	/* Viewer state */
	const [ops, opsFiltered, id, filtersSelected, setFiltersSelected, , idsShowing, setIdsShowing, rfvs, setRfvsShowing] = useOperationFilter();
	const [currentSelectedOperation, setCurrentSelectedOperation] = useState(S.Nothing);

	/* Simulator state */
	const [simPaths, setSimPath, simDroneIndex, onSelectSimDrone, addNewDrone, startFlying, stopFlying] = useSimulatorLogic(refMapOnClick, map, fM(state.auth.token));
	const isSimulator = (S.isJust(mode) && fM(mode) === 'simulator');



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
		if (S.isJust(state.quickFly.list)) {
			actions.map.setCorners(maybeValues(actions.map.quickFly.list)[0]);
		}
	}, [state.quickFly.updated]);

	useEffect(() => {
		// Change map position if it has changed in the state
		if (map.current) {
			const bounds = L.latLngBounds(state.map.cornerNW, state.map.cornerSE);
			map.current.fitBounds(bounds);
		}
	}, [JSON.stringify(state.map.cornerNW), JSON.stringify(state.map.cornerSE)]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.count('mapUpdated');
	}, [JSON.stringify(ops), JSON.stringify(opsFiltered), JSON.stringify(drones), JSON.stringify(polygons), JSON.stringify(simPaths)]); // eslint-disable-line react-hooks/exhaustive-deps

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
							isSelected={op.gufi === fM(currentSelectedOperation)}
							latlngs={volume.operation_geography.coordinates}
							state={op.state}
							info={op}
							onClick={() => setCurrentSelectedOperation(S.Maybe.Just(op.gufi))}
						/>;
					});
				})}
				{mapValues(state.rfv.list)(() => {})((rfv) => {
					if (rfvs.indexOf(rfv.id) !== -1) {
						return (
							<RestrictedFlightVolume
								map={map.current}
								key={rfv.comments}
								latlngs={rfv.geography.coordinates}
								name={rfv.comments}
							/>
						);
					}
				})}


				{/* Operation creation */}
				{isEditor && polygons.map((polygon, index) => {
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
				{isEditor && polygons.map((polygon, index) => {
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
				{/* Simulator */}
				{S.isJust(mode) && fM(mode) === 'simulator' && simPaths.map((path, index) => {
					return path.map((latlng, index2) => {
						return (
							<OperationEditMarker
								index={'D' + index + '->' + index2}
								map={map.current}
								id={'marker' + index2 + 'p' + index}
								key={'marker' + index2 + 'p' + index}
								onDrag={latlng => setSimPath(latlng, index2)}
								latlng={latlng}
							/>
						);
					});
				})}
				{S.isJust(mode) && fM(mode) === 'simulator' && simPaths.map((path, index) => {
					return (
						<Polyline
							map={map.current}
							key={'polyline' + index}
							latlngs={path}
						/>
					);
				})}
			</MapMain>
			<RightArea
				forceOpen={S.isJust(currentSelectedOperation) || isSimulator || isEditor}
				onClose={() => setCurrentSelectedOperation(S.Nothing)}
			>
				{ S.isJust(currentSelectedOperation) &&
					<SelectedOperation gufi={fM(currentSelectedOperation)} />
				}
				{ S.isNothing(currentSelectedOperation) && !isEditor &&
				<QuickFly
					onClick={quickFlyOnClick}
				/>
				}
				{ S.isNothing(currentSelectedOperation) && !isEditor &&
				<Layers
					filtersSelected={filtersSelected}
					setFiltersSelected={setFiltersSelected}
					idsSelected={idsShowing}
					setIdsSelected={setIdsShowing}
					rfvs={rfvs}
					setRfvsShowing={setRfvsShowing}
					operations={ops}
					disabled={id != null}
				/>
				}
				{/* Editor Panels */}
				{isEditor &&
					<EditorPanel
						steps={stepsToDefineOperation}
						stepsDisabled={stepsDisabled}
					/>
				}
				{/* Simulator panels*/}
				{ isSimulator &&
					<SimulatorPanel
						paths={simPaths}
						onClick={onSelectSimDrone}
						selected={simDroneIndex}
						newDrone={addNewDrone}
						startFlying={startFlying}
						stopFlying={stopFlying}
					/>
				}
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
