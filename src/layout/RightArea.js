/* istanbul ignore file */

import React, { useEffect, useState } from 'react';

/* Libraries */
import { Icon } from '@blueprintjs/core';

/* Internal */
import styles from './RightArea.module.css';
import * as classnames from 'classnames';

function RightArea({ forceOpen, onClose, children }) {
	const [isOpened, setOpened] = useState(true);

	useEffect(() => {
		setOpened(forceOpen);
	}, [forceOpen]);

	return (
		<>
			<div data-test-id="rightAreaOpener" className={styles.opener} onClick={() => setOpened(true)}>
				<Icon
					icon="chevron-right"
					iconSize={39}
				/>
			</div>
			{	isOpened &&
			<div className={classnames('bp3-dark', styles.area)}>
				<Icon
					data-test-id="rightAreaCloser"
					className={styles.closer}
					icon="cross"
					onClick={() => {
						setOpened(false);
						onClose();
					}} iconSize={30}/>
				<div id="rightAreaInside" className={styles.inside}>
					{children}
				</div>
			</div>
			}
		</>
	);
}

export default RightArea;