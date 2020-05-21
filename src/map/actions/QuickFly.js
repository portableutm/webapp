import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import RightAreaButton from '../RightAreaButton';
import useAdesState from '../../state/AdesState';
import {maybeValues} from '../../libs/SaferSanctuary';
import {FormGroup, InputGroup} from '@blueprintjs/core';

/* Constants */
/*
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
 */

const QuickFly = ({onClick}) => {
	//console.log('QuickFly', onClick);
	const [state, actions] = useAdesState();
	const [isCreating, showCreate] = useState(false);

	const addNewQuickFlyButton = {
		name: '> Add new location',
		special: true,
		onClick: () => showCreate(true)
	};

	const content = [].concat(maybeValues(state.quickFly.list),addNewQuickFlyButton);
	return (
		<>
			{	!isCreating &&
				<RightAreaButton
					useCase='quickFly'
					icon='send-to-map'
					label='QUICK FLY'
					onClick={onClick}
					simpleChildren={true}
				>
					{content}
				</RightAreaButton>
			}
			{	isCreating &&
				<RightAreaButton
					className={'animated flash'}
					useCase='quickFlyNew'
					icon='cog'
					label='New QuickFly'
					forceOpen={true}
					simpleChildren={false}
				>
					<div
						className='rightAreaButtonText'
					>
						<FormGroup
							label="Name"
							inline={true}
							labelFor="qf-name"
							labelInfo="(required)"
						>
							<InputGroup id="qf-name" placeholder="New location" />
						</FormGroup>
					</div>
					<div
						className='rightAreaButtonTextDisabled'
					>
						The position of the new saved location is captured automatically from the current region shown on the map.
					</div>
					<div
						className='rightAreaButtonText'
						onClick={() => {
							actions.quickFly.post(
								{
									name: document.getElementById('qf-name').value,
									cornerNW: state.map.cornerNW,
									cornerSE: state.map.cornerSE,
								},
								(info) => console.log('CreateQuickFly', info),
								(error) => alert(JSON.stringify(error))
							);
							showCreate(false);
						}}
					>
						Save new QuickFly location
					</div>
				</RightAreaButton>
			}
		</>
	);
};

QuickFly.propTypes = {
	onClick: PropTypes.func.isRequired // Function to be called after clicking in a location
};

export default QuickFly;