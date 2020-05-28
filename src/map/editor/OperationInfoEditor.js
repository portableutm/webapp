import React from 'react';
/*
    Global
 */

/*
    UI
 */
import {Dialog, FormGroup, InputGroup} from '@blueprintjs/core';
/*
    Helpers
 */
import PropTypes from 'prop-types';
import {Just, maybeToNullable, Maybe} from 'sanctuary';
import _, {maybeShow} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';

function OperationInfoEditor({setOpen, info, setInfo}) {
	const { t, } = useTranslation();
	const editInfo = (property, newInfo) => setInfo((data) => {
		const newData = {...maybeToNullable(data)};
		newData[property] = newInfo;
		return Just(newData);
	});

	const renderInfoDialog = (info, editInfo) => {
		return <div style={{padding: '10px'}}>
			{/* "flight_comments": "Untitled" */}
			<FormGroup
				label={t('editor_oinfo_name')}
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
				label={t('editor_oinfo_flightnumber')}
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
				label={t('editor_oinfo_contact_name')}
				labelFor="contact"
			>
				<InputGroup
					id="contact"
					data-test-id="mapInputEditorContact"
					value={info.contact}
					onChange={(evt) => editInfo('contact', evt.target.value)}
				/>
			</FormGroup>
			{/* "Contact Phone"*/}
			<FormGroup
				label={t('editor_oinfo_contact_phone')}
				labelFor="contact_phone"
			>
				<InputGroup
					id="contact_phone"
					data-test-id="mapInputEditorContactPhone"
					value={info.contact_phone}
					onChange={(evt) => editInfo('contact_phone', evt.target.value)}
				/>
			</FormGroup>
		</div>;
	};

	return (
		<Dialog
			title={t('editor_oinfo_complete')}
			isOpen={true}
			onClose={() => setOpen(false)}
		>
			{maybeShow(info)
			(() => 'No info.')
			(() => renderInfoDialog(_(info),editInfo))
			}
		</Dialog>
	);
}

OperationInfoEditor.propTypes = {
	maybeInfo: PropTypes.instanceOf(Maybe)
};

export default OperationInfoEditor;