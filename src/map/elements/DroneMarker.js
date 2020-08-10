import {useEffect, useState} from 'react';

/* Logic */
import S from 'sanctuary';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet-hotline';
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';


/* Constants */

const MAX_POINTS_HISTORY = 50;
const MEDIUM_RISK_DRONE_ICON = L.icon({
	iconUrl: require('../../images/marker-icon-red.png'),
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -24]
});
const EXTREME_RISK_DRONE_ICON = L.icon({
	iconUrl: require('../../images/marker-icon-red.png'),
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -24]
});
const LOW_RISK_DRONE_ICON = L.icon({
	iconUrl: require('../../images/marker-icon-green.png'),
	shadowUrl: require('../../images/marker-shadow.png'), // TODO: Design a shadow for the final icon
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -24]
});
const INACTIVE_DRONE_ICON = L.icon({
	iconUrl: require('../../images/marker-icon.png'),
	shadowUrl: require('../../images/marker-shadow.png'), // TODO: Design a shadow for the final icon
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -24]
});
const INACTIVE_TIMEOUT = 60000; // milliseconds
const hasToDrawTrail = false; // TODO: Add this to Options

/* Helpers */
const hasToRemoveOldest = (path) => path.length > MAX_POINTS_HISTORY;


/**
 * @return {null}
 */
function DroneMarker({id, position, heading, altitude, risk, onClick}) {
	const [marker, setMarker] = useState(S.Nothing);
	const [state, ] = useAdesState(state => state.map, actions => actions);
	const [polyline, setPolyline] = useState(S.Nothing);
	const [path, setPath] = useState([]);
	const [timer, setTimer] = useState(null);

	useEffect(() => {
		// Create marker, add it to map. Remove from map on unmount
		const marker = L.marker(position, {
			icon: risk === 'EXTREME' ? EXTREME_RISK_DRONE_ICON : risk === 'MEDIUM' ?  MEDIUM_RISK_DRONE_ICON :  LOW_RISK_DRONE_ICON,
			rotationAngle: heading - 90.0
		});

		const polyline = L.hotline([], {
			outlineWidth: 0,
			palette: {
				0.0: 'green',
				1.0: 'red'
			},
			min: 0,
			max: MAX_POINTS_HISTORY - 1
		});

		onClick && marker.on('dblclick', (evt) => {
			onClick(evt.latlng);
			L.DomEvent.stopPropagation(evt);
		});

		const map = state.mapRef.current;

		marker.addTo(map);
		hasToDrawTrail && polyline.addTo(map);
		// Save initialized values
		setMarker(S.Just(marker));
		hasToDrawTrail && setPolyline(S.Just(polyline));
		setPath([position]);
		return () => {
			// Clean when Component unloaded
			marker.remove();
		};
	}, [state.mapRef]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!S.isNothing(marker)) {
			if (timer !== null) clearTimeout(timer);
			const markerGraphic = fM(marker);
			markerGraphic.setIcon(risk === 'EXTREME' ? EXTREME_RISK_DRONE_ICON : risk === 'MEDIUM' ?  MEDIUM_RISK_DRONE_ICON :  LOW_RISK_DRONE_ICON);
			markerGraphic.setRotationAngle(heading - 90.0);
			if (!markerGraphic.getLatLng().equals(position)) {
				// Drone moved
				markerGraphic.setLatLng(position);
				if /* istanbul ignore next */ (hasToDrawTrail) {
					// Newest values of position are at the start of the array of positions
					path.unshift(position);
					if (hasToRemoveOldest(path)) path.splice(path.length - 1, 1);
					const pathWithZs = path.map((latlng, index) => [latlng.lat, latlng.lng, index]);
					// Construct Array with third value Zindex that represents "freshness" of the data.
					// The higher the Zindex, the darker it will look (older data).
					if (S.isJust(polyline)) fM(polyline).setLatLngs(pathWithZs);
				}
			}
			setTimer(setTimeout(() => markerGraphic.setIcon(INACTIVE_DRONE_ICON), INACTIVE_TIMEOUT)); // Inactivity after INACTIVE_TIMEOUT seconds
		}
	}, [position.lat, position.lng, heading, altitude]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

DroneMarker.propTypes = {
	id: PropTypes.string.isRequired,
	position: PropTypes.shape({
		lat: PropTypes.number.isRequired,
		lng: PropTypes.number.isRequired
	}),
	heading: PropTypes.number.isRequired,
	altitude: PropTypes.number.isRequired,
	risk: PropTypes.string.isRequired
};

export default DroneMarker;