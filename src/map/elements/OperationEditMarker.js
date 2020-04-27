import {useEffect} from 'react';

/* Logic */
import L from 'leaflet';

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
function OperationEditMarker({map, latlng, onDrag}) {
	//const [marker, setMarker] = useState(S.Nothing);

	useEffect(() => { // Mount and unmount
		// Initialize marker
		const marker = L.marker(
			latlng,
			{
				icon: EDIT_POLYGON_ICON,
				draggable: true
			}
		);

		marker.addTo(map);
		marker.on('drag', (evt) => onDrag(evt.latlng));
		//marker.on('dragend', (evt) => onDragEnd(evt));
		//setMarker(S.Just(marker));
		return () => {
			marker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default OperationEditMarker;