/* istanbul ignore file */

import React, { useEffect, useState } from 'react';
import SidebarButton from '../SidebarButton';
import { useTranslation } from 'react-i18next';
import styles from '../Map.module.css';
import { useStore } from 'mobx-store-provider';
import { observer, useAsObservableSource } from 'mobx-react';
import { autorun } from 'mobx';

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
	const { positionStore, relatedOperation } = useStore(
		'RootStore',
		(store) => ({
			positionStore: store.positionStore,
			relatedOperation: store.operationStore.operations.get(obs.gufi)
		})
	);

	const [info, setInfo] = useState([]);

	useEffect(() => {
		const dispose = autorun(() => {
			const selectedDrone = positionStore.positions.get(obs.gufi);
			if (selectedDrone) {
				const newestPosition = selectedDrone.slice(-1)[0];
				setInfo([
					[t('positions.altitude'), newestPosition.altitude_gps],
					[t('positions.heading'), newestPosition.heading],
					[t('positions.comments'), newestPosition.comments],
					[t('operations.effective_time_begin'), relatedOperation ?
						relatedOperation.operation_volumes[0].effective_time_begin.toLocaleString()
						: 'Error'
					],
					[t('operations.effective_time_end'), relatedOperation ?
						relatedOperation.operation_volumes[0].effective_time_end.toLocaleString()
						: 'Error'
					],
					[t('operations.max_altitude'), relatedOperation ?
						relatedOperation.operation_volumes[0].max_altitude
						: 'Error'
					],
					[t('positions.latitude'), newestPosition.location.lat],
					[t('positions.longitude'), newestPosition.location.lng],
					[t('operations.gufi'), newestPosition.gufi],
				]);
			}
		});
		return () => {
			dispose();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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