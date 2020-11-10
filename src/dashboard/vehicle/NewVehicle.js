import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, InputGroup, Radio, RadioGroup, Intent, FileInput } from '@blueprintjs/core';
import styles from '../generic/GenericList.module.css';
import { useStore } from 'mobx-store-provider';
import { BaseVehicle } from '../../models/entities/Vehicle';
import { useLocalStore, useAsObservableSource, observer, useObserver } from 'mobx-react';
import { autorun } from 'mobx';
import { ISDINACIA } from '../../consts';
import { BaseDinaciaVehicle } from '../../models/entities/DinaciaVehicle';

const GenericVehicleProperties = ({ localStore, properties }) => {
	const { t, } = useTranslation(['glossary', 'common']);

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

const DinaciaVehicleProperties = ({ localStore, properties }) => {
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
						value={localStore.vehicle.dinacia_vehicle[property] === null ? '' : localStore.vehicle.dinacia_vehicle[property]}
						onChange={(evt) => localStore.vehicle.setDinaciaProperty(property, evt.target.value)}
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
			dinacia_vehicle: BaseDinaciaVehicle.create({}),
			/*registeredBy: authStore.username,*/
			owner_id: obs.userId
		})
	}));

	useEffect(() => {
		autorun(() => {
			console.log(localStore.vehicle.dinacia_vehicle.serial_number_file);
		});
	}, []);

	const { t, } = useTranslation(['glossary', 'common']);
	const [isSubmitting, setSubmitting] = useState(false);

	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('vehicles.new_vehicle').toUpperCase()}
				</h1>
			</div>
			<GenericVehicleProperties
				localStore={localStore}
				properties={
					ISDINACIA ?
						[
							'vehicleName', 'manufacturer', 'model', 'owner_id', 'class'
						]
						:
						[
							'faaNumber', 'nNumber', 'vehicleName', 'manufacturer', 'model', 'owner_id', 'class'
						]
				}
			/>
			{ISDINACIA &&
			<DinaciaVehicleProperties
				localStore={localStore}
				properties={[
					'caa_registration',
					'usage',
					'construction_material',
					'year',
					'serial_number',
					'empty_weight',
					'max_weight',
					'takeoff_method',
					'sensor_type_and_mark',
					'packing',
					'longitude',
					'height',
					'color',
					'max_speed',
					'cruise_speed',
					'landing_speed',
					'time_autonomy',
					'radio_accion',
					'ceiling',
					'communication_control_system_command_navigation_vigilance',
					'maintenance_inspections',
					'remarks',
					'engine_manufacturer',
					'engine_type',
					'engine_model',
					'engine_power',
					'engine_fuel',
					'engine_quantity_batteries',
					'propeller_type',
					'propeller_model',
					'propeller_material'
				]}
			/>
			}
			{ISDINACIA &&
			<FileInput fill buttonText={t('upload')} inputProps={{ accept: 'image/*' }}
					   text={localStore.vehicle.dinacia_vehicle.serial_number_file === null ? t('vehicles.serial_number_file') : localStore.vehicle.dinacia_vehicle.serial_number_file.name}
					   onInputChange={(evt) => localStore.vehicle.setDinaciaProperty('serial_number_file', evt.target.files[0])}/>
			}
			{/*<RadioGroup
				label={t('vehicles.class')}
				onChange={(evt) => localStore.vehicle.setProperty('class',evt.currentTarget.value)}
				selectedValue={localStore.vehicle.class}
			>
				<Radio label="Multirotor" value="MULTIROTOR" />
				<Radio label="Fixed-wing" value="FIXEDWING" />
			</RadioGroup> */}
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