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

function SelectedRfv ({ id }) {
	const { t } = useTranslation('glossary');
	const obs = useAsObservableSource({ id });
	const { rfv } = useStore(
		'RootStore',
		(store) => ({
			rfv: store.rfvStore.rfvs.get(obs.id)
		})
	);

	const info = [
		[t('rfvs.id'), rfv.id],
		[t('rfvs.comments'), rfv.comments],
		[t('rfvs.min_altitude'), rfv.min_altitude],
		[t('rfvs.max_altitude'), rfv.max_altitude],
	];

	return(
		<>
			<SidebarButton
				useCase='SelectedRfv'
				icon='trending-up'
				label={t('rfvs.selected')}
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

export default observer(SelectedRfv);