import {useEffect, useState} from 'react';

/* Logic */
import S from 'sanctuary';
import L from 'leaflet';

/* Global state */
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';

/* Helpers */

/**
 * @return {null}
 */
function UASVolumeReservation({latlngs, uvrInfo}) {
	const [state, ] = useAdesState();
	const [polygon, setPolygon] = useState(S.Nothing);

	const startDate = (new Date(uvrInfo.effective_time_begin)).toLocaleString();
	const endDate = (new Date(uvrInfo.effective_time_end)).toLocaleString();
	const minAltitude = uvrInfo.min_altitude;
	const maxAltitude = uvrInfo.max_altitude;
	const name = uvrInfo.reason;

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const polygon = L.polygon(
			latlngs,
			{
				color: '#ffae11',
				weight: 2,
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

		// Only use the popup if there's content for the Popup that happens when clicking the
		const map = state.map.mapRef.current;
		polygon.addTo(map);

		setPolygon(S.Just(polygon));
		return () => {
			// Clean-up when unloading component
			polygon.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Redraw if the polygon moved or the state changed
		if (S.isJust(polygon)) {
			fM(polygon).setLatLngs(latlngs);
		}
	}, [latlngs]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const map = state.map.mapRef.current;
		if (map != null) {
			if (S.isJust(polygon)) {
				// Add svg pattern
				const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
				pattern.setAttribute('id', 'uvr');
				pattern.setAttribute('patternUnits', 'userSpaceOnUse');
				pattern.setAttribute('width', '28.5');
				pattern.setAttribute('height', '28.5');
				pattern.setAttribute('patternTransform', 'rotate(135)');

				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				line.setAttribute('x1', '0');
				line.setAttribute('y1', '0');
				line.setAttribute('x2', '0');
				line.setAttribute('y2', '28.5');
				line.setAttribute('stroke', '#ffae11');
				line.setAttribute('stroke-width', '20');
				pattern.appendChild(line);

				const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
				//text.setAttribute('text-anchor', 'middle');
				text.setAttribute('fill', '#6c4503');
				text.setAttribute('font-size', '14');
				textPath.setAttribute('href', '#'+name.replace(/\s/g, ''));
				textPath.setAttribute('side', 'right');
				const textContent = document.createTextNode(minAltitude + 'M/' + maxAltitude + 'M AGL - ' + name);
				textPath.appendChild(textContent);
				text.appendChild(textPath);

				const ovp = map.getPanes().overlayPane.firstChild;
				if (ovp) {
					const defs = ovp.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					defs.appendChild(pattern);
					const g = ovp.querySelector('g');
					g.appendChild(text);
					ovp.insertBefore(defs, ovp.firstChild);
				}


				fM(polygon)._path.setAttribute('id', name.replace(/\s/g, ''));
				fM(polygon)._path.setAttribute('fill', 'url(#uvr)');
			}
		}
	}, [state.map.mapRef.current, polygon]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default UASVolumeReservation;