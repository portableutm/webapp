import React, {useState} from 'react';
import {mapValues} from '../../libs/SaferSanctuary';
import GenericList, {GenericListLine} from '../generic/GenericList';
import {Callout, Spinner, Intent, Button} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import useAdesState from '../../state/AdesState';
import {useTranslation} from 'react-i18next';

function Operation({children}) {
	// Renders one Operation text properties for a list
	const history = useHistory();
	const { t,  } = useTranslation();
	const [showProperties, setShowProperties] = useState(false);
	return (
		<Callout
			key={children.flight_comments}
			className="dshListItem"
			title={children.flight_comments}
			data-test-id={"op" + children.flight_comments}
			icon="double-chevron-right"
			onClick={() => setShowProperties(show => !show)}
		>
			{showProperties &&
			<div className="animated fadeInDown faster">
				<GenericListLine>
					gufi
					<div data-test-id='dash#selected#gufi'>
						{children.gufi}
					</div>
				</GenericListLine>
				<GenericListLine>
					{t('submit_time')}
					{children.submit_time}
				</GenericListLine>
				<GenericListLine>
					{t('update_time')}
					{children.update_time}
				</GenericListLine>
				<GenericListLine>
					{t('aircraft_comments')}
					{children.aircraft_comments}
				</GenericListLine>
				<GenericListLine>
					{t('volumes_description')}
					{children.volumes_description}
				</GenericListLine>
				<GenericListLine>
					{t('flight_number')}
					{children.flight_number}
				</GenericListLine>
				<GenericListLine>
					{t('state')}
					{children.state}
				</GenericListLine>
				<GenericListLine>
					{t('free_text')}
					{children.free_text}
				</GenericListLine>
				<Button intent={Intent.PRIMARY} onClick={() => history.push('/operation/' + children.gufi)}>Show on
					map</Button>
			</div>
			}
		</Callout>
	);
}

function List() {
	const [state, ] = useAdesState();
	const { t,  } = useTranslation();

	return (
		<div>
			<h1>
				{t('operations')}
			</h1>
			<GenericList>
				{mapValues
				(state.operations.list)
				(() => <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>)
				((op) => <Operation key={op.gufi}>{op}</Operation>)
				}
			</GenericList>
		</div>
	);
}

export default List;