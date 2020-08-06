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
			if (evt.currentTarget !== evt.target || store.state.map.nextOnClick.hasChoosen) {
				if (store.state.map.mapRef.current.listens('contextmenu')) {
					alert('handler click');
					// We are in map editor mode, or any mode that uses onClick in the map
					if (store.state.map.nextOnClick.hasChoosen) {
						if (store.state.map.nextOnClick.nextIsMap) {
							alert('haschoosen next is map');
							// Execute map onClick
							evt.stopPropagation();
							const latLngPoint = store.state.map.mapRef.current.containerPointToLatLng(L.point(evt.clientX, evt.clientY));
							store.state.map.mapRef.current.fireEvent('contextmenu', {
								latlng: latLngPoint,
								layerPoint: store.state.map.mapRef.current.latLngToLayerPoint(latLngPoint),
								containerPoint: store.state.map.mapRef.current.latLngToContainerPoint(latLngPoint)
							});
							store.setState({
								map: {
									...store.state.map,
									nextOnClick: {hasChoosen: false, nextIsMap: true}
								}
							});
						} else {
							// Execute map children's onClick
							alert('haschoosen next is not map');
							store.setState({
								map: {
									...store.state.map,
									nextOnClick: {hasChoosen: false, nextIsMap: false}
								}
							});
						}
					} else {
						// Show dialog asking user if they want to click the map or children (polygon...)
						alert('hasnot choosen');
						evt.stopPropagation();
						store.setState({
							map: {
								...store.state.map,
								chooseOnClick: {
									hasToChoose: true, x: evt.clientX, y: evt.clientY, id: evt.target._leaflet_id
								}
							}});
					}
				}
			}
		}, {capture: true});
		store.state.map.mapRef.current.on('click', (evt) => {
			if (store.state.map.chooseOnClick.hasToChoose)
				store.setState({map: {...store.state.map, chooseOnClick: {hasToChoose: false, x: 0, y: 0}}});
			if (!store.state.map.nextOnClick.hasChoosen)
				fn(evt);
		});
		store.state.map.mapRef.current.on('contextmenu', (evt) => {
			if (store.state.map.chooseOnClick.hasToChoose)
				store.setState({map: {...store.state.map, chooseOnClick: {hasToChoose: false, x: 0, y: 0}}});
			fn(evt);
		});
		store.state.map.mapRef.current.on('drag', () => {
			if (store.state.map.chooseOnClick.hasToChoose)
				store.setState({map: {...store.state.map, chooseOnClick: {hasToChoose: false, x: 0, y: 0}}});
		});
	}
};

export const disableMapOnClick = (store) => {
	print(store.state, false, 'MapState disable onClick');
	if (store.state.map.mapRef) {
		store.state.map.mapRef.current.off('click');
		store.state.map.mapRef.current.off('contextmenu');
		store.state.map.mapRef.current.off('drag');
	}
};

export const hasChosenToClickMap = (store) => {
	store.setState({
		map: {
			...store.state.map,
			nextOnClick: {
				hasChoosen: true,
				nextIsMap: true,
			}
		}
	});
	store.state.map.mapRef.current.getContainer().dispatchEvent(new MouseEvent('click', {
		bubbles: false,
		clientX: store.state.map.chooseOnClick.x,
		clientY: store.state.map.chooseOnClick.y,
	}));
	store.setState({
		map: {
			...store.state.map,
			chooseOnClick: {hasToChoose: false, x: 0, y: 0}
		}
	});
};

export const hasChosenToClickObject = (store) => {
	store.setState({
		map: {
			...store.state.map,
			nextOnClick: {
				hasChoosen: true,
				nextIsMap: false,
			}
		}
	});
	console.log('htmlelem', {...L.DomUtil.get(store.state.map.chooseOnClick.id)});
	//L.DomUtil.get(store.state.map.chooseOnClick.id).dispatchEvent(new MouseEvent('click', store.state.map.chooseOnClick.originalEvent));
	store.setState({
		map: {
			...store.state.map,
			chooseOnClick: {hasToChoose: false, x: 0, y: 0}
		}
	});
};