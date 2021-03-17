/* istanbul ignore file */

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
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors. ' +
				'All icons by <a href="icons8.com">Icons8</a>'
		});
		
	}
}

const initializeLeaflet = () => {
	let satellital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});
		const leafletLayer = getLeafletLayer(false, L);
		// const leafletLayer = getLeafletLayer(false, L);

	
	const map = L.map('adesMapLeaflet', {
		center: [-34.89719516961728, -56.1633110046386],
		zoom: 11,
		zoomControl: false,
		worldCopyJump: true,
		layers: [satellital, leafletLayer]
	});
	var baseMaps = {
		"Satelite": satellital,
		"Calles": leafletLayer
	};
	L.control.layers(baseMaps, null).addTo(map);
	map.getPane('tooltipPane').style.visibility = 'hidden';
	map.on('zoomend', function() {
		if (map.getZoom() > 12) {
			map.getPane('tooltipPane').style.visibility = 'visible';
		} else {
			map.getPane('tooltipPane').style.visibility = 'hidden';
		}
	});
	return map;
};

/* END LEAFLET INITIALIZATION CODE  */



export {
	initializeLeaflet,
};