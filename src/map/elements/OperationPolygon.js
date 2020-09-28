import { useEffect } from 'react';

/* Logic */
import L from 'leaflet';

/* Global state */
//import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';
import { autorun, when } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { createLeafletPolygonStore } from '../../models/locals/createLeafletPolygonStore';
import { useAsObservableSource } from 'mobx-react';

/* Internal */

/* Helpers */
function getColorForOperationState(state) {
	switch (state) {
		case 'ACCEPTED':
			return '#001aff';
		case 'PENDING':
			return '#fff300';
		case 'ACTIVATED':
			return '#2dff00';
		case 'ROGUE':
			return '#ff0000';
		default:
			return '#999999';
	}
}

const OperationPolygon = observer(({
	latlngs, /* Data */
	state,
	name,
	gufi, /* Handlers */
	onClick,
	isSelected = false
}) => {
	//const { t, } = useTranslation('glossary');
	const { mapStore } = useStore(
		'RootStore',
		(store) => ({
			mapStore: store.mapStore
		}));
	const polygonStore = useLocalStore(
		source => createLeafletPolygonStore(source),
		{ map: mapStore.map }
	);
	const obs = useAsObservableSource({ state, latlngs, gufi });

	useEffect(() => { // Mount and unmount
		// Initialize Polygon,
		// draw on Map,
		// react to state change
		const dispose1 = when(
			// Runs when the map is initialized
			() => mapStore.isInitialized && obs.latlngs.length > 0,
			() => {
				const polygon = L.polygon(
					obs.latlngs,
					{
						color: '#363535',
						weight: 1,
						fillColor: getColorForOperationState(state),
						fillOpacity: 0.3,
						lineJoin: 'miter'
					}
				);

				const polygonOnClick = onClick ?
					onClick :
					() => mapStore.setSelectedOperation(obs.gufi);
				// By default, clicking an OperationPolygon selects the operation and shows it in the sidebar

				polygon.on('click',
					(evt) =>
						mapStore.executeFunctionInMap(polygonOnClick, name, evt));

				polygon.addTo(mapStore.map);
				polygonStore.setPolygon(polygon);
			}
		);
		const dispose2 = autorun(() => {
			// Runs whenever state is changed
			if (polygonStore.isPolygonInstanced) {
				polygonStore.leafletPolygon.setLatLngs(obs.latlngs);
				polygonStore.leafletPolygon.setStyle({
					fillColor: getColorForOperationState(obs.state)
				});
				if (obs.state === 'ROGUE') {
					polygonStore.leafletPolygon._path.classList.add('polygonRogue');
				} else {
					polygonStore.leafletPolygon._path.classList.remove('polygonRogue');
				}
			}
		});
		return () => {
			// Clean-up when unloading component
			polygonStore.leafletPolygon.remove();
			dispose1();
			dispose2();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/*
	useEffect(() => {
		if (S.isJust(polygon)) {
			if (isSelected) {
				fM(polygon)._path.classList.add('polygonSelected');
			} else {
				fM(polygon)._path.classList.remove('polygonSelected');
			}
		}
	}, [isSelected]); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		// Redraw if the polygon moved or the state changed
		if (S.isJust(polygon)) {
			fM(polygon).setLatLngs(latlngs);
			fM(polygon).setStyle({fillColor: getColorForOperationState(state)});
			if (state === 'ROGUE') {
				fM(polygon)._path.classList.add('polygonRogue');
			} else {
				fM(polygon)._path.classList.remove('polygonRogue');
			}
		}
	}, [latlngs, state]); // eslint-disable-line react-hooks/exhaustive-deps */

	return null;
}
);

export default OperationPolygon;