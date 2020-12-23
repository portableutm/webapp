import React  from 'react';
import { observer, useAsObservableSource } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import Polyline from './Polyline';
import ParagliderMarker from './ParagliderMarker';

const ParagliderPosition = observer(({ positions, isParagliderSelected }) => {
	const obs = useAsObservableSource({
		allPositions: positions,
		newestPosition: positions[positions.length - 1],
		isParagliderSelected: isParagliderSelected,
	});

	return (
		<>
			{ obs.isParagliderSelected &&
			<Polyline
				latlngs={[obs.allPositions.map(position => position.location)]}
			/>
			}
			<ParagliderMarker
				key={obs.newestPosition.username}
				id={obs.newestPosition.username}
				altitude={obs.newestPosition.altitude_gps}
				position={obs.newestPosition.location}
			/>
		</>
	);
});

export const AllParagliderPositions = observer(() => {
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

	/* useEffect(() => {
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
	}, []); // eslint-disable-line react-hooks/exhaustive-deps */

	return posStore.allParagliderPositions.map((positions) =>
		// Array of array of positions. Each subarray must at least have one element.
		<ParagliderPosition
			key={'paraglider' + positions[0].username}
			positions={positions}
			isDroneSelected={positions[0].username === mapStore.selectedParaglider}
		/>
	);
});