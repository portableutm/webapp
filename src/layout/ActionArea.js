import React from 'react';
import '../Ades.css';

function ActionArea({children}) {
	return(
		<div className='hamburgerButton bp3-dark'>
			{children}
		</div>
	);
}

export default ActionArea;