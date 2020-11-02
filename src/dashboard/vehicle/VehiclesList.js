import React, { useState } from 'react';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Button, Callout, HTMLSelect, InputGroup, Intent, Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import GenericList, { GenericListLine } from '../generic/GenericList';
import styles from '../generic/GenericList.module.css';
import NewVehicle from './NewVehicle';

function Vehicle({ v }) {
	const { t,  } = useTranslation(['glossary','common']);
	const [showProperties, setShowProperties] = useState(false);

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
						{v.vehicleName + ' (' + v.faaNumber + ')'}
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
				<GenericListLine>
					{t('vehicles.nNumber')}
					{v.nNumber}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.faaNumber')}
					{v.faaNumber}
				</GenericListLine>
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
				<GenericListLine>
					{t('vehicles.owner')}
					{v.owner.asDisplayString}
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.registeredBy')}
					{v.registeredBy.asDisplayString}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}

function VehiclesList() {
	const { t,  } = useTranslation('glossary');
	const { store, authStore } = useStore('RootStore', (store) => ({ store: store.vehicleStore, authStore: store.authStore }));
	const { username } = useParams(); // If set, filter only vehicles of a particular user
	const [isCreatingVehicle, setCreatingVehicle] = useState(false);

	if (store.hasFetched) {
		if (store.isEmpty) {
			if (username && isCreatingVehicle) {
				return (
					<NewVehicle userId={username} finish={() => setCreatingVehicle(false)}/>
				);
			} else {
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
							{	username &&
							<Button
								className={styles.buttonAction}
								disabled={!username}
								icon='add'
								onClick={() => {
									setCreatingVehicle(true);
								}}
							>
								{t('add_vehicle')}
							</Button>
							}
							{ !username && authStore.isAdmin &&
							<p>To add a vehicle, please select a user from "All users". </p>
							}
						</div>
					</>
				);
			}

		} else {
			if (username && isCreatingVehicle) {
				return (
					<NewVehicle userId={username} finish={() => setCreatingVehicle(false)}/>
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
								{`Showing ${store.counts.matchesFilters} out of ${store.counts.vehicleCount} vehicles`}
							</p>
						</div>
						<div
							className={styles.filters}
						>
							<p className={styles.filterLabel}>
								Sorting by property:
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
								in
							</p>
							<HTMLSelect
								id='sorter'
								name="UvrSortingOrder"
								className={styles.filterProperty}
								value={store.sortingOrder}
								minimal
								onChange={(event) => store.setSortingOrder(event.currentTarget.value)}
							>
								<option value='asc'>Ascending</option>
								<option value='desc'>Descending</option>
							</HTMLSelect>
							<p className={styles.filterLabel}>
								order
							</p>
						</div>
						<div
							className={styles.actionArea}
						>
							{	username &&
								<Button
									className={styles.buttonAction}
									disabled={!username}
									icon='add'
									onClick={() => {
										setCreatingVehicle(true);
									}}
								>
									{t('add_vehicle')}
								</Button>
							}
							{ !username && authStore.isAdmin &&
								<p>To add a vehicle, please select a user from the user list.</p>
							}
						</div>
						<GenericList>
							{store.vehiclesWithVisibility.map((vehicle) => {
								if (username && vehicle.owner.username !== username) {
									// Display only vehicles owned by the selected user, if chosen.
									return null;
								} else {
									if (vehicle._matchesFiltersByNames) {
										return <Vehicle
											key={vehicle.faaNumber} v={vehicle}
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
