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
			title={<div>{v.manufacturer + ' ' + v.model + ' (' + v.nNumber + ')'} <Tag minimal={true}>{showProperties ? t('click_to_collapse') : t('click_to_expand')}</Tag></div>}
			icon="double-chevron-right"
			onClick={() => setShowProperties(show => !show)}
		>
			{showProperties &&
			<div className="animated flipInX faster">
				<GenericListLine>
					{t('vehicle_uvin')}
					{v.uvin}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_date')}
					{v.date}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_nNumber')}
					{v.nNumber}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_faaNumber')}
					{v.faaNumber}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_name')}
					{v.vehicleName}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_manufacturer')}
					{v.manufacturer}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_model')}
					{v.model}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_class')}
					{v.class}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_accessType')}
					{v.accessType}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_vehicleTypeId')}
					{v.vehicleTypeId}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_org-uuid')}
					{v['org-uuid']}
				</GenericListLine>
				<GenericListLine>
					{t('vehicle_registeredBy')}
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
	console.log('state.vehicles.list', state.vehicles.list);

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
						{t('app_errorocurredfetching')}
					</p>
					<Button
						intent={Intent.PRIMARY}
						onClick={() => actions.vehicles.fetch()}
					>
						{t('app_tryagain')}
					</Button>
				</>
			}
			{	!state.vehicles.error && mapValues
			(state.vehicles.list)
			(() => <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>)
			(vehicle => <Vehicle key={vehicle.nNumber}>{vehicle}</Vehicle>)
			}
		</>
	);
}

export default VehiclesList;