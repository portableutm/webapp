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
	const { selectedDrone, relatedOperation } = useStore(
		'RootStore',
		(store) => ({
			selectedDrone: store.positionStore.positions.get(obs.gufi).slice(-1)[0], // Newest position report of sel. drone
			relatedOperation: store.operationStore.operations.get(obs.gufi)
		})
	);

	const info = [
		[t('positions.altitude'), selectedDrone.altitude_gps],
		[t('positions.heading'), selectedDrone.heading],
		[t('positions.comments'), selectedDrone.comments],
		[t('operations.effective_time_begin'), relatedOperation.operation_volumes[0].effective_time_begin.toLocaleString()],
		[t('operations.effective_time_end'), relatedOperation.operation_volumes[0].effective_time_end.toLocaleString()],
		[t('operations.max_altitude'), relatedOperation.operation_volumes[0].max_altitude],
		[t('positions.latitude'), selectedDrone.location.lat],
		[t('positions.longitude'), selectedDrone.location.lng],
		[t('operations.gufi'), selectedDrone.gufi],
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