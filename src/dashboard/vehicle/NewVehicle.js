import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, FormGroup, InputGroup, Radio, RadioGroup, Intent} from '@blueprintjs/core';
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';
import { useHistory, useParams } from 'react-router-dom';

<<<<<<< Updated upstream
const Text = ({name, label, description, placeholder = '', ...props}) => (
	<FormGroup
		helperText={description}dsh
=======
const Text = ({vehicle, setVehicle, name, label, description, placeholder = '', ...props}) => (
	<FormGroup
		helperText={description}
>>>>>>> Stashed changes
		label={label}
		labelFor={'text-' + name}
	>
		<InputGroup
			id={'text-' + name}
<<<<<<< Updated upstream
			key={'text-' + name}
			placeholder={placeholder}
			disabled={props.disabled}
			intent={props.intent}
=======
			placeholder={placeholder}
			disabled={props.disabled}
			intent={props.intent}
			onChange={
				/*(evt) => setVehicle(
					v => {
						v[name] = evt.currentTarget.value;
						return v;
					}
				)*/
				evt =>{
					let newVehicle = {...vehicle};
					newVehicle[name] = evt.currentTarget.value;
					setVehicle(newVehicle);
				}
			}
			value={vehicle[name]}
>>>>>>> Stashed changes
		/>
	</FormGroup>
);

function NewVehicle({userId}) {
	const { username } = useParams();
	const { t, } = useTranslation();
	const history = useHistory();
	const [state, actions] = useAdesState();
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
<<<<<<< Updated upstream
	const [tclass, setTClass] = useState('MULTIROTOR');
=======
	const [vehicle, setVehicle] = useState({
		owner_id: userId || username,
		nNumber: '',
		faaNumber: '',
		vehicleName: '',
		manufacturer: '',
		model: '',
		'class': 'MULTIROTOR',
		accessType: 'accessType',
		vehicleTypeId: '',
		'org-uuid': '',
		registeredBy: 'admin'
	});
>>>>>>> Stashed changes

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
				vehicle={vehicle}
				setVehicle={setVehicle}
				name="nNumber"
				label={t('vehicle_nNumber')}
				description="Vehicle number"
			/>
			<Text
				vehicle={vehicle}
				setVehicle={setVehicle}
				name="vehicleName"
				label={t('vehicle_vehicleName')}
				placeholder="Air Force One"
				description="Short descriptive name of the vehicle"
			/>
			<Text
				vehicle={vehicle}
				setVehicle={setVehicle}
				name="manufacturer"
				label={t('vehicle_manufacturer')}
				placeholder="DJI"
				description="Brand or company that fabricated the vehicle"
			/>
			<Text
				vehicle={vehicle}
				setVehicle={setVehicle}
				name="model"
				label={t('vehicle_model')}
				placeholder="Phantom 6 Mini"
				description="Model of the vehicle"
			/>
			<RadioGroup
				label={t('vehicle_class')}
				onChange={(evt) => setTClass(evt.currentTarget.value)}
				selectedValue={tclass}
			>
				<Radio label="Multirotor" value="MULTIROTOR" />
				<Radio label="Fixed-wing" value="FIXEDWING" />
			</RadioGroup>
			<Text
				vehicle={vehicle}
				setVehicle={setVehicle}
				name="owner_id"
				label={'Owner username'}
				placeholder={userId || username}
				disabled={true}
			/>
			<Text
				vehicle={vehicle}
				setVehicle={setVehicle}	
				name="registeredBy"
				label={t('vehicle_registeredBy')}
				placeholder={fM(state.auth.user).username}
				disabled={true}
			/>
			<Button
				fill
				disabled={isSubmitting}
				intent={Intent.PRIMARY}
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
						registeredBy: document.getElementById('text-registeredBy').value,
					};
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