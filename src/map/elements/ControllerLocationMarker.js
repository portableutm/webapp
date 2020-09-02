import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet-hotline';
import { useStore } from 'mobx-store-provider';
import { useLocalStore } from 'mobx-react';
import { createLeafletMarkerStore } from '../../models/locals/createLeafletMarkerStore';
import { when } from 'mobx';


/* Constants */

const PILOT_ICON = L.icon({
	iconUrl: require('../../images/pilot.png'),
	shadowUrl: require('../../images/marker-shadow.png'), // TODO: Design a shadow for the final icon
	iconSize: [48, 48],
	shadowSize: [0, 0],
	iconAnchor: [24, 24],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -24]
});

/**
 * @return {null}
 */
function ControllerLocationMarker({ position }) {
	const markerStore = useLocalStore(createLeafletMarkerStore);
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));

	useEffect(() => {
		// Create marker, add it to map. Remove from map on unmount
		const dispose1 = when(
			// Runs when the map is initialized
			() => mapStore.isInitialized,
			() => {
				const marker = L.marker(position, {
					icon: PILOT_ICON
				});

				marker.addTo(mapStore.map);
				markerStore.setMarker(marker);
			});


		return () => {
			// Clean when Component unloaded
			dispose1();
			markerStore.leafletMarker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default ControllerLocationMarker;