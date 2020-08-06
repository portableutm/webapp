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

/* Components */
import MapMain from './MapElements';
import Layers from './actions/Layers';
import QuickFly from './actions/QuickFly';
import DroneMarker from './elements/DroneMarker';
import OperationPolygon from './elements/OperationPolygon';
import OperationInfoEditor from './editor/OperationInfoEditor';
import RestrictedFlightVolume from './elements/RestrictedFlightVolume';
import SelectedOperation from './viewer/SelectedOperation';
import SimulatorPanel from './actions/SimulatorPanel';
import EditorPanel from './actions/EditorPanel';
import OperationEditMarker from './elements/OperationEditMarker';
import SelectedDrone from './viewer/SelectedDrone';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import ControllerLocationMarker from './elements/ControllerLocationMarker';

/* Hooks */
import useOperationFilter from './hooks/useOperationFilter';
import useRfvLogic from './hooks/useRfvLogic';
import useAdesState from '../state/AdesState';
import useSimulatorLogic from './hooks/useSimulatorLogic';
import useEditorLogic, {editorMode} from './hooks/useEditorLogic';

/* Auxiliaries */
import {initializeLeaflet} from './MapAuxs';

import RightArea from '../layout/RightArea';

import Polyline from './elements/Polyline';
import {fM} from '../libs/SaferSanctuary';
import { useParams } from 'react-router-dom';
import UASVolumeReservation from './elements/UASVolumeReservation';



