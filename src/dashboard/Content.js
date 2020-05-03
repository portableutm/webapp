import React from 'react';
import {Card, Elevation} from '@blueprintjs/core';

function Content({children}) {
	return(
		<div className="dshContent">
			<Card id="dshContentCont" className="dshInsideContent fullHW" elevation={Elevation.TWO}>
				{children}
			</Card>
		</div>
	);
}
export default Content;