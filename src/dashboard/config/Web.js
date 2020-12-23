/* istanbul ignore file */

import React from 'react';
import genericListStyle from '../generic/GenericList.module.css';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { useStore } from 'mobx-store-provider';

const Web = () => {
	const { API, setAPI } = useStore('RootStore', (store) => ({ API: store.API, setAPI: store.setAPI }));
	const { t } = useTranslation('dashboard');

	return (
		<>
			<div className={genericListStyle.header}>
				<h1>
					{t('ades_options.web').toUpperCase()}
				</h1>
			</div>
			<FormGroup
				helperText={t('ades_options.endpoint_helper')}
				label={t('ades_options.endpoint')}
				labelFor={'endpoint'}
			>
				<InputGroup
					id='endpoint'
					key={'endpoint'}
					defaultValue={API}
				/>
			</FormGroup>
			<Button
				fill
				onClick={() => setAPI(document.getElementById('endpoint').value)}
			>
				Save
			</Button>
		</>
	);
};
 
export default Web;