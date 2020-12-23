import { useEffect } from 'react';

/* Logic */
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet-hotline';
import { useStore } from 'mobx-store-provider';
import { when, autorun } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import { createLeafletMarkerStore } from '../../models/locals/createLeafletMarkerStore';
import { INACTIVE_TIMEOUT } from '../../consts';


/* Constants */

//const MAX_POINTS_HISTORY = 50;
const PARAGLIDER_GREEN = L.icon({
	iconUrl: require('../../images/paraglider-green.png'),
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -30]
});
const PARAGLIDER_RED = L.icon({
	iconUrl: require('../../images/paraglider-red.png'),
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -30]
});
const PARAGLIDER_BLACK = L.icon({
	iconUrl: require('../../images/paraglider-black.png'),
	iconSize: [30, 30],
	shadowSize: [0, 0],
	iconAnchor: [15, 15],
	shadowAnchor: [0, 0],
	popupAnchor: [0, -15]
});
/*
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
*/

let timer;

function ParagliderMarker({ id, position, altitude, isRogue, onClick }) {

	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));

	const obs = useAsObservableSource({ id, position, altitude, isRogue });
	const markerStore = useLocalStore(createLeafletMarkerStore);

	useEffect(() => {
		// Create marker, add it to map. Remove from map on unmount

		const dispose1 = when(
			// Runs when the map is initialized
			() => mapStore.isInitialized,
			() => {
				const marker = L.marker(position, {
					icon: obs.isRogue ? PARAGLIDER_RED : PARAGLIDER_GREEN
				});

				const markerOnClick = onClick ?
					onClick :
					() => {
						mapStore.setSelectedParaglider(obs.id);
					};

				marker.on('click',
					(evt) =>
						mapStore.executeFunctionInMap(markerOnClick, obs.id, evt));

				marker.on('click',
					(evt) =>
						mapStore.executeFunctionInMap(() => mapStore.setSelectedParaglider(obs.id), obs.id, evt));


				marker.addTo(mapStore.map);
				markerStore.setTooltipClass('tooltipAltitudeDrone');
				markerStore.setMarker(marker);
				markerStore.setInfoText('' + Date.now());
				/* hasToDrawTrail && polyline.addTo(map);
				// Save initialized values

				hasToDrawTrail && setPolyline(S.Just(polyline));
				setPath([position]); */
			}
		);

		autorun(() => {
			if (markerStore.isMarkerInstanced) {
				markerStore.leafletMarker.setLatLng(obs.position);
				markerStore.setInfoText('' + obs.altitude);
				if (timer) clearTimeout(timer);
				markerStore.leafletMarker.setIcon(obs.isRogue ? PARAGLIDER_RED : PARAGLIDER_GREEN);
				timer = setTimeout(() => markerStore.leafletMarker.setIcon(PARAGLIDER_BLACK), INACTIVE_TIMEOUT);
			}
		});

		return () => {
			// Clean when Component unloaded
			dispose1();
			markerStore.leafletMarker.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/*useEffect(() => {
		if (!S.isNothing(marker)) {
			if (timer !== null) clearTimeout(timer);
			const markerGraphic = fM(marker);
			markerGraphic.setIcon(risk === 'EXTREME' ? EXTREME_RISK_DRONE_ICON : risk === 'MEDIUM' ?  MEDIUM_RISK_DRONE_ICON :  LOW_RISK_DRONE_ICON);
			markerGraphic.setRotationAngle(heading - 90.0);
			if (!markerGraphic.getLatLng().equals(position)) {
				// Drone moved
				markerGraphic.setLatLng(position);
				if /* istanbul ignore next *//* (hasToDrawTrail) {
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
	}, [position.location.lat, position.location.lng, heading, altitude]); // eslint-disable-line react-hooks/exhaustive-deps
*/
	return null;
}

ParagliderMarker.propTypes = {
	id: PropTypes.string.isRequired,
	position: PropTypes.shape({
		lat: PropTypes.number.isRequired,
		lng: PropTypes.number.isRequired
	}),
	altitude: PropTypes.number.isRequired
};

export default ParagliderMarker;