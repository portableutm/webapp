import React from 'react';
import {Card, Elevation} from '@blueprintjs/core';
import styles from './Dashboard.module.css';

function Content({children}) {
	return(
		<div className={styles.content}>
			<Card id="dshContentCont" className={styles.inside} elevation={Elevation.TWO}>
				{children}
			</Card>
		</div>
	);
}
export default Content;