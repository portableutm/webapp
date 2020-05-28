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
	const [ state, actions ] = useAdesState();
	const operationIsSelected = state.map.ids.indexOf(children.gufi) !== -1;
	const onClick = operationIsSelected ?
		() => actions.map.removeId(children.gufi)
		:
		() =>  {
			actions.map.addId(children.gufi);
			history.push('/operation/' + children.gufi);
		};
	const [showProperties, setShowProperties] = useState(false);
	return (
		<Callout
			key={children.flight_comments}
			className="dshListItem"
			title={children.flight_comments}
			data-test-id={'op' + children.flight_comments}
			icon="double-chevron-right"
			onClick={() => setShowProperties(show => !show)}
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				<GenericListLine>
					gufi
					<div data-test-id='dash#selected#gufi'>
						{children.gufi}
					</div>
				</GenericListLine>
				<GenericListLine>
					{'Begin'}
					{children.operation_volumes[0].effective_time_begin}
				</GenericListLine>
				<GenericListLine>
					{'End'}
					{children.operation_volumes[0].effective_time_end}
				</GenericListLine>
				<GenericListLine>
					{'Min. Altitude'}
					{children.operation_volumes[0].min_altitude}
				</GenericListLine>
				<GenericListLine>
					{'Max. Altitude'}
					{children.operation_volumes[0].max_altitude}
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
				<Button intent={Intent.PRIMARY} onClick={onClick}>
					{ operationIsSelected &&
						<>Remove from map</>
					}
					{ !operationIsSelected &&
						<>Show on map</>
					}
				</Button>
			</div>
			}
		</Callout>
	);
}

function OperationsList() {
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

export default OperationsList;