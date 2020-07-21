/* istanbul ignore file */

import React from 'react';
import SidebarButton from '../SidebarButton';
import styles from '../Map.module.css';

const SimulatorPanel = ({paths, onClick, selected, newDrone, startFlying, stopFlying}) => {
	//console.log('QuickFly', onClick);
	const drones = paths.map((path, index) => {
		if (selected === index) {
			return {
				name: 'SELECTED ' + index,
				path: path
			};
		} else {
			return {
				name: index,
				path: path
			};
		}
	});

	return(
		<>
			<SidebarButton
				useCase='simdrones'
				icon='airplane'
				label='SIM-Drones'
				simpleChildren={true}
				forceOpen={true}
				onClick={(elem) => onClick(elem.name)}
			>
				{drones}
			</SidebarButton>
			<SidebarButton
				useCase='simfunc'
				icon='cog'
				label='SIM-Func'
				simpleChildren={false}
				forceOpen={true}
				onClick={(elem) => onClick(elem.name)}
			>
				<div
					className={styles.sidebarButtonText}
					onClick={() => newDrone()}
				>
					New drone
				</div>
				<div
					className={styles.sidebarButtonText}
					onClick={() => startFlying()}
				>
					Start flying
				</div>
				<div
					className={styles.sidebarButtonText}
					onClick={() => stopFlying()}
				>
					Stop flying
				</div>
			</SidebarButton>
		</>
	);
};

export default SimulatorPanel;