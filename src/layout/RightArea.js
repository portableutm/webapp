import React, {useEffect, useState} from 'react';
import '../Ades.css';
import {Icon} from '@blueprintjs/core';

function RightArea({forceOpen, onClose, children}) {
	const [isOpened, setOpened] = useState(true);

	useEffect(() => {
		setOpened(forceOpen);
	}, [forceOpen]);

	return (
		<>
			{	!isOpened &&
			<div className='rightAreaOpener' onClick={() => setOpened(true)}>
				<Icon
					icon="chevron-left"
					iconSize={44}
				/>
			</div>
			}
			{	isOpened &&
			<div className='rightArea animated fadeInRight bp3-dark'>
				<>
					<Icon className="rightAreaCloser" icon="cross" 
						onClick={() => {
							setOpened(false);
							onClose();
						}} iconSize={30}/>
					{children}
				</>
			</div>
			}
		</>
	);
}

export default RightArea;