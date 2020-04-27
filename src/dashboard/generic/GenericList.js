import React from 'react';

function GenericListLine({children}) {
	const count = React.Children.count(children);
	if (count !== 2) console.error('GenericListLine called with ' + count + ' children');
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