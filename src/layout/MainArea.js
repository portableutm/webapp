import React from 'react';
import '../Ades.css';


function MainArea({ leftIsExpanded = false, children }) {
	return (
		<div id='main' className={leftIsExpanded ? 'mainArea mainAreaExpanded' : 'mainArea'}>
			{React.Children.only(children)}
		</div>
	);
}
export default MainArea;