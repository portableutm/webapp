import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';

/* Global state */
import { useStore } from 'mobx-store-provider';
import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

/* Internal */
import { createLeafletPolygonStore } from '../../models/locals/createLeafletPolygonStore';


/**
 * @return {null}
 */
const UASVolumeReservation = observer(({ latlngs, uvrInfo, onClick })  => {
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));
	//const [polygon, setPolygon] = useState(null);
	const polygonStore = useLocalStore(
		source => createLeafletPolygonStore(source),
		{ map: mapStore.map }
	);

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

				const polygonOnClick = onClick ?
					onClick :
					() => mapStore.setSelectedUvr(uvrInfo.message_id);
				// By default, clicking an OperationPolygon selects the operation and shows it in the sidebar

				polygon.on('click',
					(evt) =>
						mapStore.executeFunctionInMap(polygonOnClick, uvrInfo.reason, evt));

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