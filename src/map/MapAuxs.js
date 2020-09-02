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
	const leafletLayer = getLeafletLayer(false, L);
	/*L.control
		.zoom({
			position: 'topright'
		})
		.addTo(map.current);*/
	const map = L.map('adesMapLeaflet', {
		center: [-34.89719516961728, -56.1633110046386],
		zoom: 11,
		zoomControl: false,
		worldCopyJump: true,
		layers: [leafletLayer]
	});
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