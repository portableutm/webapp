import React, {useState} from 'react';

import {Button, FormGroup, InputGroup} from '@blueprintjs/core';

import PropTypes from 'prop-types';
import {Just, maybeToNullable, Maybe} from 'sanctuary';
import {useTranslation} from 'react-i18next';
import SidebarButton from '../SidebarButton';
import OperationVolumeInfoEditor from './OperationVolumeInfoEditor';
import styles from '../Map.module.css';
import { useHistory } from 'react-router-dom';
import {fM} from '../../libs/SaferSanctuary';

function OperationInfoEditor({maybeInfo, setInfo, volumeInfo, setVolumeInfo, saveOperation}) {
	const { t, } = useTranslation(['map', 'glossary', 'common']);
	const info = fM(maybeInfo);
	const [isSaving, setSaving] = useState(false);
	const history = useHistory();
	const editInfo = (property, newInfo) => setInfo((data) => {
		const newData = {...maybeToNullable(data)};
		newData[property] = newInfo;
		return Just(newData);
	});


	const saveOperationAndSetSaving = () => {
		setSaving(true);
		saveOperation(() => setSaving(false));
	};

	return (
		<SidebarButton
			useCase='editorSteps'
			icon='flow-linear'
			label={t('editor.operation.complete')}
			simpleChildren={false}
			forceOpen={true}
		>
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('glossary:operations.name')}
				labelInfo={t('common:forms.required')}
				labelFor="name"
			>
				<InputGroup
					id="name"
					data-test-id="map#editor#operation#info#name"
					value={info.name}
					onChange={(evt) => editInfo('name', evt.target.value)}
				/>
			</FormGroup>
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('glossary:operations.owner_editable')}
				labelInfo={t('common:forms.required')}
				labelFor="name"
			>
				<InputGroup
					id="pilot"
					data-test-id="map#editor#operation#info#pilot"
					value={info.owner}
					onChange={(evt) => editInfo('owner', evt.target.value)}
				/>
			</FormGroup>
			{/* "flight_number": "12345678"
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('editor.operation.flightnumber')}
				labelFor="flight_number"
			>
				<InputGroup
					id="flight_number"
					data-test-id="mapInputEditorFlightNumber"
					value={info.flight_number}
					onChange={(evt) => editInfo('flight_number', evt.target.value)}
				/>
			</FormGroup>*/}
			{/* "Contact Name"*/}
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('glossary:operations.contact')}
				labelInfo={t('common:forms.optional')}
				labelFor="contact"
			>
				<InputGroup
					id="contact"
					data-test-id="map#editor#operation#info#contact"
					value={info.contact}
					onChange={(evt) => editInfo('contact', evt.target.value)}
				/>
			</FormGroup>
			{/* "Contact Phone"*/}
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('glossary:operations.phone')}
				labelInfo={t('common:forms.optional')}
				labelFor="contact_phone"
			>
				<InputGroup
					id="contact_phone"
					data-test-id="map#editor#operation#info#contact_phone"
					value={info.contact_phone}
					onChange={(evt) => editInfo('contact_phone', evt.target.value)}
				/>
			</FormGroup>
			{/* "flight_comments": "Untitled" */}
			<FormGroup
				className={styles.sidebarButtonText}
				label={t('glossary:operations.flight_comments')}
				labelInfo={t('common:forms.optional')}
				labelFor="flight_comments"
			>
				<InputGroup
					id="flight_comments"
					data-test-id="map#editor#operation#info#flight_comments"
					value={info.flight_comments}
					onChange={(evt) => editInfo('flight_comments', evt.target.value)}
				/>
			</FormGroup>
			<OperationVolumeInfoEditor
				info={volumeInfo}
				setInfo={setVolumeInfo}
			/>
			<div
				className={styles.sidebarButtonTextRight}
			>
				<Button
					fill
					icon="undo"
					style={{marginRight: '2.5px'}}
					onClick={() => history.push('/')}
				>
					{t('editor.return')}
				</Button>
				<Button
					fill
					icon="floppy-disk"
					style={{marginLeft: '2.5px'}}
					loading={isSaving}
					onClick={() => saveOperationAndSetSaving()}
				>
					{t('editor.finish')}
				</Button>
			</div>
		</SidebarButton>
	);
}

OperationInfoEditor.propTypes = {
	maybeInfo: PropTypes.instanceOf(Maybe)
};

export default OperationInfoEditor;