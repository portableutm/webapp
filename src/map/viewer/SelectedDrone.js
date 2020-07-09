/* istanbul ignore file */

import React from 'react';
import RightAreaButton from '../RightAreaButton';
import useAdesState from '../../state/AdesState';
import S from 'sanctuary';
import {fM} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';

function Property({property, value}) {
	return (
		<>
			<div
				className='rightAreaButtonTextsSeparator'
			>
				{property}
			</div>
			<div
				data-test-id={'property' + property}
				className='rightAreaButtonText'
			>
				{value || '-'}
			</div>
		</>
	);
}

function SelectedDrone ({gufi}) {
	const { t } = useTranslation();
	const [state, ] = useAdesState(state => state.drones);
	const drone = fM(S.value(gufi)(state.list));
	const info = [
		['ID', drone.gufi],
		['Lat', drone.location.coordinates.lat],
		['Lng', drone.location.coordinates.lng],
		[t('altitude'), drone.altitude_gps],
		[t('heading'), drone.heading]
	];

	return(
		<>
			<RightAreaButton
				useCase='SelectedOperation'
				icon='trending-up'
				label='Selected drone'
				simpleChildren={false}
				forceOpen={true}
			>
				{info.map((propvalue) =>
					<Property key={'raop' + propvalue[0]} property={propvalue[0]} value={propvalue[1]} />
				)}
			</RightAreaButton>
		</>
	);
}

export default SelectedDrone;