import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'mobx-store-provider';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Button, Checkbox, FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import SidebarButton from '../SidebarButton';
import OperationVolumeInfoEditor from './OperationVolumeInfoEditor';
import styles from '../Map.module.css';

const canPilotFlyVehicle = (vehicle, user) => {
	return (vehicle.owner && vehicle.owner.username === user) ||
		(vehicle.operators.length > 0 && _.indexOf(vehicle.operators, user) >= 0);
};

function OperationInfoEditor() {
	const {
		mapStore,
		authStore,
		vehicleStore,
		userStore
	} = useStore('RootStore', store => ({ mapStore: store.mapStore, authStore: store.authStore, userStore: store.userStore, vehicleStore: store.vehicleStore }));
	const { t, } = useTranslation(['map', 'glossary', 'common']);
	const [isSaving, setSaving] = useState(false);
	const history = useHistory();

	const [doesNothingContact, setDoesNothingContact] = useState('');
	const [doesNothingPhone, setDoesNothingPhone] = useState('');
	const [expandedLabel, setExpandedLabel] = useState('');

	const saveOperationAndSetSaving = async () => {
		setSaving(true);
		await mapStore.saveOperation();
		setSaving(false);
		history.push('/');
	};

	useEffect(() => {
		const dispose = autorun(() => {
			if (mapStore.editorOperation.owner !== null) {
				const user = userStore.users.get(mapStore.editorOperation.owner);
				setDoesNothingContact(user.asDisplayString);
				if (user.dinacia_user !== null) {
					if (user.dinacia_user.phone !== null) {
						setDoesNothingPhone(user.dinacia_user.phone);
					} else {
						setDoesNothingPhone(user.dinacia_user.cellphone);
					}

				}
			}
		});
		return () => {dispose();};
	}, []);

	if (mapStore.isEditingOperation) {
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
						className={styles.sidebarButtonTextContentOverflows}
						id="name"
						data-test-id="map#editor#operation#info#name"
						value={mapStore.editorOperation.name}
						onChange={(evt) => mapStore.setOperationInfo('name', evt.target.value)}
					/>
				</FormGroup>
				<FormGroup
					className={styles.sidebarButtonText}
					label={t('glossary:operations.owner_editable')}
					labelInfo={t('common:forms.required')}
					labelFor="pilot"
				>
					{/*<InputGroup
						className={styles.sidebarButtonTextContentOverflows}
						id="pilot"
						data-test-id="map#editor#operation#info#pilot"
						disabled={authStore.role === 'pilot'}
						value={mapStore.editorOperation.owner}
						onChange={(evt) => mapStore.setOperationInfo('owner', evt.target.value)}
					/>*/}
					<HTMLSelect
						id="pilot"
						className={styles.sidebarButtonTextContentOverflows}
						data-test-id="map#editor#operation#info#pilot"
						value={mapStore.editorOperation.owner}
						minimal
						fill
						disabled={authStore.isPilot}
						onChange={(evt) => mapStore.setOperationInfo('owner', evt.currentTarget.value)}
					>
						{	userStore.allUsers.map(user => {
							return (
								<option key={user.username} value={user.username}>{user.asDisplayString}</option>
							);
						})}
					</HTMLSelect>
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
					//labelInfo={t('common:forms.optional')}
					labelFor="contact"
				>
					<InputGroup
						className={styles.sidebarButtonTextContentOverflows}
						id="contact"
						data-test-id="map#editor#operation#info#contact"
						value={doesNothingContact}
						// TODO: Uncomment when this makes sense value={mapStore.editorOperation.contact}
						// TODO: Uncomment when this makes sense onChange={(evt) => mapStore.setOperationInfo('contact', evt.target.value)}
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
						className={styles.sidebarButtonTextContentOverflows}
						id="contact_phone"
						data-test-id="map#editor#operation#info#contact_phone"
						value={doesNothingPhone}
						// TODO: Uncomment when this makes sense value={mapStore.editorOperation.contact_phone}
						// onChange={(evt) => mapStore.setOperationInfo('contact_phone', evt.target.value)}
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
						className={styles.sidebarButtonTextContentOverflows}
						id="flight_comments"
						data-test-id="map#editor#operation#info#flight_comments"
						value={mapStore.editorOperation.flight_comments}
						onChange={(evt) => mapStore.setOperationInfo('flight_comments', evt.target.value)}
					/>
				</FormGroup>
				<FormGroup
					className={styles.sidebarButtonText}
					label={t('glossary:operations.uas_registrations')}
					labelInfo={t('common:forms.optional')}
					labelFor="uas_registrations"
				>
					{ vehicleStore.allVehicles.map((vehicle, index) => {
						if (vehicle && canPilotFlyVehicle(vehicle, mapStore.editorOperation.owner)) {
							return (
								<div
									onMouseEnter={() => setExpandedLabel(vehicle.uvin)}
									onMouseOut ={() => setExpandedLabel('')}
									key={vehicle.uvin}
								>
									<Checkbox
										data-test-id={'map#editor#operation#info#uas_registration#'+index}
										checked={_.includes(mapStore.editorOperation.uas_registrations, vehicle.uvin)}
										label={expandedLabel === vehicle.uvin ? vehicle.asDisplayString : vehicle.asShortDisplayString}
										onChange={(evt) => {
											if (evt.currentTarget.checked) {
												mapStore.addOperationUASRegistration(vehicle.uvin);
											} else {
												mapStore.removeOperationUASRegistration(vehicle.uvin);
											}
										}}
									/>
								</div>
							);
						} else {
							return null;
						}
					})}
				</FormGroup>
				<OperationVolumeInfoEditor />
				<div className={styles.sidebarWarning}>
					<p>{t('editor.expired_permit.title')}</p>
					<p>{t('editor.expired_permit.text')}</p>
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
						onClick={() => saveOperationAndSetSaving()}
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

export default observer(OperationInfoEditor);