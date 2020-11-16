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

function SelectedParaglider ({ username }) {
	const { t } = useTranslation('glossary');
	const obs = useAsObservableSource({ username });
	const { positionStore, userStore } = useStore(
		'RootStore',
		(store) => ({
			positionStore: store.positionStore,
			userStore: store.userStore,
		})
	);

	const [info, setInfo] = useState([]);

	useEffect(() => {
		if (!userStore.hasFetched) userStore.fetchUsers();

		const dispose = autorun(() => {
			const selectedParaglider = positionStore.paraglidersPositions.get(obs.username);
			if (selectedParaglider) {
				const newestPosition = selectedParaglider.slice(-1)[0];
				setInfo([
					[t('paraglider.username'), userStore.users.get(newestPosition.username) ?
						userStore.users.get(newestPosition.username).asDisplayString :
						newestPosition.username
					],
					[t('positions.altitude'), newestPosition.altitude_gps],
					[t('positions.latitude'), newestPosition.location.lat],
					[t('positions.longitude'), newestPosition.location.lng],
					[t('paraglider.time_sent'), newestPosition.time_sent.toLocaleString()],
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
				useCase='SelectedParaglider'
				icon='trending-up'
				label={t('glossary:paraglider.selected')}
				simpleChildren={false}
				forceOpen={true}
			>
				{info.map((propvalue) =>
					<Property key={'selpara' + propvalue[0]} property={propvalue[0]} value={propvalue[1]} />
				)}
			</SidebarButton>
		</>
	);
}

export default observer(SelectedParaglider);