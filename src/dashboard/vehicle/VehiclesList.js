import React, {useEffect, useState} from 'react';
import useAdesState from '../../state/AdesState';
import S from 'sanctuary';
import {Button, Callout, Intent, Spinner, Tag} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import {GenericListLine} from '../generic/GenericList';
import styles from '../generic/GenericList.module.css';

function Vehicle({children: v}) {
	const { t,  } = useTranslation(['glossary','common']);
	const [showProperties, setShowProperties] = useState(false);

	return (
		<Callout
			key={v.faaNumber}
			className={styles.item}
			title={
				<div className={styles.title}>
					<p style={{height: '100%', maxWidth: '50%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
						{v.vehicleName + ' (' + v.faaNumber + ')'}
					</p>
					<Button
						className={styles.button}
						small
						minimal
						icon='menu-open'
						intent={showProperties ? Intent.DANGER : Intent.SUCCESS}
						onClick={() => setShowProperties(show => !show)}
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
					{v.date}
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
					{v.class}
				</GenericListLine>
				<GenericListLine>
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
				</GenericListLine>
				<GenericListLine>
					{t('vehicles.registeredBy')}
					{v.registeredBy.username}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}

function VehiclesList() {
	const { t,  } = useTranslation('glossary');
	const [state, actions] = useAdesState(state => state.vehicles, actions => actions.vehicles);
	const vehicles = S.values(state.list);
	const isThereVehicles = vehicles.length > 0;
	useEffect(() => {
		// Only run in mount
		/* Fetch vehicle data if too old, when loading component */
		actions.fetchIfOld();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (isThereVehicles) {
		return (
			<>
				<div className={styles.header}>
					<h1>
						{t('vehicles.plural_generic').toUpperCase()}
					</h1>
				</div>
				{ 	state.error &&
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
				}
				{	!state.error && S.map
				(vehicle => <Vehicle key={vehicle.faaNumber}>{vehicle}</Vehicle>)
				(vehicles)
				}
			</>
		);
	} else {
		return (
			<div className="fullHW" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
			</div>
		);
	}
}

export default VehiclesList;