import React, {useState} from 'react';
import S from 'sanctuary';
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
					{t('volume.effective_time_begin')}
					{children.operation_volumes[0].effective_time_begin}
				</GenericListLine>
				<GenericListLine>
					{t('volume.effective_time_end')}
					{children.operation_volumes[0].effective_time_end}
				</GenericListLine>
				<GenericListLine>
					{t('volume.min_altitude')}
					{children.operation_volumes[0].min_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('volume.max_altitude')}
					{children.operation_volumes[0].max_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('operation.aircraft_comments')}
					{children.aircraft_comments}
				</GenericListLine>
				<GenericListLine>
					{t('operation.volumes_description')}
					{children.volumes_description}
				</GenericListLine>
				<GenericListLine>
					{t('operation.flight_number')}
					{children.flight_number}
				</GenericListLine>
				<GenericListLine>
					{t('operation.state')}
					{children.state}
				</GenericListLine>
				<GenericListLine>
					{t('operation.free_text')}
					{children.free_text}
				</GenericListLine>
				<Button intent={Intent.PRIMARY} onClick={onClick}>
					{ operationIsSelected &&
						<>{t('remove_from_map')}</>
					}
					{ !operationIsSelected &&
						<>{t('show_on_map')}</>
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
	const operations = S.values(state.operations.list);
	const isThereOperations = operations.length !== 0;
	if (isThereOperations) {
		return (
			<div>
				<h1>
					{t('operations')}
				</h1>
				<GenericList>
					{S.map
					((op) => <Operation key={op.gufi}>{op}</Operation>)
					(operations)
					}
				</GenericList>
			</div>
		);
	} else {
		return (<div className="fullHW" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
		</div>
		);
	}
}

export default OperationsList;