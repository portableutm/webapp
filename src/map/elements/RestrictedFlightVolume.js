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
function RestrictedFlightVolume({latlngs, name, minAltitude, maxAltitude}) {
	const [state, ] = useAdesState(state => state.map, actions => actions.map);
	const [polygon, setPolygon] = useState(S.Nothing);

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

		const map = state.mapRef.current;

		polygon.bindPopup(
			'Restricted Flight Volume </br>' +
			'<b>' + name + '</b>'
		);

		//actions.executeOrAddToClickSelection(t('operations.singular_generic'), () => onClick(evt.latlng));

		// Only use the popup if there's content for the Popup that happens when clicking the Operation
		polygon.addTo(map);

		setPolygon(S.Just(polygon));
		return () => {
			// Clean-up when unloading component
			polygon.remove();
		};
	}, [state.mapRef]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Redraw if the polygon moved or the state changed
		if (S.isJust(polygon)) {
			fM(polygon).setLatLngs(latlngs);
		}
	}, [latlngs]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const map = state.mapRef.current;
		if (S.isJust(polygon)) {
			// Add svg pattern
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

			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
			//text.setAttribute('text-anchor', 'middle');
			text.setAttribute('fill', 'red');
			text.setAttribute('font-size', '16');
			text.setAttribute('x', '0');
			text.setAttribute('y', '0');
			text.setAttribute('text-anchor', 'middle');
			text.setAttribute('alignment-baseline', 'middle');
			textPath.setAttribute('href', '#'+name.replace(/\s/g, ''));
			textPath.setAttribute('side', 'right');
			const textContent = document.createTextNode(minAltitude + 'M/' + maxAltitude + 'M AGL');
			textPath.appendChild(textContent);
			//text.appendChild(textPath);

			const ovp = map.getPanes().overlayPane.firstChild;
			if (ovp) {
				const defs = ovp.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
				defs.appendChild(pattern);
				const g = ovp.querySelector('g');
				g.appendChild(text);
				ovp.insertBefore(defs, ovp.firstChild);
			}

			fM(polygon)._path.setAttribute('id', name.replace(/\s/g, ''));
			fM(polygon)._path.setAttribute('fill', 'url(#stripes)');

			const minAltitudeText = minAltitude > 0 ? minAltitude : 'GND';
			fM(polygon).bindTooltip(
				minAltitudeText + '/' + maxAltitude + 'm',
				{
					direction: 'center',
					permanent: true,
					interactive: true,
					className: 'tooltipAltitudeRFV'
				}
			).openTooltip();
		}
	}, [polygon]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default RestrictedFlightVolume;