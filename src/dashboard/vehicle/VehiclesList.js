import React, { useEffect, useState } from 'react';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Callout, HTMLSelect, InputGroup, Intent, Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import GenericList, { GenericListLine } from '../generic/GenericList';
import styles from '../generic/GenericList.module.css';
import { ISDINACIA } from '../../consts';

function Vehicle({ v }) {
	const { t,  } = useTranslation(['glossary','common']);
	const [showProperties, setShowProperties] = useState(false);
	const history = useHistory();

	const toggleOperation = (evt) => {
		evt.stopPropagation();
		setShowProperties(show => !show);
	};

	return (
		<Callout
			key={v.faaNumber}
			className={styles.item}
			title={
				<div className={styles.title} onClick={toggleOperation}>
					<p className={styles.titleText}>
						{v.asShortDisplayString}
					</p>
					<Button
						className={styles.button}
						small
						minimal
						icon='menu-open'
						intent={showProperties ? Intent.DANGER : Intent.SUCCESS}
						onClick={toggleOperation}
					>
						<div className={styles.buttonHoveredTooltip}>
							{ showProperties &&
							t('common:click_to_collapse')
							}
							{ !showProperties &&
							t('common:click_to_expand')
							}
						</div>
					</Button>
					<Button
						className={styles.button}
						small
						minimal
						icon='edit'
						intent={Intent.WARNING}
						onClick={(evt) => {evt.stopPropagation(); history.push('/dashboard/vehicles/edit/' + v.uvin);}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('common:edit')}
						</div>
					</Button>
				</div>
			}
			icon="double-chevron-right"
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				<GenericListLine>
					{t('vehicles.uvin')}
					{v.uvin}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.date')}
					{v.date.toLocaleString()}
				</GenericListLine>
				{ !ISDINACIA &&
				<>
					<GenericListLine>
						{t('vehicles.nNumber')}
						{v.nNumber}
					</GenericListLine>
					<GenericListLine>
						{t('vehicles.faaNumber')}
						{v.faaNumber}
					</GenericListLine>
				</>
				}
				<GenericListLine>
					{t('vehicles.name')}
					{v.vehicleName}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.manufacturer')}
					{v.manufacturer}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.model')}
					{v.model}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.class')}
					{v['class']}
				</GenericListLine>
				{/*<GenericListLine>
					{t('vehicles.accessType')}
					{v.accessType}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.vehicleTypeId')}
					{v.vehicleTypeId}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.org-uuid')}
					{v['org-uuid']}
				</GenericListLine>*/}
				{	v.owner && // If undefined, it's your own vehicle
				<GenericListLine>
					{t('vehicles.owner')}
					{v.owner.asDisplayString}
				</GenericListLine>
				}
				{	v.registeredBy && // If undefined, it's your own vehicle. This should still be not undefined, but...
				<GenericListLine>
					{t('vehicles.registeredBy')}
					{v.registeredBy.asDisplayString}
				</GenericListLine>
				}
				{ 	ISDINACIA &&
				v.dinacia_vehicle !== null &&
				['caa_registration',
					'usage',
					'construction_material',
					'year',
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
					'remote_sensor_id',
					'engine_type',
					'engine_model',
					'engine_power',
					'engine_fuel',
					'engine_quantity_batteries',
					'propeller_type',
					'propeller_model',
					'propeller_material'
				].map((dinaciaProp) => {
					if (v.dinacia_vehicle[dinaciaProp] !== null) {
						return <GenericListLine key={dinaciaProp}>
							{t(`vehicles.${dinaciaProp}`)}
							{v.dinacia_vehicle[dinaciaProp]}
						</GenericListLine>;
					} else {
						return null;
					}
				})
				}
				{	ISDINACIA && v.operators &&
				v.operators.map(operator => {
					return <GenericListLine key={operator}>
						{t('vehicles.operator')}
						{operator}
					</GenericListLine>;
				})
				}
				{	ISDINACIA && v.dinacia_vehicle && v.dinacia_vehicle.serial_number_file_path !== null &&
				<GenericListLine>
					<p>{t('vehicles.serial_number_file')}</p>
					<button onClick={() => {
						const win = window.open(v.dinacia_vehicle.serial_number_file_path, '_blank');
						win.focus();
					}}>{t('common:view_image')}</button>
				</GenericListLine>
				}
				{	ISDINACIA && v.dinacia_vehicle && v.dinacia_vehicle.remote_sensor_file_path !== null &&
				<GenericListLine>
					<p>{t('vehicles.remote_sensor_file')}</p>
					<button onClick={() => {
						const win = window.open(v.dinacia_vehicle.remote_sensor_file_path, '_blank');
						win.focus();
					}}>{t('common:view_image')}</button>
				</GenericListLine>
				}
			</div>
			}
		</Callout>
	);
}

