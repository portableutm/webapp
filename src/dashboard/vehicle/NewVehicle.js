import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, FormGroup, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import useAdesState from '../../state/AdesState';
import { useHistory, useParams } from 'react-router-dom';
import {fM} from '../../libs/SaferSanctuary';
import styles from '../generic/GenericList.module.css';

const Text = ({name, label, description, placeholder = '', ...props}) => (
	<FormGroup
		helperText={description}dsh
		label={label}
		labelFor={'text-' + name}
	>
		<InputGroup
			id={'text-' + name}
			key={'text-' + name}
			placeholder={placeholder}
			disabled={props.disabled}
			intent={props.intent}
		/>
	</FormGroup>
);

function NewVehicle({userId}) {
	const { username } = useParams();
	const { t, } = useTranslation('glossary');
	const history = useHistory();
	const [state, actions] = useAdesState();
	const [isSubmitting, setSubmitting] = useState(false);
	const [tclass, setTClass] = useState('MULTIROTOR');

	useEffect(() => {
		// Only run in mount
		/* Fetch vehicle data if too old, when loading component */
		actions.vehicles.fetchIfOld();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('vehicles.new_vehicle').toUpperCase()}
				</h1>
			</div>
			<Text
				name="nNumber"
				label={t('vehicles.nNumber')}
				description="Vehicle number"
			/>
			<Text
				name="faaNumber"
				label={t('vehicles.faaNumber')}
				placeholder="N707JT"
				description={t('vehicles.faaNumber_desc')}
			/>
			<Text
				name="vehicleName"
				label={t('vehicles.vehicleName')}
				placeholder="Air Force One"
				description="Short descriptive name of the vehicle"
			/>
			<Text
				name="manufacturer"
				label={t('vehicles.manufacturer')}
				placeholder="DJI"
				description="Brand or company that fabricated the vehicle"
			/>
			<Text
				name="model"
				label={t('vehicles.model')}
				placeholder="Phantom 6 Mini"
				description="Model of the vehicle"
			/>
			<RadioGroup
				label={t('vehicles.class')}
				onChange={(evt) => setTClass(evt.currentTarget.value)}
				selectedValue={tclass}
			>
				<Radio label="Multirotor" value="MULTIROTOR" />
				<Radio label="Fixed-wing" value="FIXEDWING" />
			</RadioGroup>
			{/*<Text
				name="accessType"
				label={t('vehicles.accessType')}
				placeholder=""
				disabled={true}
			/>

			<Text
				name="vehicleTypeId"
				label={t('vehicles.vehicleTypeId')}
				placeholder=""
				disabled={true}
			/>
			<Text
				name="org-uuid"
				label={t('vehicles.org-uuid')}
				placeholder=""
				disabled={true}
			/>*/}

			<Text
				name="owner_id"
				label={t('vehicles.owner')}
				placeholder={userId || username}
				disabled={true}
			/>{/*
			<Text
				name="registeredBy"
				label={t('vehicles.registeredBy')}
				placeholder={fM(state.auth.user).username}
				disabled={true}
			/>*/}
			<Button
				fill
				disabled={isSubmitting}
				onClick={() => {
					const vehicle = {
						owner_id: userId || username,
						nNumber: document.getElementById('text-nNumber').value,
						faaNumber: document.getElementById('text-faaNumber').value,
						vehicleName: document.getElementById('text-vehicleName').value,
						manufacturer: document.getElementById('text-manufacturer').value,
						model: document.getElementById('text-model').value,
						'class': tclass,
						accessType: '',
						vehicleTypeId: '',
						'org-uuid': '',
						registeredBy: fM(state.auth.user).username,
					};
					setSubmitting(true);
					actions.vehicles.post(
						vehicle, 
						() => history.push('/dashboard/vehicles'),
						(err) => {actions.warning.setWarning(err); setSubmitting(false);}
					);
				}}
			>
				{t('submit')}
			</Button>
		</>
	);
}

/*
{
	"owner_id": "JudithaStrut",
    "uvin": "32b858dd-8c63-4e99-9a18-6df064cf64cb",
    "nNumber": "",
    "faaNumber": "AW7B64A",
    "vehicleName": "vehicle.name8",
    "manufacturer": "DJI",
    "model": "Phantom 3",
    "class": "FIXEDWING",
    "accessType": "",
    "vehicleTypeId": "",
    "org-uuid": "",
    "registeredBy": "admin"
}
 */

export default NewVehicle;