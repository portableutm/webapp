import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, InputGroup, Intent, FileInput } from '@blueprintjs/core';
import styles from '../generic/GenericList.module.css';
import form from '../generic/LongForm.module.css';
import { useParams, useHistory } from 'react-router-dom';
import { useStore } from 'mobx-store-provider';
import { BaseVehicle } from '../../models/entities/Vehicle';
import { autorun } from 'mobx';
import { useLocalStore, useAsObservableSource, observer, useObserver } from 'mobx-react';
import { DEBUG, ISDINACIA } from '../../consts';
import { BaseDinaciaVehicle } from '../../models/entities/DinaciaVehicle';
import { getSnapshot } from 'mobx-state-tree';



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
						value={localStore.vehicle[property] ? localStore.vehicle[property] : ' '}
						disabled={property === 'owner_id'}
						onChange={(evt) => localStore.vehicle.setProperty(property, evt.target.value)}
					/>
				</FormGroup>
			);
		});
	});
};

const DinaciaVehicleProperties = ({ localStore, properties, isAdmin = false, vehicleExists = false }) => {
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
						disabled={ISDINACIA && !isAdmin && vehicleExists && property === 'caa_registration'} // TODO: No comments...
						value={localStore.vehicle.dinacia_vehicle[property] === null ? '' : localStore.vehicle.dinacia_vehicle[property]}
						onChange={(evt) => localStore.vehicle.setDinaciaProperty(property, evt.target.value)}
					/>
				</FormGroup>
			);
		});
	});
};

