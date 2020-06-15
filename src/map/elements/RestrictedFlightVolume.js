import {useEffect, useRef, useState} from 'react';

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
function RestrictedFlightVolume({map, latlngs, name}) {
	const [state, ] = useAdesState();
	const [polygon, setPolygon] = useState(S.Nothing);
	const onClicksDisabled = useRef(state.map.onClicksDisabled);

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
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

		polygon.bindPopup(
			'Restricted Flight Volume </br>' +
			'<b>' + name + '</b>'
		);

		// Only use the popup if there's content for the Popup that happens when clicking the Operation
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
		if (map != null) {
			if (S.isJust(polygon)) {
				// Add svg pattern
				console.log('test');
				const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
				pattern.setAttribute('id', 'stripes');
				pattern.setAttribute('patternUnits', 'userSpaceOnUse');
				pattern.setAttribute('width', '28.5');
				pattern.setAttribute('height', '28.5');
				pattern.setAttribute('patternTransform', 'rotate(45)');

				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				line.setAttribute('x1', '0');
				line.setAttribute('y1', '0');
				line.setAttribute('x2', '0');
				line.setAttribute('y2', '28.5');
				line.setAttribute('stroke', '#FF0B00');
				line.setAttribute('stroke-width', '15');
				pattern.appendChild(line);

				const ovp = map.getPanes().overlayPane.firstChild;
				if (ovp) {
					const defs = ovp.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					defs.appendChild(pattern);
					ovp.insertBefore(defs, ovp.firstChild);
				}

				fM(polygon)._path.setAttribute('fill', 'url(#stripes)');
			}
		}
	}, [map, polygon]);

	useEffect(() => {
		onClicksDisabled.current = state.map.onClicksDisabled;
		if (S.isJust(polygon)) {
			if (onClicksDisabled.current) {
				fM(polygon).unbindPopup();
			} else {
				fM(polygon).bindPopup(
					'Restricted Flight Volume </br>' +
					'<b>' + name + '</b>'
				);
			}
		}
	}, [state.map.onClicksDisabled]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default RestrictedFlightVolume;