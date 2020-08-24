import React from 'react';
import { Icon } from '@blueprintjs/core';
import styles from './BottomArea.module.css';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';

const BottomArea = () => {
	const { floatingText, isFloatingTextEnabled, hideFloatingText } = useStore(
		'RootStore',
		(store) => ({
			floatingText: store.floatingText,
			isFloatingTextEnabled: store.isFloatingTextEnabled,
			hideFloatingText: store.hideFloatingText
		})
	);
	if ( isFloatingTextEnabled ) {
		return (
			<div className={styles.bottomArea}>
				<div className={styles.bottomAreaInside}>
					<div className={styles.bottomAreaCloser}>
						<Icon
							data-test-id="warning#closer"
							icon="cross"
							iconSize={25}
							onClick={() => hideFloatingText()}
						/>
					</div>
					{floatingText}
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default observer(BottomArea);
