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

function SelectedUvr ({ message_id }) {
	const { t } = useTranslation('glossary');
	const obs = useAsObservableSource({ message_id });
	const { uvr } = useStore(
		'RootStore',
		(store) => ({
			uvr: store.uvrStore.uvrs.get(obs.message_id)
		})
	);

	const info = [
		[t('uvrs.message_id'), uvr.message_id],
		[t('uvrs.reason'), uvr.reason],
		[t('uvrs.type'), uvr.type],
		[t('uvrs.cause'), uvr.cause],
		[t('uvrs.effective_time_begin'), uvr.effective_time_begin.toLocaleString()],
		[t('uvrs.effective_time_end'), uvr.effective_time_end.toLocaleString()],
		[t('uvrs.min_altitude'), uvr.min_altitude],
		[t('uvrs.max_altitude'), uvr.max_altitude],
	];

	return(
		<>
			<SidebarButton
				useCase='SelectedRfv'
				icon='trending-up'
				label={t('uvrs.selected')}
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

export default observer(SelectedUvr);