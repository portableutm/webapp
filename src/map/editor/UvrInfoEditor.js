import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'mobx-store-provider';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { DateInput, TimePrecision } from '@blueprintjs/datetime';

import SidebarButton from '../SidebarButton';
import styles from '../Map.module.css';
import { observer, useObserver, useAsObservableSource } from 'mobx-react';

const Property = ({ propName, required, info, editInfo, t, helperText = '' }) => {
	const obs = useAsObservableSource({ info });
	return useObserver(() => (<FormGroup
		className={styles.sidebarButtonText}
		helperText={helperText}
		label={t('glossary:uvr.' + propName)}
		labelInfo={required ? t('common:forms.required') : t('common:forms.optional')}
		labelFor={propName}
	>
		<InputGroup
			id={propName}
			className={styles.sidebarButtonTextContentOverflows}
			data-test-id={'map#editor#uvr#info#' + propName}
			value={obs.info[propName]}
			onChange={(evt) => editInfo(propName, evt.target.value)}
		/>
	</FormGroup>));
};

function UvrInfoEditor() {
	const { t, } = useTranslation(['map', 'glossary', 'common']);
	const { mapStore } = useStore('RootStore', store => ({ mapStore: store.mapStore, authStore: store.authStore }));
	const [isSaving, setSaving] = useState(false);
	const history = useHistory();

	const saveUvrAndSetSaving = async () => {
		setSaving(true);
		await mapStore.saveUvr();
		setSaving(false);
		history.push('/');
	};
	if (mapStore.isEditingUvr) {
		return (
			<SidebarButton
				useCase='editorSteps'
				icon='flow-linear'
				label={t('editor.uvr.complete')}
				simpleChildren={false}
				forceOpen={true}
			>
				<Property
					propName='reason'
					required={true}
					info={mapStore.editorUvr}
					editInfo={mapStore.setUvrInfo}
					t={t}
				/>
				<Property
					propName='min_altitude'
					required={true}
					info={mapStore.editorUvr}
					editInfo={mapStore.setUvrInfo}
					t={t}
				/>
				<Property
					propName='max_altitude'
					required={true}
					info={mapStore.editorUvr}
					editInfo={mapStore.setUvrInfo}
					t={t}
				/>
				<div className={styles.sidebarButtonText}>
					<p className="centerHorizontally">
						{t('glossary:uvr.effective_time_begin')}
					</p>
					<div data-test-id="map#editor#uvr#info##effective_time_begin">
						<DateInput
							canClearSelection={false}
							minDate={mapStore.editorUvr.effective_time_begin}
							formatDate={date => date.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
							parseDate={str => new Date(str)}
							placeholder="DD/MM/YYYY"
							value={mapStore.editorUvr.effective_time_begin}
							timePrecision={TimePrecision.MINUTE}
							onChange={value => mapStore.setUvrInfo('effective_time_begin', value)}
						/>
					</div>
				</div>
				<div className={styles.sidebarButtonText}>
					<p className="centerHorizontally">
						{t('glossary:uvr.effective_time_end')}
					</p>
					<div data-test-id="map#editor#uvr#info##effective_time_end">
						<DateInput
							canClearSelection={false}
							minDate={mapStore.editorUvr.effective_time_begin}
							formatDate={date => date.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
							parseDate={str => new Date(str)}
							placeholder="DD/MM/YYYY"
							value={mapStore.editorUvr.effective_time_end}
							timePrecision={TimePrecision.MINUTE}
							onChange={value => mapStore.setUvrInfo('effective_time_end', value)}
						/>
					</div>
				</div>
				<div
					className={styles.sidebarButtonTextRight}
				>
					<Button
						fill
						icon="undo"
						style={{ marginRight: '2.5px' }}
						onClick={() => history.push('/')}
					>
						{t('editor.return')}
					</Button>
					<Button
						fill
						icon="floppy-disk"
						style={{ marginLeft: '2.5px' }}
						loading={isSaving}
						onClick={() => saveUvrAndSetSaving()}
					>
						{t('editor.finish')}
					</Button>
				</div>
			</SidebarButton>
		);
	} else {
		return null;
	}
}

export default observer(UvrInfoEditor);