
import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';
import { useStore } from 'mobx-store-provider';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import { createLeafletMarkerStore } from '../../models/locals/createLeafletMarkerStore';
import { autorun, when } from 'mobx';

/* Constants */
const EDIT_POLYGON_ICON = L.icon({
	iconUrl: require('../../images/polygon-marker.png'),
	iconSize: [24, 24],
	iconAnchor: [12, 12],
	popupAnchor: [-12, 12]
});

/**
 * @return {null}
 */
function OperationEditMarker({ latlng, onDrag, index, onClick }) {
	const { mapStore } = useStore('RootStore',
		(store) => ({
			mapStore: store.mapStore,
		}));


	const obs = useAsObservableSource({ latlng });
	const markerStore = useLocalStore(createLeafletMarkerStore);

	useEffect(() => { // Mount and unmount
		// Initialize marker
		const dispose1 = when(
			// Runs when the map is initialized
			() => mapStore.isInitialized,
			() => {
				const marker = L.marker(
					obs.latlng,
					{
						icon: EDIT_POLYGON_ICON,
						draggable: true
					}
				);

				/* const polyline = L.hotline([], {
					outlineWidth: 0,
					palette: {
						0.0: 'green',
						1.0: 'red'
					},
					min: 0,
					max: MAX_POINTS_HISTORY - 1
				}); */

				onClick && marker.on('click', (evt) => {
					onClick(evt.latlng);
					L.DomEvent.stopPropagation(evt);
				});

				marker.on('drag', (evt) => {
					onDrag(evt.latlng);
				});

				marker.on('dragend', (leafletEvent) => {
					L.DomEvent.stopPropagation(leafletEvent);
				});

				marker.addTo(mapStore.map);
				markerStore.setMarker(marker);

				/* hasToDrawTrail && polyline.addTo(map);
				// Save initialized values

				hasToDrawTrail && setPolyline(S.Just(polyline));
				setPath([position]); */
			}
		);

		autorun(() => {
			if (markerStore.isMarkerInstanced) {
				markerStore.leafletMarker.setLatLng(obs.latlng);
			}
		});

		return () => {
			dispose1();
			markerStore.leafletMarker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default OperationEditMarker;