import React, {useState} from 'react';
import GenericList, {GenericListLine} from '../generic/GenericList';
import {Callout, Spinner, Intent, Button} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import styles from '../generic/GenericList.module.css';
import {useStore} from 'mobx-store-provider';
import {observer} from 'mobx-react';

function Operation({expanded = false, selected = false, toggleSelected, children}) {
	// Renders one Operation text properties for a list
	const history = useHistory();
	const {t,} = useTranslation(['glossary', 'common']);
	const onClick = selected ?
		() => toggleSelected(children)  :
		() => {
			toggleSelected(children);
			history.push('/operation/' + children.gufi);
		};
	const [showProperties, setShowProperties] = useState(expanded);
	return (
		<Callout
			key={children.gufi}
			className={styles.item}
			title={
				<div className={styles.title}>
					<p style={
						{
							height: '100%',
							maxWidth: '50%',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							marginRight: 'auto'
						}}
					>{children.name}</p>
					<Button
						className={styles.button}
						small
						minimal
						icon='menu-open'
						intent={showProperties ? Intent.DANGER : Intent.SUCCESS}
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
						icon='pin'
						intent={selected ? Intent.DANGER : Intent.SUCCESS}
						onClick={onClick}
					>
						<div className={styles.buttonHoveredTooltip}>
							{selected &&
							t('common:remove_from_map')
							}
							{!selected &&
							t('common:show_on_map')
							}
						</div>
					</Button>
					<Button
						className={styles.button}
						small
						minimal
						icon='edit'
						intent={Intent.WARNING}
						onClick={() => history.push('/operation/edit/' + children.gufi)}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('common:edit_on_map')}
						</div>
					</Button>
				</div>
			}
			data-test-id={'op' + children.name}
			icon="double-chevron-right"
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
					{t('operations.owner')}
					{children.owner.firstName + ' ' + children.owner.lastName + ' (' + children.owner.username + ')'}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.effective_time_begin')}
					{new Date(children.operation_volumes[0].effective_time_begin).toLocaleString()}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.effective_time_end')}
					{new Date(children.operation_volumes[0].effective_time_end).toLocaleString()}
				</GenericListLine>
				{/*<GenericListLine>
					{t('volumes.min_altitude')}
					{children.operation_volumes[0].min_altitude}
				</GenericListLine> */}
				<GenericListLine>
					{t('volumes.max_altitude')}
					{children.operation_volumes[0].max_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('operations.aircraft_comments')}
					{children.aircraft_comments}
				</GenericListLine>
				{/* <GenericListLine>
					{t('operations.volumes_description')}
					{children.volumes_description}
				</GenericListLine> */}
				<GenericListLine>
					{t('operations.flight_number')}
					{children.flight_number}
				</GenericListLine>
				<GenericListLine>
					{t('operations.state')}
					{children.state}
				</GenericListLine>
				<GenericListLine>
					{t('operations.flight_comments')}
					{children.flight_comments}
				</GenericListLine>
				<GenericListLine>
					{t('operations.free_text')}
					{children.free_text}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}

function OperationsList() {
	const {t,} = useTranslation('glossary');
	const { store, toggleSelected } = useStore(
		'RootStore',
		(store) => ({
			store: store.operationStore,
			toggleSelected: store.operationStore.toggleVisibility
		}));
	const {id} = useParams();
	if (store.hasFetched) {
		return (
			<>
				<div className={styles.header}>
					<h1>
						{t('operations.plural_generic').toUpperCase()}
					</h1>
				</div>
				{	store.allOperations.length > 0 &&
				<GenericList>
					{store.operationsWithVisibility.map((op) => {
						return <Operation
							key={op.gufi}
							expanded={op.gufi === id}
							selected={op._visibility}
							toggleSelected={toggleSelected}
						>
							{op}
						</Operation>;
					})}
				</GenericList>
				}
				{	store.allOperations.length === 0 &&
				<h2>
					{t('operations.zero_operations')}
				</h2>
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

export default observer(OperationsList);