/* Main function */
function Map({mode}) {
	const mapRef = useRef(null);
	/* 	It's important to hold a reference to map that survives through the application
		and that is only used after correctly initializing Leaflet. 	*/

	/* State holders and references */
	const [state, actions] = useAdesState();
	const [drones, setDrones] = useState([]);

	/* Route params */
	const { editId } = useParams();

	/* Editor state */
	let isEditor = false;
	let isEditingOperation = false;
	let isEditingUvr = false;
	let modeOfEditor = editorMode.UNKNOWN;
	let existingInfo = null;
	switch (fM(mode)) {
		case 'new-op': {
			isEditor = true;
			isEditingOperation = true;
			modeOfEditor = editorMode.OPERATION.NEW;
			break;
		}
		case 'edit-op': {
			isEditor = true;
			isEditingOperation = true;
			modeOfEditor = editorMode.OPERATION.EXISTING;
			existingInfo = fM(S.value(editId)(state.operations.list));
			break;
		}
		case 'new-uvr': {
			isEditor = true;
			isEditingUvr = true;
			modeOfEditor = editorMode.UVR.NEW;
			break;
		}
		case 'edit-uvr': {
			isEditor = true;
			isEditingUvr = true;
			modeOfEditor = editorMode.UVR.EXISTING;
			existingInfo = fM(S.value(editId)(state.uvr.list));
			break;
		}
	}
	const [mbInfo, infoSetters, save] = useEditorLogic(modeOfEditor, existingInfo);

	const [, setEditingOperationVolume] = useState(S.Maybe.Nothing);



	/* Viewer state */
	const [rfvs, setRfvs] = useRfvLogic();
	const [ops, opsFiltered, viewId, filtersSelected, setFiltersSelected, , idsShowing, setIdsShowing] = useOperationFilter();
	const [currentSelectedOperation, setSelectedOperation] = useState(S.Nothing);
	const [currentSelectedDrone, setSelectedDrone] = useState(S.Nothing);

	/* Simulator state */
	const [simPaths, setSimPath, simDroneIndex, onSelectSimDrone, addNewDrone, startFlying, stopFlying] = useSimulatorLogic(fM(state.auth.token));
	const isSimulator = (S.isJust(mode) && fM(mode) === 'simulator');


	/* 	Drone related logic	 */
	useEffect(() => {
		const allDrones = state.drones.list;
		setDrones(S.values(allDrones).map((drone) => {
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
		mapRef.current = initializeLeaflet();
		actions.map.setMapRef(mapRef);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Each time we visualize another Operation, we clear the feature group not to mix their volumes
		if (viewId != null && opsFiltered.length > 0) {
			opsFiltered.forEach((op) => {
				if (op.gufi === viewId) {
					const polygon = L.polygon(op.operation_volumes[0].operation_geography.coordinates);
					actions.map.setCorners(polygon.getBounds().getNorthWest(), polygon.getBounds().getSouthEast());
				}
			});

		}
	}, [viewId, opsFiltered]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Change map position if it has changed in the state
		if (state.map.mapRef && state.map.mapRef.current) {
			const bounds = L.latLngBounds(state.map.cornerNW, state.map.cornerSE);
			state.map.mapRef.current.fitBounds(bounds);
		}
	}, [JSON.stringify(state.map.cornerNW), JSON.stringify(state.map.cornerSE)]); // eslint-disable-line react-hooks/exhaustive-deps

	/*	Helpers */


	const quickFlyOnClick = (location) => actions.map.setCorners(location.cornerNW, location.cornerSE);
	const showStandardRightAreaPanels =
		S.isNothing(currentSelectedOperation) &&
		S.isNothing(currentSelectedDrone) &&
		!isEditor;

	return (
		<>
			<MapMain>
				<Dialog
					className='bp3-dark'
					title={state.map_dialog.title}
					isOpen={state.map_dialog.open}
					onClose={() => actions.map_dialog.close()}
				>
					<div className='dialogify'>
						{state.map_dialog.text}
					</div>
					<Button
						style={{margin: '10px'}}
						onClick={() => {
							if (S.isJust(state.map_dialog.rightButtonOnClick)) {
								fM(state.map_dialog.rightButtonOnClick)();
							} else {
								actions.map_dialog.close();
							}
						}}
						intent={Intent.PRIMARY}
					>
						{S.isJust(state.map_dialog.rightButtonText) ?
							fM(state.map_dialog.rightButtonText) : 'OK'
						}
					</Button>
				</Dialog>
				{	state.map.clickSelection.isSelecting &&
					state.map.clickSelection.listIsComplete &&
					<div
						className="mapOnClickChooser animated fadeIn faster"
						style={{left: state.map.clickSelection.x, top: state.map.clickSelection.y}}
					>
						Click on...
						{ state.map.clickSelection.listFns.map(labelFn => {
							return (
								<Button
									key={labelFn.label}
									className="mapOnClickChooserButton"
									intent={Intent.PRIMARY}
									onClick={() => labelFn.fn()}
								>
									{labelFn.label}
								</Button>);
						})}
					</div>
				}
				{/* Live map */}
				{drones.map((drone) =>
					<>
						<ControllerLocationMarker
							key={'CL' + drone.gufi}
							position={drone.controller_location.coordinates}
						/>
						<DroneMarker
							key={drone.gufi}
							id={drone.gufi}
							heading={drone.heading}
							altitude={drone.altitude_gps}
							position={drone.location.coordinates}
							risk={drone.risk}
							onClick={() => setSelectedDrone(S.Just(drone.gufi))}
						/>
					</>
				)}
				{opsFiltered.map((op) => {
					return op.operation_volumes.map((volume) => {
						if (op.gufi !== editId) {
							return <OperationPolygon
								key={op.gufi + '#' + volume.id}
								id={op.gufi + '#' + volume.id}
								isSelected={op.gufi === fM(currentSelectedOperation)}
								latlngs={volume.operation_geography.coordinates}
								state={op.state}
								info={op}
								onClick={() => setSelectedOperation(S.Maybe.Just(op.gufi))}
							/>;
						} else {
							return null;
						}
					});
				})}
				{
					S.map
					((rfv) => {
						if (rfvs.indexOf(rfv.id) !== -1) {
							/* Rfv is selected to be shown */
							return (
								<RestrictedFlightVolume
									key={rfv.comments}
									latlngs={rfv.geography.coordinates}
									name={rfv.comments}
									minAltitude={rfv.min_altitude}
									maxAltitude={rfv.max_altitude}
								/>
							);
						} else {
							return <></>;
						}
					})
					(S.values(state.rfv.list))
				}
				{
					S.map
					((uvr) => {
						return (
							<UASVolumeReservation
								key={uvr.message_id}
								latlngs={uvr.geography.coordinates}
								uvrInfo={uvr}
							/>
						);
					})
					(S.values(state.uvr.list))
				}


				{/* Operation creation or edition */}
				{isEditor && isEditingOperation && S.isJust(mbInfo) && fM(mbInfo).operation_volumes[0].operation_geography.coordinates.map((polygon, index) => {
					return (
						<OperationPolygon
							id={'polygon' + index}
							key={'polygon' + index}
							latlngs={Array.from(polygon)}
							popup={'Volume of operation in construction'}
							operationInfo={{gufi: '', flight_comments: '** Editing **', state: '**EDITOR'}}
							onClick={() => setEditingOperationVolume(S.Maybe.Just(index))}
						/>
					);
				})}
				{isEditor && isEditingOperation && S.isJust(mbInfo) && fM(mbInfo).operation_volumes[0].operation_geography.coordinates.map((polygon, index) => {
					return polygon.map((latlng, index2) => {
						return (
							<OperationEditMarker
								id={'marker' + index2 + 'p' + index}
								key={'marker' + index2 + 'p' + index}
								onDrag={/* istanbul ignore next */ latlng => {
									infoSetters.setCoordinatesOfVolume(0, coords => {
										/* Dragging a marker updates the saved polygon coordinates */
										if (coords.length > 0) {
											const newCoords = coords.slice();
											newCoords[index][index2] = [latlng.lat, latlng.lng];
											return newCoords;
										}
									});
									
								}}
								latlng={latlng}
							/>
						);
					});
				})}
				{/* Simulator */}
				{S.isJust(mode) && fM(mode) === 'simulator' && simPaths.map((path, index) => {
					return /* istanbul ignore next */ path.map((latlng, index2) => {
						return (
							<OperationEditMarker
								index={'D' + index + '->' + index2}
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
							key={'polyline' + index}
							latlngs={path}
						/>
					);
				})}
			</MapMain>
			<RightArea
				forceOpen={
					S.isJust(currentSelectedOperation) ||
					S.isJust(currentSelectedDrone) ||
					isSimulator ||
					isEditor
				}
				onClose={() => {
					setSelectedOperation(S.Nothing);
					setSelectedDrone(S.Nothing);
				}}
			>
				{S.isJust(currentSelectedOperation) &&
				<SelectedOperation gufi={fM(currentSelectedOperation)}/>
				}
				{S.isJust(currentSelectedDrone) &&
				<SelectedDrone gufi={fM(currentSelectedDrone)}/>
				}
				{showStandardRightAreaPanels &&
				<QuickFly
					onClick={quickFlyOnClick}
				/>
				}
				{showStandardRightAreaPanels &&
				<Layers
					filtersSelected={filtersSelected}
					setFiltersSelected={setFiltersSelected}
					idsSelected={idsShowing}
					setIdsSelected={setIdsShowing}
					rfvs={rfvs}
					setRfvsShowing={setRfvs}
					operations={ops}
					disabled={viewId != null}
				/>
				}
				{/* Editor Panels */}
				{	isEditor &&
					isEditingOperation &&
				<>
					<EditorPanel/>
					<OperationInfoEditor
						maybeInfo={mbInfo}
						setters={infoSetters}
						saveOperation={save}
					/>
				</>
				}
				{/* Simulator panels*/}
				{isSimulator &&
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
