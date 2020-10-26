import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, InputGroup, Radio, RadioGroup, Intent } from '@blueprintjs/core';
import styles from '../generic/GenericList.module.css';
import { useStore } from 'mobx-store-provider';
import { BaseVehicle } from '../../models/entities/Vehicle';
import { useLocalStore, useAsObservableSource, observer, useObserver } from 'mobx-react';

const Form = ({ localStore, properties }) => {
	const { t, } = useTranslation('glossary');

	return useObserver(() => {
		return properties.map(property => {
			return (
				<FormGroup
					key={property}
					helperText={t(`vehicles.${property}_desc`)}
					label={t(`vehicles.${property}`)}
					labelFor={'text-' + property}
				>
					<InputGroup
						id={'text-' + property}
						key={'text-' + property}
						value={localStore.vehicle[property]}
						onChange={(evt) => localStore.vehicle.setProperty(property, evt.target.value)}
					/>
				</FormGroup>
			);
		});
	});
};

function NewVehicle({ userId, finish /* Callback when the new vehicle is created, or the go back button is pressed */ }) {
	const { authStore, vehicleStore } = useStore(
		'RootStore',
		(store) => ({ authStore: store.authStore, vehicleStore: store.vehicleStore }));
	const obs = useAsObservableSource({ userId });

	const localStore = useLocalStore(() => ({
		vehicle: BaseVehicle.create({
			nNumber: '',
			faaNumber: '',
			vehicleName: '',
			manufacturer: '',
			model: '',
			'class': 'MULTIROTOR',
			accessType: '',
			vehicleTypeId: '',
			'org-uuid': '',
			registeredBy: authStore.username,
			owner: obs.userId
		})
	}));

	const { t, } = useTranslation('glossary');
	const [isSubmitting, setSubmitting] = useState(false);

	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('vehicles.new_vehicle').toUpperCase()}
				</h1>
			</div>
			<Form
				localStore={localStore}
				properties={[
					'nNumber', 'faaNumber', 'vehicleName', 'manufacturer', 'model', /* 'material',
					'year', 'serial', 'weight', 'payload', 'takeoff', 'sensor_type',
					'wingspan', 'length', 'height', 'color', 'max_speed', 'cruise_speed', 'landing_speed',
					'batterylifemin', 'radiomt', 'ceilingmt', 'controlsystem', 'motortype',
					'fueltype', 'rotortype', 'rotormaterial', 'maintenance', 'remarks', */
					'owner'
				]}
			/>
			<RadioGroup
				label={t('vehicles.class')}
				onChange={(evt) => localStore.vehicle.setProperty('class',evt.currentTarget.value)}
				selectedValue={localStore.vehicle.class}
			>
				<Radio label="Multirotor" value="MULTIROTOR" />
				<Radio label="Fixed-wing" value="FIXEDWING" />
			</RadioGroup>
			<div className={styles.actionArea}>
				<Button
					disabled={isSubmitting}
					style={{ marginRight: '2px' }}
					intent={Intent.PRIMARY}
					onClick={() => {
						finish();
					}}
				>
					{t('go_back')}
				</Button>
				<Button
					disabled={isSubmitting}
					intent={Intent.SUCCESS}
					style={{ marginLeft: '2px' }}
					onClick={async () => {
						setSubmitting(true);
						await vehicleStore.post(localStore.vehicle);
						setSubmitting(false);
						finish();
					}}
				>
					{t('submit')}
				</Button>
			</div>
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

export default observer(NewVehicle);