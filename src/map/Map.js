import React, { useState, useEffect } from 'react';

import '../Ades.css';

/* Libraries */
//import L from 'leaflet';
import L from '../libs/wise-leaflet-pip';
import '../css/leaflet.css';

//import PropTypes from 'prop-types';
import S from 'sanctuary';
import { useStore } from 'mobx-store-provider';

/* UI */

/* Components */
import Layers from './actions/Layers';
import QuickFly from './actions/QuickFlyControl';
import OperationPolygon from './elements/OperationPolygon';
import OperationInfoEditor from './editor/OperationInfoEditor';
import SelectedOperation from './viewer/SelectedOperation';
import SimulatorPanel from './actions/SimulatorPanel';
import OperationEditMarker from './elements/OperationEditMarker';
import SelectedDrone from './viewer/SelectedDrone';

/* Hooks */
import useOperationFilter from './hooks/useOperationFilter';
import useRfvLogic from './hooks/useRfvLogic';
import useSimulatorLogic from './hooks/useSimulatorLogic';
import useEditorLogic, { editorMode } from './hooks/useEditorLogic';

/* Auxiliaries */
import { initializeLeaflet } from './MapAuxs';

import RightArea from '../layout/RightArea';

import Polyline from './elements/Polyline';
import { fM } from '../libs/SaferSanctuary';
import { useParams } from 'react-router-dom';
import UvrInfoEditor from './editor/UvrInfoEditor';
import { useObserver } from 'mobx-react';
import { autorun, trace } from 'mobx';
import { AllOperationsPolygons } from './elements/AllOperationsPolygons';
import { AllRestrictedFlightVolumes } from './elements/AllRestrictedFlightVolumes';
import { AllUASVolumeReservations } from './elements/AllUASVolumeReservations';
import { AllDronePositions } from './elements/AllDronePositions';



