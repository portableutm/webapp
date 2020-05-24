import {useEffect, useRef, useState} from 'react';

/* Logic */
import S from 'sanctuary';
import L from 'leaflet';

/* Global state */
import {fM} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';
import useAdesState from '../../state/AdesState';

/* Helpers */
function getColorForOperationState(state) {
	switch (state) {
	case 'PROPOSED':
		return '#001aff';
	case 'ACCEPTED':
		return '#fff300';
	case 'ACTIVATED':
		return '#2dff00';
	case 'CLOSED':
		return '#5e5e5e';
	case 'NONCONFORMING':
		return '#ff00c8';
	case 'ROGUE':
		return '#ff0000';
	default:
		return '#dedede';
	}
}

/**
 * @return {null}
 */
function OperationPolygon({map, latlngs, /* Data */ state, info, /* Handlers */ onClick, onClickPopup, isSelected = false}) {
	const { t,  } = useTranslation();
	const [adesState, ] = useAdesState();
	const [polygon, setPolygon] = useState(S.Nothing);
	const onClicksDisabled = useRef(adesState.map.onClicksDisabled);

	useEffect(() => { // Mount and unmount
		// Initialize Polygon, draw on Map
		const polygon = L.polygon(
			latlngs,
			{
				color: '#363535',
				weight: 1,
				fillColor: getColorForOperationState(state),
				fillOpacity: 0.3,
				lineJoin: 'miter'
			}
		);

		onClick && polygon.on('click', (evt) => {
			if (!onClicksDisabled.current) {
				onClick(evt.latlng);
				L.DomEvent.stopPropagation(evt);
			}
		});

		!onClick && onClickPopup && polygon.bindPopup(onClickPopup);
		!onClick && !onClickPopup && polygon.bindPopup(
			'ID <b>' + info.gufi + '</b><br/>' + // ID <b>a20ef8d5-506d-4f54-a981-874f6c8bd4de</b>
			t('operation') + ' <b>' + info.flight_comments + '</b><br/>' + // Operation <b>NAME</b>
			t('state') + ' <b>' + state + '</b><br />' + // State <b>STATE</b>
			t('effective_time_begin') + ' <b>' + new Date(info.operation_volumes[0].effective_time_begin).toLocaleString() + '</b><br/>' + // Start Date&Time
			t('effective_time_end') + ' <b>' + new Date(info.operation_volumes[0].effective_time_end).toLocaleString() + '</b><br/>' + // End Date&Time
			t('max_altitude') + ' <b>' + info.operation_volumes[0].max_altitude + '</b><br/>' + // Max Altitude 999
			t('contact') + ' <b>' + info.contact + '</b><br/>' + // Contact Name Lastname
			t('phone') + ' <b>097431725</b>' // Phone 097431725
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
		onClicksDisabled.current = adesState.map.onClicksDisabled;
	}, [adesState.map.onClicksDisabled]);

	useEffect(() => {
		if (S.isJust(polygon)) {
			if (isSelected) {
				fM(polygon)._path.classList.add('animated');
				fM(polygon)._path.classList.add('flash');
				fM(polygon)._path.classList.add('infinite');
			} else {
				fM(polygon)._path.classList.remove('animated');
				fM(polygon)._path.classList.remove('flash');
				fM(polygon)._path.classList.remove('infinite');
			}
		}
	}, [isSelected]); // eslint-disable-line react-hooks/exhaustive-deps
	
	useEffect(() => {
		// Redraw if the polygon moved or the state changed
		if (S.isJust(polygon)) {
			fM(polygon).setLatLngs(latlngs);
		}
	}, [latlngs, state]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default OperationPolygon;