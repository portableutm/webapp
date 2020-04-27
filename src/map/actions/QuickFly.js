import {Icon, Menu, MenuDivider, MenuItem, Popover, Position} from '@blueprintjs/core';
import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

/* Constants */
const quickFlyLocations = [
	{
		name: 'MVD/SUMU: AIC (Ground)',
		cornerNW: {lat: -34.816575, lng: -56.052659},
		cornerSE: {lat: -34.847928, lng: -56.007429}
	},
	{
		name: 'MVD/SUMU: AIC (Approach)',
		cornerNW: {lat: -34.730198, lng: -56.203753},
		cornerSE: {lat: -34.910978, lng: -55.827960}
	},
	{
		name: 'PDP/SULS: Laguna del Sauce (Ground)',
		cornerNW: {lat: -34.839509, lng: -55.135924},
		cornerSE: {lat: -34.873023, lng: -55.053979}
	},
	{
		name: 'Uruguay',
		cornerNW: {lat: -29.754889, lng: -58.773215},
		cornerSE: {lat: -35.149370, lng: -52.615924}
	},
	{
		name: 'DronfiesLabs',
		cornerNW: {lat: -34.903478, lng: -56.163236},
		cornerSE: {lat: -34.917137, lng: -56.146111}
	}
];

const QuickFlyControl = ({onClick}) => {
	const { t,  } = useTranslation();
	return (
		<div>
			<Menu>
				<MenuDivider title={t('map_flyto')}/>
				{	quickFlyLocations.map((location, index) =>
					<MenuItem
						data-test-id={'mapQuickFly' + index}
						key={location.name}
						text={location.name}
						onClick={() => onClick(location)}
					/>
				)
				}
			</Menu>
		</div>
	);
};

const QuickFly = ({onClick}) => {
	//console.log('QuickFly', onClick);
	return (<div data-test-id='mapButtonQuickFly' className='quickFlyButton'>
		<Popover content={<QuickFlyControl onClick={onClick}/>} position={Position.BOTTOM_LEFT}>
			<div className='contextualMenu'>
				<Icon icon='send-to-map' iconSize={44} color='rgb(50,50,50)'/>
			</div>
		</Popover>
	</div>);
};

QuickFly.propTypes = {
	onClick: PropTypes.func.isRequired // Function to be called after clicking in a location
};

export default QuickFly;