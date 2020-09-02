import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';
import { useStore } from 'mobx-store-provider';

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
	//const [marker, setMarker] = useState(S.Nothing);
	const { mapStore } = useStore('RootStore',
		(store) => ({
			mapStore: store.mapStore,
		}));

	useEffect(() => { // Mount and unmount
		// Initialize marker
		const marker = L.marker(
			latlng,
			{
				icon: EDIT_POLYGON_ICON,
				draggable: true
			}
		);

		marker.addTo(mapStore.map);
		if (index) {
			marker.bindTooltip('' + index, {
				permanent: true,
				direction: 'right'
			});
		}
		marker.on('drag', (evt) => {
			onDrag(evt.latlng);
			L.DomEvent.stopPropagation(evt);
		});
		marker.on('click', (evt) => {
			onClick();
			L.DomEvent.stopPropagation(evt);
		});
		//marker.on('dragend', (evt) => onDragEnd(evt));
		//setMarker(S.Just(marker));
		return () => {
			marker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default OperationEditMarker;