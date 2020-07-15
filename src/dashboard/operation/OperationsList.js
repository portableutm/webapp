import React, {useState} from 'react';
import S from 'sanctuary';
import GenericList, {GenericListLine} from '../generic/GenericList';
import {Callout, Spinner, Intent, Button} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import useAdesState from '../../state/AdesState';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import styles from '../generic/GenericList.module.css';

function Operation({expanded = false, children}) {
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
	const [showProperties, setShowProperties] = useState(expanded);
	return (
		<Callout
			key={children.name}
			className={styles.item}
			title={
				<div className={styles.title}>
					<p>{children.name}</p>
					<Button
						className={styles.button}
						small
						minimal
						icon='pin'
						intent={operationIsSelected ? Intent.DANGER : Intent.SUCCESS}
						onClick={onClick}
					>
						<div className={styles.buttonHoveredTooltip}>
							{ operationIsSelected &&
							t('remove_from_map')
							}
							{ !operationIsSelected &&
							t('show_on_map')
							}
						</div>
					</Button>
				</div>
			}
			data-test-id={'op' + children.name}
			icon="double-chevron-right"
			onClick={() => setShowProperties(show => {
				if (show === false) {
					history.replace('/dashboard/operations/' + children.gufi);
					return true;
				} else {
					history.replace('/dashboard/operations');
					return false;
				}
			})}
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				<GenericListLine>
					ID
					<div data-test-id='dash#selected#gufi'>
						{children.gufi}
					</div>
				</GenericListLine>
				<GenericListLine>
					{t('operation.owner')}
					{children.owner.firstName + ' ' + children.owner.lastName + ' (' + children.owner.username + ')'}
				</GenericListLine>
				<GenericListLine>
					{t('volume.effective_time_begin')}
					{new Date(children.operation_volumes[0].effective_time_begin).toLocaleString()}
				</GenericListLine>
				<GenericListLine>
					{t('volume.effective_time_end')}
					{new Date(children.operation_volumes[0].effective_time_end).toLocaleString()}
				</GenericListLine>
				{/*<GenericListLine>
					{t('volume.min_altitude')}
					{children.operation_volumes[0].min_altitude}
				</GenericListLine> */}
				<GenericListLine>
					{t('volume.max_altitude')}
					{children.operation_volumes[0].max_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('operation.aircraft_comments')}
					{children.aircraft_comments}
				</GenericListLine>
				{/* <GenericListLine>
					{t('operation.volumes_description')}
					{children.volumes_description}
				</GenericListLine> */}
				<GenericListLine>
					{t('operation.flight_number')}
					{children.flight_number}
				</GenericListLine>
				<GenericListLine>
					{t('operation.state')}
					{children.state}
				</GenericListLine>
				<GenericListLine>
					{t('operation.flight_comments')}
					{children.flight_comments}
				</GenericListLine>
				<GenericListLine>
					{t('operation.free_text')}
					{children.free_text}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}

function OperationsList() {
	const [state, ] = useAdesState(state => state.operations);
	const { t,  } = useTranslation();
	const { id } = useParams();
	const operations = S.values(state.list);
	const isThereOperations = operations.length !== 0;
	if (isThereOperations) {
		return (
			<div>
				<h1>
					{t('operations')}
				</h1>
				<GenericList>
					{S.map
					((op) => <Operation key={op.gufi} expanded={op.gufi === id}>{op}</Operation>)
					(operations)
					}
				</GenericList>
			</div>
		);
	} else {
		return (
			<div className="fullHW" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
			</div>
		);
	}
}

export default OperationsList;