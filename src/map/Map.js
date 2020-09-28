import React, { useEffect } from 'react';

import '../Ades.css';

/* Libraries */
//import L from 'leaflet';
import L from '../libs/wise-leaflet-pip';
import '../css/leaflet.css';

//import PropTypes from 'prop-types';
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
import useSimulatorLogic from './hooks/useSimulatorLogic';

/* Auxiliaries */
import { initializeLeaflet } from './MapAuxs';

import RightArea from '../layout/RightArea';

import Polyline from './elements/Polyline';
import { useParams } from 'react-router-dom';
import UvrInfoEditor from './editor/UvrInfoEditor';
import { useAsObservableSource, observer } from 'mobx-react';
import { autorun } from 'mobx';
import { AllOperationsPolygons } from './elements/AllOperationsPolygons';
import { AllRestrictedFlightVolumes } from './elements/AllRestrictedFlightVolumes';
import { AllUASVolumeReservations } from './elements/AllUASVolumeReservations';
import { AllDronePositions } from './elements/AllDronePositions';
import { Button, Intent } from '@blueprintjs/core';



/* Main function */
const Map = ({ mode }) => {
	const obs = useAsObservableSource({ mode });

	/* State holders and references */
	const { operationStore, mapStore, uvrStore } = useStore(
		'RootStore',
		(store) => ({
			operationStore: store.operationStore,
			mapStore: store.mapStore,
			uvrStore: store.uvrStore,
			rfvStore: store.rfvStore
		}));

	/* Route params */
	const { editId } = useParams();

	/* Editor state */
	//const [mbInfo, infoSetters, save, { isEditingOperation, isEditingUvr }] = useEditorLogic(modeOfEditor, existingInfo);

	/* useEffect(() => {
		switch (fM(mode)) {
			case 'new-op': {
				mapStore.startOperationEditor();
				break;
			}
			case 'edit-op': {
				mapStore.startOperationEditor(operationStore.operations.get(editId));
				break;
			}
			case 'new-uvr': {
				// mapStore.startUvrEditor();
				break;
			}
			case 'edit-uvr': {
				// mapStore.startUvrEditor(uvrStore.uvrs.get(editId));
				break;
			}
			default: {
				mapStore.stopEditor();
				break;
			}
		}
	}, [fM(mode)]); // eslint-disable-line react-hooks/exhaustive-deps */


	/* Simulator state */
	const [simPaths, setSimPath, simDroneIndex, onSelectSimDrone, addNewDrone, startFlying, stopFlying] = useSimulatorLogic('broken');
	const isSimulator = false;

	/*	 Effects 	*/
	// Leaflet map initialization
	useEffect(() => {
		autorun(() => {
			if (!mapStore.isInitialized) {
				const map = initializeLeaflet();
				mapStore.setMapRef(map);
			} else {
				if (obs.mode === 'new-op') {
					mapStore.startOperationEditor();
				} else if (obs.mode === 'edit-op') {
					mapStore.startOperationEditor(operationStore.operations.get(editId));
				} else if (obs.mode === 'new-uvr') {
					mapStore.startUvrEditor();
				} else if (obs.mode === 'edit-uvr') {
					mapStore.startUvrEditor(uvrStore.uvrs.get(editId));
				} else {
					mapStore.stopEditor();
				}
			}
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
			if (mapStore.isInitialized) {
				const bounds = L.latLngBounds(mapStore.cornerNW, mapStore.cornerSE);
				mapStore.map.fitBounds(bounds);
			}
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/*	Helpers */

	console.count('Rendering map');

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
					*/}
				{ 	mapStore.csIsMapOnClickActivated &&
						mapStore.csIsMapOnClickSelectionActivated &&
						mapStore.csIsMapOnClickSelectionFinished &&
					<div
						className="mapOnClickChooser animated fadeIn faster"
						style={{ left: mapStore.csX, top: mapStore.csY }}
					>
						Click on...
						{mapStore.csCapturedFns.map(labelFn => {
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
				{	mapStore.isEditingOperation &&
					<OperationPolygon
						id={'polygoncreation'}
						key={'polygoncreation'}
						latlngs={mapStore.editorOperation.operation_volumes[0].operation_geography.coordinates}
						popup={'Volume of operation in construction'}
						operationInfo={{ gufi: '', flight_comments: '** Editing **', state: '**EDITOR' }}
					/>
				}
				{	mapStore.isEditingOperation &&
						mapStore.editorOperation.operation_volumes[0]
							.operation_geography.coordinates.map((latlng, index) => {
								const length = mapStore.editorOperation.operation_volumes[0]
									.operation_geography.coordinates.length;
								return (
									<OperationEditMarker
										id={'marker' + index + 'l' + length}
										key={'marker' + index + 'l' + length}
										onDrag={/* istanbul ignore next */ latlng => {
											mapStore.editOperationVolumePoint(0, index, latlng.lat, latlng.lng);
										}}
										onClick={/* istanbul ignore next */ () => {
											mapStore.removeOperationVolumePoint(0, index);
										}}
										latlng={latlng}
									/>
								);
							})}
				{/* UVR Edition or creation */}
				{ 	mapStore.isEditingUvr &&
						<OperationPolygon
							id={'polygonconstr'}
							key={'polygonconstr'}
							latlngs={Array.from(mapStore.editorUvr.geography.coordinates)}
							popup={'Volume of operation in construction'}
							operationInfo={{ gufi: '', flight_comments: '** Editing **', state: '**EDITOR' }}
						/>
				}
				{ 	mapStore.isEditingUvr && mapStore.editorUvr.geography.coordinates.map((latlng, index) => {
					const length = mapStore.editorUvr.geography.coordinates.length;
					return (
						<OperationEditMarker
							id={'marker' + index + 'l' + length}
							key={'marker' + index + 'l' + length}
							onDrag={/* istanbul ignore next */ latlng => {
								mapStore.editUvrVolumePoint(index, latlng.lat, latlng.lng);
							}}
							onClick={/* istanbul ignore next */ () => {
								mapStore.removeUvrVolumePoint(index);
							}}
							latlng={latlng}
						/>
					);
				})
				}
				{/* Simulator */}
				{ false && simPaths.map((path, index) => {
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
				{ false && simPaths.map((path, index) => {
					return (
						<Polyline
							key={'polyline' + index}
							latlngs={path}
						/>
					);
				})}
				<RightArea
					forceOpen={
						isSimulator ||
							!mapStore.hasToShowDefaultMapPanels
					}
					onClose={() => {
						if (mapStore.isOperationSelected) mapStore.unsetSelectedOperation();
						if (mapStore.isDroneSelected) mapStore.unsetSelectedDrone();
					}}
				>
					{ 	mapStore.isOperationSelected &&
						<SelectedOperation />
					}
					{	mapStore.isDroneSelected &&
						<SelectedDrone gufi={mapStore.selectedDrone}/>
					}
					{	mapStore.hasToShowDefaultMapPanels &&
						<QuickFly />
					}
					{	mapStore.hasToShowDefaultMapPanels &&
						<Layers />
					}
					{/* Operation Editor Panels */}
					{	mapStore.isEditingOperation &&
						<OperationInfoEditor />
					}
					{/* UVR Editor Panels */}
					{  	mapStore.isEditingUvr &&
						<UvrInfoEditor/>
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
};

/*Map.propTypes = {
	mode: PropTypes.oneOf(S.Maybe.Just)
};*/

export default observer(Map);
// Might be useful later:
// https://github.com/Igor-Vladyka/leaflet.motion
// https://openmaptiles.com/downloads/europe/
