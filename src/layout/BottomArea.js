import React from 'react';
import S from 'sanctuary';
import useAdesState from '../state/AdesState.js';
import {Icon} from '@blueprintjs/core';
import {fM} from '../libs/SaferSanctuary';
import styles from './BottomArea.module.css';

const BottomArea = () => {
	const [warning, actions] = useAdesState(state => state.warning, actions => actions.warning);
	const warningText = fM(warning);
	if (S.isJust(warning)) {
		return (
			<div className={styles.bottomArea}>
				<div className={styles.bottomAreaInside}>
					<div className={styles.bottomAreaCloser}>
						<Icon
							data-test-id="warning#closer"
							icon="cross"
							iconSize={25}
							onClick={() => actions.close()}
						/>
					</div>
					{warningText}
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default BottomArea;
