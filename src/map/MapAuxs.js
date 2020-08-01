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

const initializeLeaflet = () => {
	const leafletLayer = getLeafletLayer(false, L);
	/*L.control
		.zoom({
			position: 'topright'
		})
		.addTo(map.current);*/
	return L.map('adesMapLeaflet', {
		center: [0, 0],
		zoom: 13,
		zoomControl: false,
		worldCopyJump: true,
		layers: [leafletLayer]
	});
};
// TODO: Add copyright information about marker icon
//  <a target="_blank" href="https://icons8.com/icons/set/fighter-jet">Fighter Jet icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//  <a target="_blank" href="https://icons8.com/icons/set/unchecked-radio-button--v1">Unchecked Radio Button icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
/* END LEAFLET INITIALIZATION CODE  */



export {
	initializeLeaflet,
};