function EditVehicle(props) {

	const { vehicleStore, userStore, authStore } = useStore(
		'RootStore',
		(store) => ({ authStore: store.authStore, vehicleStore: store.vehicleStore, userStore: store.userStore }));

	const { username, id } = useParams();
	const [serialNumberFile, setSerialNumberFile] = useState(null);
	const [remoteSensorFile, setRemoteSensorFile] = useState(null);

	const history = useHistory();
	const obs = useAsObservableSource({ userId: props.userId || username });

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
			dinacia_vehicle: ISDINACIA ? BaseDinaciaVehicle.create({ year: `${new Date().getFullYear()}` }) : null,
			operators: [],
			/*registeredBy: authStore.username,*/
			owner_id: obs.userId
		}),
		setVehicle(snapshot) {
			localStore.vehicle = BaseVehicle.create({
				...snapshot,
				owner_id: snapshot.owner ? snapshot.owner.username : authStore.username,
				dinacia_vehicle: snapshot.dinacia_vehicle ? snapshot.dinacia_vehicle : { year: `${new Date().getFullYear()}` }
			});
		}
	}));

	if (DEBUG) window.ev = { ls: localStore, s: serialNumberFile, r: remoteSensorFile };

	useEffect(() => {
		const dispose = autorun(async () => {
			if (ISDINACIA && id && vehicleStore.vehicles.get(id)) {
				const vehicle = vehicleStore.vehicles.get(id);
				console.log('Vehicle is', getSnapshot(vehicle));
				localStore.setVehicle(getSnapshot(vehicle));
				if (vehicle.dinacia_vehicle.serial_number_file_path) {
					// This code is a mess and should be removed
					const response = await fetch(vehicle.dinacia_vehicle.serial_number_file_path);
					const data = await response.blob();
					const metadata = {
						type: 'image/jpeg'
					};
					const file = new File([data], 'serial_number.jpg', metadata);
					localStore.vehicle.setDinaciaProperty('serial_number_file', file);

					setSerialNumberFile(window.URL.createObjectURL(data));
				}
				if (vehicle.dinacia_vehicle.remote_sensor_file_path !== null) {
					// This code is a mess and should be removed
					const response = await fetch(vehicle.remote_sensor_file_path);
					const data = await response.blob();
					const metadata = {
						type: 'image/jpeg'
					};
					const file = new File([data], 'remote_sensor.jpg', metadata);
					localStore.vehicle.setDinaciaProperty('remote_sensor_file', file);

					setRemoteSensorFile(window.URL.createObjectURL(data));
				}
			}
		});
		return () => dispose();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const { t, } = useTranslation(['glossary', 'common']);
	const [isSubmitting, setSubmitting] = useState(false);

	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('vehicles.new_vehicle').toUpperCase()}
				</h1>
			</div>
			<section className={form.grid}>
				<div className={form.col}>
					<h2>{t('glossary:required_fields')}</h2>
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
					{ISDINACIA && localStore.vehicle.dinacia_vehicle &&
					<FormGroup
						label={t('vehicles.serial_number_file')}
						labelFor='serial_number_file'
					>
						<FileInput id='serial_number_file' fill buttonText={t('upload')} inputProps={{ accept: 'image/*' }}
							text={localStore.vehicle.dinacia_vehicle.serial_number_file === null ? t('vehicles.serial_number_file') : localStore.vehicle.dinacia_vehicle.serial_number_file.name}
							onInputChange={(evt) => {
								if (evt.currentTarget.files.length > 0) {
									localStore.vehicle.setDinaciaProperty('serial_number_file', evt.currentTarget.files[0]);
									setSerialNumberFile(window.URL.createObjectURL(evt.currentTarget.files[0]));
								}
							}} />
						{serialNumberFile &&
						<button onClick={() => {
							const win = window.open(serialNumberFile, '_blank');
							win.focus();
						}}>Ver foto actual</button>
						}
					</FormGroup>
					}
				</div>
				{ISDINACIA && localStore.vehicle.dinacia_vehicle &&
					<div className={form.col}>
						<h2>{t('glossary:optional_fields')}</h2>
						<DinaciaVehicleProperties
							localStore={localStore}
							isAdmin={authStore.isAdmin}
							vehicleExists={id && vehicleStore.vehicles.get(id)}
							properties={[
								'caa_registration',
								'usage',
								'construction_material',
								'year',
								'serial_number',
								'remote_sensor_id',
							]}
						/>
						<FormGroup
							label={t('vehicles.remote_sensor_file')}
							labelFor='remote_sensor_file'
						>
							<FileInput id='remote_sensor_file' fill buttonText={t('upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.vehicle.dinacia_vehicle.remote_sensor_file === null ? t('vehicles.remote_sensor_file') : localStore.vehicle.dinacia_vehicle.remote_sensor_file.name}
								onInputChange={(evt) => {
									if (evt.currentTarget.files.length > 0) {
										localStore.vehicle.setDinaciaProperty('remote_sensor_file', evt.currentTarget.files[0]);
										setRemoteSensorFile(window.URL.createObjectURL(evt.currentTarget.files[0]));
									}
								}} />
							{remoteSensorFile &&
							<button onClick={() => {
								const win = window.open(remoteSensorFile, '_blank');
								win.focus();
							}}>Ver foto actual</button>
							}
						</FormGroup>
						{/* <FormGroup
							label={t('glossary:users.remote_sensor_file')}
							labelFor="remote_sensor_file"
						>
							<FileInput id='remote_sensor_file' style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.user.dinacia_user.remote_sensor_file === null ?
									t('glossary:users.remote_sensor_file') :
									localStore.user.dinacia_user.remote_sensor_file.name}
								onInputChange={(evt) =>
									localStore.user.setDinaciaProperty('remote_sensor_file', evt.target.files[0])} />
						</FormGroup> */}
					</div>
				}
			</section>
			{ISDINACIA &&
				<section className={form.grid}>
					<div className={form.col}>
						<h2>{t('glossary:optional_fields')}</h2>
						<DinaciaVehicleProperties
							localStore={localStore}
							properties={[
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
								'radio_accion'
							]}
						/>
					</div>
					<div className={form.col}>
						<h2>{t('glossary:optional_fields')}</h2>
						<DinaciaVehicleProperties
							localStore={localStore}
							properties={[
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

						

					</div>
				</section>
			}
			<section className={form.grid}>
				<div className={form.col}>
					<h3>
						{t('glossary:vehicles.operators')}
					</h3>
					{ authStore.isPilot &&
					<Button
						onClick={() => {
							const username = prompt(t('glossary:add_new_operator_username'));
							localStore.vehicle.addOperator(username);
						}}
					>
						{t('glossary:add_new_operator')}
					</Button>
					}
					{localStore.vehicle.operators.map(operator => {
						return (
							<p key={operator}>{operator}</p>
						);
					})}
				</div>
				<div className={form.col}>
					{ authStore.isAdmin &&
						<ul>
							{userStore.allUsers.map(user => {
								return <Button key={user.username} small style={{ marginBottom: '5px' }} intent={localStore.vehicle.operators.indexOf(user.username) === -1 ? Intent.SUCCESS : Intent.DANGER} icon={localStore.vehicle.operators.indexOf(user.username) === -1 ? 'plus' : 'minus'} onClick={() => {
									if (localStore.vehicle.operators.indexOf(user.username) === -1) {
										localStore.vehicle.addOperator(user.username);
									} else {
										localStore.vehicle.removeOperator(user.username);
									}
								}}
								>{user.asDisplayString}</Button>;
							})}
						</ul>
					}
				</div>
			</section>


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
						history.push(`/dashboard/vehicles/${username ? username : ''}`);
					}}
				>
					{t('go_back')}
				</Button>
				<Button
					id="add_vehicle_btn"
					disabled={isSubmitting}
					intent={Intent.SUCCESS}
					style={{ marginLeft: '2px' }}
					onClick={async () => {
						setSubmitting(true);
						let result;
						if (id) {
							// If the vehicle already exists, we want to update it - we need to send the uvin with the post.
							result = await vehicleStore.post(localStore.vehicle, id);
						} else {
							result = await vehicleStore.post(localStore.vehicle);
						}

						setSubmitting(false);
						if (result && (result.status === 200)) {
							history.push(`/dashboard/vehicles/${username ? username : ''}`);
						}
					}}
				>
					{t('submit')}
				</Button>
			</div>
		</>
	);
}

export default observer(EditVehicle);