import React, { useEffect } from 'react';
import { autorun } from 'mobx';
import { observer, useAsObservableSource } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import ControllerLocationMarker from './ControllerLocationMarker';
import DroneMarker from './DroneMarker';
import Polyline from './Polyline';

const DronePosition = observer(({ positions, isDroneSelected, setDroneSelected }) => {
	const obs = useAsObservableSource({
		allPositions: positions,
		newestPosition: positions[positions.length - 1],
		isDroneSelected: isDroneSelected,
		isControllerPositionShown: positions[0].isControllerLocationSet && isDroneSelected
	});

	return (
		<>
			{ obs.isControllerPositionShown &&
			<ControllerLocationMarker
				key={'CL' + positions[0].gufi}
				position={positions[0].controller_location.coordinates}
			/>
			}
			{ obs.isDroneSelected &&
			<Polyline
				latlngs={[obs.allPositions.map(position => position.location)]}
			/>
			}
			<DroneMarker
				key={obs.newestPosition.gufi}
				id={obs.newestPosition.gufi}
				heading={obs.newestPosition.heading}
				altitude={obs.newestPosition.altitude_gps}
				position={obs.newestPosition.location}
				onClick={() => setDroneSelected()}
			/>
		</>
	);
});

export const AllDronePositions = observer(() => {
	const {
		posStore,
		mapStore
	} = useStore(
		'RootStore',
		(store) => ({
			posStore: store.positionStore,
			mapStore: store.mapStore
		})
	);

	useEffect(() => {
		// When component is mounted, if a drone is selected, auto-pan following its position.
		const dispose = autorun(() => {
			if (mapStore.isDroneSelected) {
				const positions = posStore.positions.get(mapStore.selectedDrone);
				mapStore.panTo(positions[positions.length - 1].location);
			}
		});
		return () => {
			dispose();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return posStore.allPositions.map((dronePositions) =>
		// Array of array of positions. Each subarray must at least have one element.
		<DronePosition
			key={'dronepos' + dronePositions[0].gufi}
			positions={dronePositions}
			isDroneSelected={dronePositions[0].gufi === mapStore.selectedDrone}
			setDroneSelected={() => mapStore.setSelectedDrone(dronePositions[0].gufi)}
		/>
	);
});