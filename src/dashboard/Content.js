import React from 'react';
import {Card, Elevation} from '@blueprintjs/core';

function Content({children}) {
	return(
		<div className="dshContent">
			<Card id="dshContentCont" className="fullHW nooverflow" elevation={Elevation.TWO}>
				{children}
			</Card>
		</div>
	);
}
export default Content;