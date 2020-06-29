import React, {useState} from 'react';
import PropTypes from 'prop-types';
import RightAreaButton from '../RightAreaButton';
import useAdesState from '../../state/AdesState';
import {maybeValues} from '../../libs/SaferSanctuary';
import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';

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
	const {t} = useTranslation();
	const [isCreating, showCreate] = useState(false);

	const addNewQuickFlyButton = {
		name: 'Add new location',
		isSpecial: true,
		div: (<div
			key='thisisauniqueone'
			className='rightAreaButtonTextsSeparator'
		>
			<Button
				small={true}
				intent={Intent.PRIMARY}
				onClick={() => showCreate(true)}
			>
				{t('quickfly.add_new')}
			</Button>
		</div>),
	};

	const content = [].concat(maybeValues(state.quickFly.list),addNewQuickFlyButton);
	return (
		<>
			{	!isCreating &&
				<RightAreaButton
					useCase='quickFly'
					icon='send-to-map'
					label={t('quickfly.title').toUpperCase()}
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
					label={t('quickfly.creating_new')}
					icon='cog'
					forceOpen={true}
					simpleChildren={false}
				>
					<div
						className='rightAreaButtonText'
					>
						<FormGroup
							label={t('quickfly.name')}
							inline={true}
							labelFor="qf-name"
							labelInfo={'(' + t('quickfly.required') + ')'}
						>
							<InputGroup data-test-id="mapquickFlyNew" id="qf-name" placeholder={t('quickfly.new_location')} />
						</FormGroup>
					</div>
					<div
						className='rightAreaButtonTextDisabled'
					>
						{t('quickfly.info')}
					</div>
					<div
						className='rightAreaButtonTextsSeparator'
					>
						<Button
							small={true}
							intent={Intent.PRIMARY}
							onClick={() => {
								actions.quickFly.post(
									{
										name: document.getElementById('qf-name').value,
										cornerNW: state.map.cornerNW,
										cornerSE: state.map.cornerSE,
									},
									() => {
										actions.map_dialog.open(t('quickfly.title'), t('quickfly.new_location_created'));
									},
									(error) => {
										actions.map_dialog.open(t('quickfly.title'), 'Error: ' + JSON.stringify(error));
									}
								);
								showCreate(false);
							}}
						>
							{t('quickfly.save')}
						</Button>
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