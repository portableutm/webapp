import React from 'react';

function GenericListLine({children}) {
	return(
		<div className="dshListItemLine">
			<div className="dshListItemLineLeft">
				{children[0]}
			</div>
			<div className="dshListItemLineRight">
				{children[1]}
			</div>
		</div>
	);
}


function GenericList({children}) {
	return(
		<div className="dshList">
			{children}
		</div>
	);
}

export {GenericList as default, GenericListLine};