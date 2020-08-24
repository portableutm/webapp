import {useEffect} from 'react';

/* Logic */
import L from 'leaflet';

/* Global state */
import {useStore} from 'mobx-store-provider';
import {autorun} from 'mobx';
import {observer, useLocalStore} from 'mobx-react';

/* Internal */
import {createLeafletPolygonStore} from '../../models/locals/createLeafletPolygonStore';


/**
 * @return {null}
 */
const UASVolumeReservation = observer(({latlngs, uvrInfo})  => {
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));
	//const [polygon, setPolygon] = useState(null);
	const polygonStore = useLocalStore(
		source => createLeafletPolygonStore(source),
		{map: mapStore.map}
	);

	const startDate = (new Date(uvrInfo.effective_time_begin)).toLocaleString();
	const endDate = (new Date(uvrInfo.effective_time_end)).toLocaleString();
	const minAltitude = uvrInfo.min_altitude;
	const maxAltitude = uvrInfo.max_altitude;
	const name = uvrInfo.reason;

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const dispose = autorun(() => {
			if (mapStore.isInitialized) {
				const polygon = L.polygon(
					latlngs,
					{
						color: '#ffae11',
						weight: 2,
						dashArray: 4,
						fillColor: '#ffc061',
						fillOpacity: 0.3,
						lineJoin: 'miter'
					}
				);

				polygon.bindPopup(
					'UAS Volume Reservation </br>' +
					'Reason: <b>' + uvrInfo.reason + '</b><br/>' +
					'Starts at: <b>' + startDate + '</b><br/>' +
					'Ends at: <b>' + endDate + '</b>'
				);

				polygon.addTo(mapStore.map);

				const minAltitudeText = minAltitude > 0 ? minAltitude : 'GND';
				polygonStore.setInfo(name, minAltitudeText + '/' + maxAltitude + 'm', 'tooltipAltitudeUVR');
				polygonStore.setPattern(45, '#ffae11', '20');
				polygonStore.setPolygon(polygon);
			}
		});
		return () => {
			// Clean-up when unloading component
			polygonStore.leafletPolygon.remove();
			dispose();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
});

export default UASVolumeReservation;