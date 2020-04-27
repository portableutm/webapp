import React from 'react';

function MapMain({children, map, mapInitialized}) {
	return (
		<>
			{mapInitialized != null && mapInitialized && children}
			<div data-test-id='map' id='adesMapLeaflet' className='map' style={{height: '100%'}}>
			</div>
		</>
	);
}

export default MapMain;