/* istanbul ignore file */

import React, {useEffect, useState} from 'react';

/* Libraries */
import {Icon} from '@blueprintjs/core';

/* Internal */
import styles from './RightArea.module.css';
import useAdesState from '../state/AdesState';
import {Information, OperationGoneRogue} from '../entities/Notification/Notification';
import * as classnames from 'classnames';

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
		} else if (commands[0] === 'info') {
			actions.notifications.add(new Information('DEBUG', 'Test test whatever this is a test long text wonderful text' +
				'and is dangerous to think to much of what to talk emergency WARNING ROGUE text oh yeah yeah yeah'));
		} else if (commands[0] === 'rogue') {
			actions.notifications.add(new OperationGoneRogue('DEBUG'));
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
			<div data-test-id="rightAreaOpener" className={styles.opener} onMouseUp={() => {clearInterval(timer); setTimer(null);}} onMouseDown={() => setTimer(setInterval(() => setShowCommandBox(current => !current), 1000))} onClick={() => setOpened(true)}>
				<Icon
					icon="chevron-right"
					iconSize={39}
				/>
			</div>
			{	isOpened &&
			<div className={classnames('bp3-dark', styles.area)}>
				<Icon data-test-id="rightAreaCloser" className={styles.closer} icon="cross"
					  onClick={() => {
						setOpened(false);
						onClose();
					}} iconSize={30}/>
				<div className={styles.inside}>
					{children}
				</div>
			</div>
			}
			{ showCommandBox &&
			<div className={styles.commandBox}>
				<input style={{width: '100%'}} size="20" placeholder="Command box" onChange={(evt) => parseCommand(evt.currentTarget.value)}/>
			</div>
			}
		</>
	);
}

export default RightArea;