function VehiclesList() {
	const { t,  } = useTranslation('glossary');
	const { store, authStore, userStore } = useStore('RootStore', (store) => ({ store: store.vehicleStore, authStore: store.authStore, userStore: store.userStore }));
	const { username } = useParams(); // If set, filter only vehicles of a particular user
	const history = useHistory();
	const [listingOnlyVehiclesByUser, setListingOnlyVehiclesByUser] = useState(false);

	useEffect(() => {
		autorun(() => {
			if (!userStore.hasFetched) {
				userStore.fetchUsers();
			}
		});
		autorun(() => {
			if (username) {
				if (userStore.users.get(username)) {
					setListingOnlyVehiclesByUser(true);
				} else {
					store.setFilterProperty('uvin');
					store.setFilterByText(username);
				}
			}
		});
	}, []);

	if (store.hasFetched) {
		if (store.isEmpty) {
			return (
				<>
					<div className={styles.header}>
						<h1>
							{t('vehicles.plural_generic').toUpperCase()}
						</h1>
					</div>
					<h2>
						{t('vehicles.zero_vehicles')}
					</h2>
					<div
						className={styles.actionArea}
					>
						{	listingOnlyVehiclesByUser &&
						<Button
							className={styles.buttonAction}
							disabled={!username}
							icon='add'
							onClick={() => {
								history.push(`/dashboard/vehicles/${username}/new`);
							}}
						>
							{t('add_vehicle')}
						</Button>
						}
						{ !listingOnlyVehiclesByUser && authStore.isAdmin &&
						<p>To add a vehicle, please select a user from "All users". </p>
						}
					</div>
				</>
			);
		} else {
			return (
				<>
					<div className={styles.header}>
						<h1>
							{t('vehicles.plural_generic').toUpperCase()}
						</h1>
					</div>
					<div
						className={styles.filters}
					>
						<HTMLSelect
							id='filter'
							name="UvrFilterProperty"
							className={styles.filterProperty}
							value={store.filterProperty}
							onChange={(event) => store.setFilterProperty(event.currentTarget.value)}
						>
							<option value="nNumber">{t('vehicles.nNumber')}</option>
							<option value="faaNumber">{t('vehicles.faaNumber')}</option>
							<option value="vehicleName">{t('vehicles.vehicleName')}</option>
							<option value="manufacturer">{t('vehicles.manufacturer')}</option>
							<option value="model">{t('vehicles.model')}</option>
							<option value="uvin">{t('vehicles.uvin')}</option>
						</HTMLSelect>
						<InputGroup
							className={styles.filterTextInput}
							leftIcon="search"
							onChange={(evt) => store.setFilterByText(evt.target.value)}
							placeholder={t('map:filter.bytext.description')}
							value={store.filterMatchingText}
						/>
						<p
							className={styles.filterTextInfo}
						>
							{t('glossary:showing_out_of', { sub: store.counts.matchesFilters, total: store.counts.vehicleCount })}
						</p>
					</div>
					<div
						className={styles.filters}
					>
						<p className={styles.filterLabel}>
							{t('glossary:sorting_by_property')}
						</p>
						<HTMLSelect
							id='sorter'
							name="UvrSorter"
							className={styles.filterProperty}
							value={store.sortingProperty}
							minimal
							onChange={(event) => store.setSortingProperty(event.currentTarget.value)}
						>
							<option value="nNumber">{t('vehicles.nNumber')}</option>
							<option value="faaNumber">{t('vehicles.faaNumber')}</option>
							<option value="vehicleName">{t('vehicles.vehicleName')}</option>
							<option value="manufacturer">{t('vehicles.manufacturer')}</option>
							<option value="model">{t('vehicles.model')}</option>
						</HTMLSelect>
						<p className={styles.filterLabel}>
							{t('glossary:in')}
						</p>
						<HTMLSelect
							id='sorter'
							name="UvrSortingOrder"
							className={styles.filterProperty}
							value={store.sortingOrder}
							minimal
							onChange={(event) => store.setSortingOrder(event.currentTarget.value)}
						>
							<option value='asc'>{t('glossary:ascending')}</option>
							<option value='desc'>{t('glossary:descending')}</option>
						</HTMLSelect>
						<p className={styles.filterLabel}>
							{t('glossary:order')}
						</p>
					</div>
					<div
						className={styles.actionArea}
					>
						{	listingOnlyVehiclesByUser &&
						<Button
							className={styles.buttonAction}
							disabled={!username}
							icon='add'
							onClick={() => {
								history.push(`/dashboard/vehicles/${username}/new`);
							}}
						>
							{t('add_vehicle')}
						</Button>
						}
						{ !listingOnlyVehiclesByUser && authStore.isAdmin &&
						<p>{t('glossary:add_vehicle_from_users')}</p>
						}
					</div>
					<GenericList>
						{store.vehiclesWithVisibility.map((vehicle) => {
							if (listingOnlyVehiclesByUser && vehicle.owner.username !== username) {
								// Display only vehicles owned by the selected user, if chosen.
								return null;
							} else {
								if (vehicle._matchesFiltersByNames) {
									return <Vehicle
										key={vehicle.uvin}
										v={vehicle}
									/>;
								} else {
									return null;
								}
							}
						})}
					</GenericList>
				</>
			);
		}
	} else {
		if (store.hasError) {
			return (
				<>
					<div className={styles.header}>
						<h1>
							{t('vehicles.plural_generic').toUpperCase()}
						</h1>
					</div>
					<p>
						{t('app.errorocurredfetching')}
					</p>
					<Button
						intent={Intent.PRIMARY}
						onClick={() => store.fetch()}
					>
						{t('app.tryagain')}
					</Button>
				</>
			);
		} else {
			return (
				<div className="fullHW" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
				</div>
			);
		}
	}
}

/* { 	state.error &&
				<>
					<p>
						{t('app.errorocurredfetching')}
					</p>
					<Button
						intent={Intent.PRIMARY}
						onClick={() => actions.fetch()}
					>
						{t('app.tryagain')}
					</Button>
				</>
				} */

export default observer(VehiclesList);
