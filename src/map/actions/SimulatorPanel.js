import React from 'react';
import RightAreaButton from '../RightAreaButton';

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
			<RightAreaButton
				useCase='simdrones'
				icon='airplane'
				label='SIM-Drones'
				simpleChildren={true}
				forceOpen={true}
				onClick={(elem) => onClick(elem.name)}
			>
				{drones}
			</RightAreaButton>
			<RightAreaButton
				useCase='simfunc'
				icon='cog'
				label='SIM-Func'
				simpleChildren={false}
				forceOpen={true}
				onClick={(elem) => onClick(elem.name)}
			>
				<div
					className='rightAreaButtonText'
					onClick={() => newDrone()}
				>
					New drone
				</div>
				<div
					className='rightAreaButtonText'
					onClick={() => startFlying()}
				>
					Start flying
				</div>
				<div
					className='rightAreaButtonText'
					onClick={() => stopFlying()}
				>
					Stop flying
				</div>
			</RightAreaButton>
		</>
	);
};

export default SimulatorPanel;