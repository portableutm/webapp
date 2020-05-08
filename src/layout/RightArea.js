import React, {useState} from 'react';
import '../Ades.css';
import {Button, Icon, Intent} from '@blueprintjs/core';

function RightArea({children}) {
	const [isOpened, setOpened] = useState(true);
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
					<Icon className="rightAreaCloser" icon="cross" onClick={() => setOpened(false)} iconSize={30}/>
					{children}
				</>
			</div>
			}
		</>
	);
}

export default RightArea;