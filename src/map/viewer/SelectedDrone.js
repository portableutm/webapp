/* istanbul ignore file */

import React from 'react';
import SidebarButton from '../SidebarButton';
import { useTranslation } from 'react-i18next';
import styles from '../Map.module.css';
import { useStore } from 'mobx-store-provider';
import { observer, useAsObservableSource } from 'mobx-react';

function Property({ property, value }) {
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

function SelectedDrone ({ gufi }) {
	const { t } = useTranslation('glossary');
	const obs = useAsObservableSource({ gufi });
	const { selectedDrone } = useStore(
		'RootStore',
		(store) => ({
			selectedDrone: store.positionStore.positions.get(obs.gufi).slice(-1)[0] // Newest position report of sel. drone
		})
	);

	const info = [
		['ID', selectedDrone.gufi],
		[t('positions.latitude'), selectedDrone.location.lat],
		[t('positions.longitude'), selectedDrone.location.lng],
		[t('positions.altitude'), selectedDrone.altitude_gps],
		[t('positions.heading'), selectedDrone.heading],
		[t('positions.comments'), selectedDrone.comments]
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

export default observer(SelectedDrone);