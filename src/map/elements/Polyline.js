import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';
import { useStore } from 'mobx-store-provider';
import { useLocalStore, useAsObservableSource } from 'mobx-react';
import { createLeafletPolylineStore } from '../../models/locals/createLeafletPolylineStore';
import { autorun, when } from 'mobx';

/* Global state */

/**
 * @return {null}
 */
function Polyline({ latlngs }) {
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));

	const obs = useAsObservableSource({ latlngs });
	const polylineStore = useLocalStore(createLeafletPolylineStore);


	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const dispose = when(
			() => mapStore.isInitialized,
			() => {
				const poly = new L.Polyline(
					obs.latlngs,
					{
						color: '#0303ff',
						weight: 2,
						lineJoin: 'round',
						dashArray: '4 1'
					}
				);

				poly.addTo(mapStore.map);
				polylineStore.setPolyline(poly);
			});

		const dispose2 = autorun(() => {
			if (polylineStore.isPolylineInstanced) {
				polylineStore.leafletPolyline.setLatLngs(obs.latlngs);
			}
		});

		return () => {
			// Clean-up when unloading component
			dispose();
			dispose2();
			polylineStore.leafletPolyline.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default Polyline;