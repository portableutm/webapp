import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, FormGroup, InputGroup, Radio, RadioGroup} from '@blueprintjs/core';
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';
import { useHistory, useParams } from 'react-router-dom';

function NewVehicle({userId}) {
	const { username } = useParams();
	const { t, } = useTranslation();
	const history = useHistory();
	const [state, actions] = useAdesState();
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [vehicle, setVehicle] = useState({
		owner_id: userId || username,
		nNumber: '',
		faaNumber: '',
		vehicleName: '',
		manufacturer: '',
		model: ' 3',
		'class': 'MULTIROTOR',
		accessType: '',
		vehicleTypeId: '',
		'org-uuid': '',
		registeredBy: 'admin'
	});

	const Text = ({name, label, description, placeholder = '', ...props}) => (
		<FormGroup
			helperText={description}
			label={label}
			labelFor={'text-' + name}
		>
			<InputGroup
				id={'text-' + name}
				placeholder={placeholder}
				disabled={props.disabled}
				intent={props.intent}
				onChange={(evt) => setVehicle(vehicle => {
					vehicle[name] = evt.currentTarget.value;
					return vehicle;
				})}
				value={vehicle[name]}
			/>
		</FormGroup>
	);

	useEffect(() => {
		// Only run in mount
		/* Fetch vehicle data if too old, when loading component */
		actions.vehicles.fetchIfOld();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<div className={error == null ? 'sticky' : 'sticky error animated flash repeat'}>
				<h1>
					{t('dsh_vehicles_new')}
				</h1>
				{ error !== null &&
					<p>
						{error}
					</p>
				}
			</div>
			<Text
				name="nNumber"
				label={t('vehicle_nNumber')}
				description="Vehicle number"
			/>
			<Text
				name="faaNumber"
				label={t('vehicle_faaNumber')}
				placeholder="N707JT"
				description="Legal number assigned by the FAA"
			/>
			<Text
				name="vehicleName"
				label={t('vehicle_vehicleName')}
				placeholder="Air Force One"
				description="Short descriptive name of the vehicle"
			/>
			<Text
				name="manufacturer"
				label={t('vehicle_manufacturer')}
				placeholder="DJI"
				description="Brand or company that fabricated the vehicle"
			/>
			<Text
				name="model"
				label={t('vehicle_model')}
				placeholder="Phantom 6 Mini"
				description="Model of the vehicle"
			/>
			<RadioGroup
				label={t('vehicle_class')}
				onChange={(evt) => setVehicle(vehicle => ({...vehicle, 'class': evt.currentTarget.value}))}
				selectedValue={vehicle.class}
			>
				<Radio label="Multirotor" value="MULTIROTOR" />
				<Radio label="Fixed-wing" value="FIXEDWING" />
			</RadioGroup>
			<Text
				name="accessType"
				label={t('vehicle_accessType')}
				placeholder=""
				disabled={true}
			/>

			<Text
				name="vehicleTypeId"
				label={t('vehicle_vehicleTypeId')}
				placeholder=""
				disabled={true}
			/>
			<Text
				name="org-uuid"
				label={t('vehicle_org-uuid')}
				placeholder=""
				disabled={true}
			/>
			<Text
				name="owner_id"
				label={'Owner username'}
				placeholder=""
				disabled={true}
			/>
			<Text
				name="registeredBy"
				label={t('vehicle_registeredBy')}
				placeholder={fM(state.auth.user).username}
				disabled={true}
			/>
			<Button
				fill
				disabled={isSubmitting}
				onClick={() => {
					setSubmitting(true);
					actions.vehicles.post(
						vehicle, 
						() => history.push('/dashboard/vehicles'),
						(err) => {setError(err); setSubmitting(false);}
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
    "vehicleName": "vehicle_name8",
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