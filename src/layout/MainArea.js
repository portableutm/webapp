import React from 'react';
import '../Ades.css';


function MainArea({children}) {
	return (
		<div id='main' className='mainArea'>
			{React.Children.only(children)}
		</div>
	);
}
export default MainArea;