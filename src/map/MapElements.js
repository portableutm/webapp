import React from 'react';
import useAdesState from '../state/AdesState';

function MapMain({children}) {
	const [state,] = useAdesState();
	return (
		<>
			{state.map.isInitialized && children}
			<div data-test-id='map' id='adesMapLeaflet' className='map' style={{height: '100%'}}>
			</div>
		</>
	);
}

export default MapMain;