import React from 'react';
import genericListStyle from '../generic/GenericList.module.css';
import useAdesState from '../../state/AdesState';
import {useTranslation} from 'react-i18next';
import {Button, FormGroup, InputGroup} from '@blueprintjs/core';

const Web = () => {
	const [state, actions] = useAdesState();
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
					defaultValue={state.api}
				/>
			</FormGroup>
			<Button
				fill
				onClick={() => actions.api(document.getElementById('endpoint').value)}
			>
				Save
			</Button>
		</>
	);
};
 
export default Web;