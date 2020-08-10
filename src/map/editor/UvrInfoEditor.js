import React, {useState} from 'react';

import {Button, FormGroup, InputGroup} from '@blueprintjs/core';

import S from 'sanctuary';
import {useTranslation} from 'react-i18next';
import SidebarButton from '../SidebarButton';
import styles from '../Map.module.css';
import { useHistory } from 'react-router-dom';
import {fM} from '../../libs/SaferSanctuary';
import {DateInput, TimePrecision} from '@blueprintjs/datetime';

const Property = ({propName, required, info, editInfo, t, helperText = ''}) => {
	return (<FormGroup
		className={styles.sidebarButtonText}
		helperText={helperText}
		label={t('glossary:uvr.' + propName)}
		labelInfo={required ? t('common:forms.required') : t('common:forms.optional')}
		labelFor={propName}
	>
		<InputGroup
			id={propName}
			data-test-id={'map#editor#uvr#info#' + propName}
			value={info[propName]}
			onChange={(evt) => editInfo(propName, evt.target.value)}
		/>
	</FormGroup>);
};

function UvrInfoEditor({maybeInfo, setters, saveUvr}) {
	const { t, } = useTranslation(['map', 'glossary', 'common']);
	const [isSaving, setSaving] = useState(false);
	const history = useHistory();

	/* Projections */
	const info = fM(maybeInfo);

	/* Helpers that make the form onChange easier to write */
	const editInfo = (property, newValue) => {
		let partial = {};
		partial[property] = newValue;
		setters.setInfo(partial);
	};

	const saveUvrAndSetSaving = () => {
		setSaving(true);
		saveUvr(() => setSaving(false));
	};
	if (S.isJust(maybeInfo)) {
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
					info={info}
					editInfo={editInfo}
					t={t}
				/>
				<Property
					propName='min_altitude'
					required={true}
					info={info}
					editInfo={editInfo}
					t={t}
				/>
				<Property
					propName='max_altitude'
					required={true}
					info={info}
					editInfo={editInfo}
					t={t}
				/>
				<div className={styles.sidebarButtonText}>
					<p className="centerHorizontally">
						{t('glossary:uvr.effective_time_begin')}
					</p>
					<div data-test-id="map#editor#uvr#info##effective_time_begin">
						<DateInput
							canClearSelection={false}
							minDate={info.effective_time_begin}
							formatDate={date => date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
							parseDate={str => new Date(str)}
							placeholder="DD/MM/YYYY"
							value={info.effective_time_begin}
							timePrecision={TimePrecision.MINUTE}
							onChange={value => editInfo('effective_time_begin', value)}
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
							minDate={info.effective_time_begin}
							formatDate={date => date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
							parseDate={str => new Date(str)}
							placeholder="DD/MM/YYYY"
							value={info.effective_time_end}
							timePrecision={TimePrecision.MINUTE}
							onChange={value => editInfo('effective_time_end', value)}
						/>
					</div>
				</div>
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

export default UvrInfoEditor;