/* Main function */
const Map = ({ mode }) => {
	/* 	It's important to hold a reference to map that survives through the application
		and that is only used after correctly initializing Leaflet. 	*/

	/* State holders and references */
	const { operationStore, mapStore, uvrStore, rfvStore } = useStore(
		'RootStore',
		(store) => ({
			operationStore: store.operationStore,
			mapStore: store.mapStore,
			uvrStore: store.uvrStore,
			rfvStore: store.rfvStore
		}));
	const [drones, setDrones] = useState([]);

	/* Route params */
	const { editId } = useParams();

	/* Editor state */
	const [modeOfEditor, setModeOfEditor] = useState(editorMode.UNKNOWN);
	const [existingInfo, setExistingInfo] = useState(null);
	const [mbInfo, infoSetters, save, { isEditingOperation, isEditingUvr }] = useEditorLogic(modeOfEditor, existingInfo);
	const [, setEditingOperationVolume] = useState(S.Maybe.Nothing);

	useEffect(() => {
		switch (fM(mode)) {
			case 'new-op': {
				setModeOfEditor(editorMode.OPERATION.NEW);
				break;
			}
			case 'edit-op': {
				setModeOfEditor(editorMode.OPERATION.EXISTING);
				setExistingInfo(operationStore.operations.get(editId));
				break;
			}
			case 'new-uvr': {
				setModeOfEditor(editorMode.UVR.NEW);
				break;
			}
			case 'edit-uvr': {
				setModeOfEditor(editorMode.UVR.EXISTING);
				setExistingInfo(uvrStore.uvrs.get(editId));
				break;
			}
			default: {
				setModeOfEditor(editorMode.UNKNOWN);
				break;
			}
		}
	}, [fM(mode)]); // eslint-disable-line react-hooks/exhaustive-deps

	/* Viewer state */
	const [rfvs, setRfvs] = useRfvLogic();
	const [ops, opsFiltered, viewId, filtersSelected, setFiltersSelected, , idsShowing, setIdsShowing] = useOperationFilter();
	const [currentSelectedOperation, setSelectedOperation] = useState(S.Nothing);

	/* Simulator state */
	const [simPaths, setSimPath, simDroneIndex, onSelectSimDrone, addNewDrone, startFlying, stopFlying] = useSimulatorLogic('broken');
	const isSimulator = (S.isJust(mode) && fM(mode) === 'simulator');

	/* 	Drone related logic	 */
	/* useEffect(() => {
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
	}, [state.drones.updated]); // eslint-disable-line react-hooks/exhaustive-deps */

	/*	 Effects 	*/
	// Leaflet map initialization
	useEffect(() => {
		autorun(() => {
			console.log('Initializing map!');
			console.count('Autorun #1 Init map');
			if (!mapStore.isInitialized) {
				const map = initializeLeaflet();
				mapStore.setMapRef(map);
			}
		});
		autorun(() => {
			console.log('Shown operations...', operationStore.shownOperations);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/* useEffect(() => {
		// Each time we visualize another Operation, we clear the feature group not to mix their volumes
		if (viewId != null && opsFiltered.length > 0) {
			opsFiltered.forEach((op) => {
				if (op.gufi === viewId) {
					const polygon = L.polygon(op.operation_volumes[0].operation_geography.coordinates);
					actions.map.setCorners(polygon.getBounds().getNorthWest(), polygon.getBounds().getSouthEast());
				}
			});

		}
	}, [viewId, opsFiltered]); // eslint-disable-line react-hooks/exhaustive-deps */

	useEffect(() => {
		autorun(() => {
			// Change map position if it has changed in the state
			console.count('Autorun #2 Set bounds');
			if (mapStore.isInitialized) {
				const bounds = L.latLngBounds(mapStore.cornerNW, mapStore.cornerSE);
				mapStore.map.fitBounds(bounds);
			}
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/*	Helpers */

	const showStandardRightAreaPanels =
		S.isNothing(currentSelectedOperation) &&
		!mapStore.isDroneSelected &&
		!isEditingOperation &&
		!isEditingUvr;

	console.count('Rendering map');

	return useObserver(() => {
		if (mapStore.isInitialized) {
			return (
				<>
					{/* <Dialog
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
					{state.map.clickSelection.isSelecting &&
					state.map.clickSelection.listIsComplete &&
					<div
						className="mapOnClickChooser animated fadeIn faster"
						style={{left: state.map.clickSelection.x, top: state.map.clickSelection.y}}
					>
						Click on...
						{state.map.clickSelection.listFns.map(labelFn => {
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
					<AllDronePositions />
					<AllOperationsPolygons/>
					<AllRestrictedFlightVolumes/>
					<AllUASVolumeReservations/>

					{/* Operation creation or edition */}
					{isEditingOperation && S.isJust(mbInfo) && fM(mbInfo).operation_volumes[0].operation_geography.coordinates.map((polygon, index) => {
						return (
							<OperationPolygon
								id={'polygon' + index}
								key={'polygon' + index}
								latlngs={Array.from(polygon)}
								popup={'Volume of operation in construction'}
								operationInfo={{ gufi: '', flight_comments: '** Editing **', state: '**EDITOR' }}
								onClick={() => setEditingOperationVolume(S.Maybe.Just(index))}
							/>
						);
					})}
					{isEditingOperation && S.isJust(mbInfo) && fM(mbInfo).operation_volumes[0].operation_geography.coordinates.map((polygon, index) => {
						return polygon.map((latlng, index2) => {
							return (
								<OperationEditMarker
									id={'marker' + index2 + 'p' + index}
									key={'marker' + index2 + 'p' + index + 'l' + polygon.length}
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
									onClick={/* istanbul ignore next */ () => {
										infoSetters.removePointFromPolygon(index2);
									}}
									latlng={latlng}
								/>
							);
						});
					})}
					{/* UVR Edition or creation */}
					{isEditingUvr && S.isJust(mbInfo) && fM(mbInfo).geography.coordinates.map((polygon, index) => {
						return (
							<OperationPolygon
								id={'polygon' + index}
								key={'polygon' + index}
								latlngs={Array.from(polygon)}
								popup={'Volume of operation in construction'}
								operationInfo={{ gufi: '', flight_comments: '** Editing **', state: '**EDITOR' }}
								onClick={() => setEditingOperationVolume(S.Maybe.Just(index))}
							/>
						);
					})}
					{isEditingUvr && S.isJust(mbInfo) && fM(mbInfo).geography.coordinates.map((polygon, index) => {
						return polygon.map((latlng, index2) => {
							return (
								<OperationEditMarker
									id={'marker' + index2 + 'p' + index}
									key={'marker' + index2 + 'p' + index + 'l' + polygon.length}
									onDrag={/* istanbul ignore next */ latlng => {
										infoSetters.setCoordinatesOfUVR(coords => {
											/* Dragging a marker updates the saved polygon coordinates */
											if (coords.length > 0) {
												const newCoords = coords.slice();
												newCoords[index][index2] = [latlng.lat, latlng.lng];
												return newCoords;
											}
										});

									}}
									onClick={/* istanbul ignore next */ () => {
										infoSetters.removePointFromPolygon(index2);
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
					<RightArea
						forceOpen={
							S.isJust(currentSelectedOperation) ||
							mapStore.isDroneSelected ||
							isSimulator ||
							isEditingUvr ||
							isEditingOperation
						}
						onClose={() => {
							setSelectedOperation(S.Nothing);
							if (mapStore.isDroneSelected) mapStore.unsetSelectedDrone();
						}}
					>
						{S.isJust(currentSelectedOperation) &&
						<SelectedOperation gufi={fM(currentSelectedOperation)}/>
						}
						{	mapStore.isDroneSelected &&
						<SelectedDrone gufi={mapStore.selectedDrone}/>
						}
						{showStandardRightAreaPanels &&
						<QuickFly />
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
						{/* Operation Editor Panels */}
						{isEditingOperation &&
						<OperationInfoEditor
							maybeInfo={mbInfo}
							setters={infoSetters}
							saveOperation={save}
						/>
						}
						{/* UVR Editor Panels */}
						{isEditingUvr &&
						<UvrInfoEditor
							maybeInfo={mbInfo}
							setters={infoSetters}
							saveUvr={save}
						/>
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
		} else {
			return null;
		}
	});
};

/*Map.propTypes = {
	mode: PropTypes.oneOf(S.Maybe.Just)
};*/

export default Map;
// Might be useful later:
// https://github.com/Igor-Vladyka/leaflet.motion
// https://openmaptiles.com/downloads/europe/
