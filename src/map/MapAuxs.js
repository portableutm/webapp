import L from 'leaflet';

/* LEAFLET INITIALIZATION CODE */
function getLeafletLayer(useGeoServer, L) {
	if (useGeoServer) {
		return L.tileLayer.wms('http://localhost:8080/geoserver/Dronfies/wms?', {
			service: 'WMS',
			version: '1.1.0',
			request: 'GetMap',
			layers: 'Dronfies:HYP_HR_SR_OB_DR',
			srs: 'EPSG:4326'
		});
	} else {
		return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});
	}
}

const initializeLeaflet = (map, mapClick, mapDragEnd, setMapInitialized) => {
	const leafletLayer = getLeafletLayer(false, L);
	map.current = L.map('adesMapLeaflet', {
		zoomControl: false,
		worldCopyJump: true,
		layers: [leafletLayer]
	});
	/*L.control
		.zoom({
			position: 'topright'
		})
		.addTo(map.current);*/
	map.current.on('click', mapClick); // Map clicked outside any element
	map.current.on('moveend', mapDragEnd);
	setMapInitialized(true);
};
// TODO: Add copyright information about marker icon
//  <a target="_blank" href="https://icons8.com/icons/set/fighter-jet">Fighter Jet icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//  <a target="_blank" href="https://icons8.com/icons/set/unchecked-radio-button--v1">Unchecked Radio Button icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
/* END LEAFLET INITIALIZATION CODE  */



export {
	initializeLeaflet,
}