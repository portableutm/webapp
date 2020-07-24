import {useEffect, useRef, useState} from 'react';

/* Logic */
import S from 'sanctuary';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet-hotline';
import useAdesState from '../../state/AdesState';


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
function ControllerLocationMarker({map, position}) {
	const [, setMarker] = useState(S.Nothing);
	const [state, ] = useAdesState();
	const onClicksDisabled = useRef(state.map.onClicksDisabled);

	useEffect(() => {
		// Create marker, add it to map. Remove from map on unmount
		const marker = L.marker(position, {
			icon: PILOT_ICON
		});

		/*onClick && marker.on('click', (evt) => {
			if (!onClicksDisabled.current) {
				onClick(evt.latlng);
				L.DomEvent.stopPropagation(evt);
			}
		});*/

		marker.addTo(map);
		// Save initialized values
		setMarker(S.Just(marker));

		return () => {
			// Clean when Component unloaded
			marker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onClicksDisabled.current = state.map.onClicksDisabled;
	}, [state.map.onClicksDisabled]);

	return null;
}

export default ControllerLocationMarker;