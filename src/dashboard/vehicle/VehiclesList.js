import React, {useEffect, useState} from 'react';
import useAdesState from '../../state/AdesState';
import {mapValues} from '../../libs/SaferSanctuary';
import {Button, Callout, Intent, Spinner, Tag} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import {GenericListLine} from '../generic/GenericList';

function Vehicle({children: v}) {
	const { t,  } = useTranslation();
	const [showProperties, setShowProperties] = useState(false);

	return (
		<Callout
			key={v.faaNumber}
			className="dshListItem"
			title={<div>{v.vehicleName + ' (' + v.faaNumber + ')'} <Tag minimal={true}>{showProperties ? t('click_to_collapse') : t('click_to_expand')}</Tag></div>}
			icon="double-chevron-right"
			onClick={() => setShowProperties(show => !show)}
		>
			{showProperties &&
			<div className="animated flipInX faster">
				<GenericListLine>
					{t('vehicle.uvin')}
					{v.uvin}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.date')}
					{v.date}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.nNumber')}
					{v.nNumber}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.faaNumber')}
					{v.faaNumber}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.name')}
					{v.vehicleName}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.manufacturer')}
					{v.manufacturer}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.model')}
					{v.model}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.class')}
					{v.class}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.accessType')}
					{v.accessType}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.vehicleTypeId')}
					{v.vehicleTypeId}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.org-uuid')}
					{v['org-uuid']}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle.registeredBy')}
					{v.registeredBy.firstName + ' ' + v.registeredBy.lastName + ' (' + v.registeredBy.email + ')'}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}

function VehiclesList() {
	const { t,  } = useTranslation();
	const [state, actions] = useAdesState();

	useEffect(() => {
		// Only run in mount
		/* Fetch vehicle data if too old, when loading component */
		actions.vehicles.fetchIfOld();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<h1>{t('vehicles')}</h1>
			{ 	state.vehicles.error &&
				<>
					<p>
						{t('app.errorocurredfetching')}
					</p>
					<Button
						intent={Intent.PRIMARY}
						onClick={() => actions.vehicles.fetch()}
					>
						{t('app.tryagain')}
					</Button>
				</>
			}
			{	!state.vehicles.error && mapValues
			(state.vehicles.list)
			(() => <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>)
			(vehicle => <Vehicle key={vehicle.faaNumber}>{vehicle}</Vehicle>)
			}
		</>
	);
}

export default VehiclesList;