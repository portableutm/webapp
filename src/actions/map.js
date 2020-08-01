import {print} from '../state/AdesState';
import L from 'leaflet';

export const setCorners = (store, cornerNW, cornerSE) => {
	//console.log('MapState: (BOUND) ', JSON.stringify(cornerNW), JSON.stringify(cornerSE));
	//print(store.state, false, 'MapState', cornerNW, cornerSE);
	store.setState({map: {...store.state.map, cornerNW, cornerSE}});
};

export const addId = (store, id) => {
	const newIds = store.state.map.ids.slice();
	newIds.push(id);
	store.setState({map: {...store.state.map, ids: newIds}});
};

export const removeId = (store, id) => {
	store.setState({map: {...store.state.map, ids: store.state.map.ids.filter(idsaved => idsaved !== id)}});
};

/* Should be called only ONCE - after the map reference has been initalized with a leaflet map */
export const setMapRef = (store, reference) => {
	const cornerNW = reference.current.getBounds().getNorthWest();
	const cornerSE = reference.current.getBounds().getSouthEast();
	store.setState({map: {...store.state.map, cornerNW, cornerSE, mapRef: reference, isInitialized: true}});
};

export const setMapOnClick = (store, fn) => {
	print(store.state, false, 'MapState onClick', fn);
	if (store.state.map.mapRef) {
		store.state.map.mapRef.current.getContainer().addEventListener('click', (evt) => {
			if (evt.currentTarget !== evt.target) {
				let confirmation = window.confirm('Won\'t click polygon!');
				if (confirmation) {
					evt.stopPropagation();
					const latLngPoint = store.state.map.mapRef.current.containerPointToLatLng(L.point(evt.clientX, evt.clientY));
					store.state.map.mapRef.current.fireEvent('click', {
						latlng: latLngPoint,
						layerPoint: store.state.map.mapRef.current.latLngToLayerPoint(latLngPoint),
						containerPoint: store.state.map.mapRef.current.latLngToContainerPoint(latLngPoint)
					});
				}
			}
		}, {capture: true});
		store.state.map.mapRef.current.on('click', (evt) => {
			//if (evt.originalEvent.currentTarget === evt.originalEvent.target) {
			fn(evt);
			///}
		});
		store.state.map.mapRef.current.on('contextmenu', (evt) => {
			fn(evt);
		});
	}
};

export const disableMapOnClick = (store) => {
	print(store.state, false, 'MapState disable onClick');
	if (store.state.map.mapRef) {
		store.state.map.mapRef.current.off('click');
		store.state.map.mapRef.current.off('contextmenu');
	}
};