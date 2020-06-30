import React from 'react';
/*
    Global
 */

/*
    UI
 */
import {Button, Callout, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
/*
    Helpers
 */
import PropTypes from 'prop-types';
import {Just, maybeToNullable, Maybe} from 'sanctuary';
import {useTranslation} from 'react-i18next';
import RightAreaButton from '../RightAreaButton';
import OperationVolumeInfoEditor from './OperationVolumeInfoEditor';

function OperationInfoEditor({info, setInfo, volumeInfo, setVolumeInfo, saveOperation, canSave}) {
	const { t, } = useTranslation();
	const editInfo = (property, newInfo) => setInfo((data) => {
		const newData = {...maybeToNullable(data)};
		newData[property] = newInfo;
		return Just(newData);
	});

	return (
		<RightAreaButton
			useCase='editorSteps'
			icon='flow-linear'
			label={t('editor.operation.complete')}
			simpleChildren={false}
			forceOpen={true}
		>
			{/* "flight_comments": "Untitled" */}
			<FormGroup
				className="rightAreaButtonText"
				label={t('editor.operation.name')}
				labelFor="flight_comments"
			>
				<InputGroup
					id="flight_comments"
					data-test-id="mapInputEditorName"
					value={info.flight_comments}
					onChange={(evt) => editInfo('flight_comments', evt.target.value)}
				/>
			</FormGroup>
			{/* "flight_number": "12345678" */}
			<FormGroup
				className="rightAreaButtonText"
				label={t('editor.operation.flightnumber')}
				labelFor="flight_number"
			>
				<InputGroup
					id="flight_number"
					data-test-id="mapInputEditorFlightNumber"
					value={info.flight_number}
					onChange={(evt) => editInfo('flight_number', evt.target.value)}
				/>
			</FormGroup>
			{/* "Contact Name"*/}
			<FormGroup
				className="rightAreaButtonText"
				label={t('editor.operation.contact_name')}
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
				className="rightAreaButtonText"
				label={t('editor.operation.contact_phone')}
				labelFor="contact_phone"
			>
				<InputGroup
					id="contact_phone"
					data-test-id="map#editor#operation#info#contact_phone"
					value={info.contact_phone}
					onChange={(evt) => editInfo('contact_phone', evt.target.value)}
				/>
			</FormGroup>
			<OperationVolumeInfoEditor
				info={volumeInfo}
				setInfo={setVolumeInfo}
			/>
			{!canSave &&
			<Callout
				intent={Intent.DANGER}
			>
				{t('editor.cant_finish')}
			</Callout>
			}
			<div
				className="rightAreaButtonTextRight"
			>
				<Button
					fill
					disabled={!canSave}
					onClick={() => saveOperation()}
				>
					{t('editor.finish')}
				</Button>
			</div>
		</RightAreaButton>
	);
}

OperationInfoEditor.propTypes = {
	maybeInfo: PropTypes.instanceOf(Maybe)
};

export default OperationInfoEditor;