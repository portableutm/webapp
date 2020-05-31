/* istanbul ignore file */

import React, {useEffect, useState} from 'react';
import '../Ades.css';
import {Icon} from '@blueprintjs/core';
import useAdesState from '../state/AdesState';

function RightArea({forceOpen, onClose, children}) {
	const parseCommand = (value) => {
		const commands = value.split(' ');
		if (commands[0] === 'debug') {
			if (commands[1] === 'on') {
				actions.debug(true);
				setShowCommandBox(false);
			} else if (commands[1] === 'off') {
				actions.debug(false);
				setShowCommandBox(false);
			}
		} else if (commands[0] === 'seterror') {
			if (commands[1] === 'vehicle') {
				actions.vehicles.debugSetError();
				setShowCommandBox(false);
			}
		}
	};

	const [isOpened, setOpened] = useState(true);
	const [, actions] = useAdesState();
	const [timer, setTimer] = useState(null);
	const [showCommandBox, setShowCommandBox] = useState(false);

	useEffect(() => {
		setOpened(forceOpen);
	}, [forceOpen]);

	return (
		<>
			{	!isOpened &&
			<div data-test-id="rightAreaOpener" className='rightAreaOpener' onMouseUp={() => {clearInterval(timer); setTimer(null);}} onMouseDown={() => setTimer(setInterval(() => setShowCommandBox(current => !current), 1000))} onClick={() => setOpened(true)}>
				<Icon
					icon="chevron-right"
					iconSize={44}
				/>
			</div>
			}
			{	isOpened &&
			<div className='rightArea animated fadeInLeft bp3-dark'>
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
			{ showCommandBox &&
			<div className='commandBox'>
				<input style={{width: '100%'}} onChange={(evt) => parseCommand(evt.currentTarget.value)}/>
			</div>
			}
		</>
	);
}

export default RightArea;