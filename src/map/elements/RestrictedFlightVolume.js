import {useEffect} from 'react';

/* Logic */
import L from 'leaflet';

/* Global state */
import {useStore} from 'mobx-store-provider';
import {useLocalStore} from 'mobx-react';
import {createLeafletPolygonStore} from '../../models/locals/createLeafletPolygonStore';
import {autorun} from 'mobx';
import {useAsObservableSource} from 'mobx-react';

/* Helpers */

/**
 * @return {null}
 */
function RestrictedFlightVolume({latlngs, name, minAltitude, maxAltitude}) {
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));
	const polygonStore = useLocalStore(
		source => createLeafletPolygonStore(source),
		{map: mapStore.map}
	);
	
	const obs = useAsObservableSource({latlngs});

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const dispose1 = autorun(() => {
			const polygon = L.polygon(
				latlngs,
				{
					color: '#ff0b00',
					weight: 1,
					fillColor: '#ff6161',
					fillOpacity: 0.3,
					lineJoin: 'miter'
				}
			);

			const map = mapStore.map;

			polygon.bindPopup(
				'Restricted Flight Volume </br>' +
			'<b>' + name + '</b>'
			);

			//actions.executeOrAddToClickSelection(t('operations.singular_generic'), () => onClick(evt.latlng));
			polygon.addTo(map);

			const minAltitudeText = minAltitude > 0 ? minAltitude : 'GND';
			polygonStore.setInfo(name, minAltitudeText + '/' + maxAltitude + 'm', 'tooltipAltitudeRFV');
			polygonStore.setPattern(135, '#FF0B00', '15');
			polygonStore.setPolygon(polygon);
		});
		//  Redraw if the polygon moved or the state changed
		const dispose2 = autorun(() => {
			if (polygonStore.isPolygonInstanced) polygonStore.leafletPolygon.setLatLngs(obs.latlngs);
		});
		return () => {
			// Clean-up when unloading component
			polygonStore.leafletPolygon.remove();
			dispose1();
			dispose2();
		};

	}, [polygonStore]);

	return null;
}

export default RestrictedFlightVolume;