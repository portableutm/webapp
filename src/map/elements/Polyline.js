import {useEffect, useState} from 'react';

/* Logic */
import S from 'sanctuary';
import L from 'leaflet';

/* Global state */
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';

/**
 * @return {null}
 */
function Polyline({latlngs}) {
	const [polyline, setPolyline] = useState(S.Nothing);
	const [state,] = useAdesState();

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const poly = new L.Polyline(
			latlngs,
			{
				color: '#363535',
				weight: 1,
				lineJoin: 'miter'
			}
		);

		const map = state.map.mapRef.current;
		poly.addTo(map);
		setPolyline(S.Just(poly));
		return () => {
			// Clean-up when unloading component
			poly.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	useEffect(() => {
		// Redraw if the polyline moved or the state changed
		if (S.isJust(polyline)) {
			fM(polyline).setLatLngs(latlngs);
		}
	}, [latlngs]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default Polyline;