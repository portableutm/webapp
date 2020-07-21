import React from 'react';
import styles from './GenericList.module.css';

function GenericListLine({children}) {
	return(
		<div className={styles.line}>
			<div className={styles.lineLeft}>
				{children[0]}
			</div>
			<div className={styles.lineRight}>
				{children[1]}
			</div>
		</div>
	);
}


function GenericList({children}) {
	return(
		<div className={styles.list}>
			{children}
		</div>
	);
}

export {GenericList as default, GenericListLine};