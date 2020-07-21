/* istanbul ignore file */

import React from 'react';
import SidebarButton from '../SidebarButton';
import useAdesState from '../../state/AdesState';
import S from 'sanctuary';
import {fM} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';
import styles from '../Map.module.css';

function Property({property, value}) {
	return (
		<>
			<div
				className={styles.sidebarSeparator}
			>
				{property}
			</div>
			<div
				data-test-id={'property' + property}
				className={styles.sidebarButtonText}
			>
				{value || '-'}
			</div>
		</>
	);
}

function SelectedDrone ({gufi}) {
	const { t } = useTranslation('glossary');
	const [state, ] = useAdesState(state => state.drones);
	const drone = fM(S.value(gufi)(state.list));
	const info = [
		['ID', drone.gufi],
		[t('positions.latitude'), drone.location.coordinates.lat],
		[t('positions.longitude'), drone.location.coordinates.lng],
		[t('positions.altitude'), drone.altitude_gps],
		[t('positions.heading'), drone.heading]
	];

	return(
		<>
			<SidebarButton
				useCase='SelectedOperation'
				icon='trending-up'
				label='Selected drone'
				simpleChildren={false}
				forceOpen={true}
			>
				{info.map((propvalue) =>
					<Property key={'raop' + propvalue[0]} property={propvalue[0]} value={propvalue[1]} />
				)}
			</SidebarButton>
		</>
	);
}

export default SelectedDrone;