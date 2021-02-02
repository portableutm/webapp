import React, { useState } from 'react';
import GenericList, { GenericListLine } from '../generic/GenericList';
import { Callout, Spinner, Intent, Button, HTMLSelect, InputGroup, Checkbox } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styles from '../generic/GenericList.module.css';
import { useStore } from 'mobx-store-provider';
import { observer, useLocalStore } from 'mobx-react';
import { ISDINACIA } from '../../consts';

function Operation({ expanded = false, selected = false, operation, isPilot }) {
	// Renders one Operation text properties for a list
	const history = useHistory();
	const { t, } = useTranslation(['glossary', 'common']);
	const onClick = (evt) => {
		evt.stopPropagation();
		history.push('/operation/' + operation.gufi);
	};
	const { opStore, authStore } = useStore(
		'RootStore',
		(store) => ({
			opStore: store.operationStore,
			authStore: store.authStore
		}));

	const changeState = (newState) => {
		opStore.updateState(operation.gufi, newState);
	};

	const pendingToAccepted = (evt) => {
		evt.stopPropagation();
		const comments = prompt(t('common:reason'));
		if (comments === null) return;
		opStore.updatePending(
			operation.gufi,
			comments,
			true
		);
	};

	const pendingToRejected = (evt) => {
		evt.stopPropagation();
		const comments = prompt(t('common:reason'));
		if (comments === null) return;
		opStore.updatePending(
			operation.gufi,
			comments,
			false
		);
	};

	const [showProperties, setShowProperties] = useState(expanded);

	const toggleOperation = (evt) => {
		evt.stopPropagation();
		setShowProperties(show => {
			if (show === false) {
				history.replace('/dashboard/operations/' + operation.gufi);
				return true;
			} else {
				history.replace('/dashboard/operations');
				return false;
			}
		});
	};

	return (
		<Callout
			key={operation.gufi}
			className={styles.item}
			title={
				<div className={styles.title} onClick={toggleOperation}>
					<p className={styles.titleText}>{operation.name}</p>
					{ 	operation.state === 'PENDING' &&
						authStore.isAdmin &&
						<>
							<Button
								className={styles.button}
								data-test-id={`approve${operation.name}`}
								small
								minimal
								icon='tick'
								intent={Intent.SUCCESS}
								onClick={pendingToAccepted}
							>
								<div className={styles.buttonHoveredTooltip}>
									{t('common:approve')}
								</div>
							</Button>
							<Button
								className={styles.button}
								data-test-id={`reject${operation.name}`}
								small
								minimal
								icon='cross'
								intent={Intent.DANGER}
								onClick={pendingToRejected}
							>
								<div className={styles.buttonHoveredTooltip}>
									{t('common:reject')}
								</div>
							</Button>
						</>
					}
					<Button
						className={styles.button}
						data-test-id={`showHideProperties${operation.name}`}
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
						icon='eye-open'
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
						onClick={(evt) => {evt.stopPropagation(); history.push('/operation/edit/' + operation.gufi);}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('common:edit_on_map')}
						</div>
					</Button>
				</div>
			}
			data-test-id={'op' + operation.name}
			icon="double-chevron-right"
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				<GenericListLine>
					ID
					<div data-test-id='dash#selected#gufi'>
						{operation.gufi}
					</div>
				</GenericListLine>
				<GenericListLine>
					{t('operations.owner')}
					{operation.owner.asDisplayString}
				</GenericListLine>
				{	operation.uas_registrations.map(uasr => {
					return <>
						<GenericListLine key={uasr}>
							{t('operations.uas_registration')}
							{uasr}
						</GenericListLine>
						{ /* ISDINACIA && uasr.remote_sensor_id &&
						<GenericListLine key={uasr}>
							{t('operations.uas_registration')}
							{uasr}
						</GenericListLine>
						*/ }
					</>;
				})}
				<GenericListLine>
					{t('volumes.effective_time_begin')}
					{new Date(operation.operation_volumes[0].effective_time_begin).toLocaleString()}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.effective_time_end')}
					{new Date(operation.operation_volumes[0].effective_time_end).toLocaleString()}
				</GenericListLine>
				{/*<GenericListLine>
					{t('volumes.min_altitude')}
					{children.operation_volumes[0].min_altitude}
				</GenericListLine> */}
				<GenericListLine>
					{t('volumes.max_altitude')}
					{operation.operation_volumes[0].max_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('operations.aircraft_comments')}
					{operation.aircraft_comments}
				</GenericListLine>
				{/* <GenericListLine>
					{t('operations.volumes_description')}
					{children.volumes_description}
				</GenericListLine> */}
				<GenericListLine>
					{t('operations.flight_number')}
					{operation.flight_number}
				</GenericListLine>
				<GenericListLine>
					{t('operations.state')}
					<HTMLSelect
						id={`${operation.gufi}state`}
						name="OperationState"
						value={operation.state}
						minimal
						disabled={isPilot}
						onChange={(event) => changeState(event.currentTarget.value)}
					>
						<option value="PROPOSED">PROPOSED</option>
						<option value="PENDING">PENDING</option>
						<option value="ACCEPTED">ACCEPTED</option>
						<option value="NOT_ACCEPTED">NOT_ACCEPTED</option>
						<option value="ACTIVATED">ACTIVATED</option>
						<option value="CLOSED">CLOSED</option>
						<option value="NONCONFORMING">NONCONFORMING</option>
						<option value="ROGUE">ROGUE</option>
					</HTMLSelect>
				</GenericListLine>
				<GenericListLine>
					{t('operations.flight_comments')}
					{operation.flight_comments}
				</GenericListLine>
				<GenericListLine>
					{t('operations.free_text')}
					{operation.free_text}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}


function OperationsList() {
	const history = useHistory();
	const { t, } = useTranslation(['glossary','map']);
	const { store, authStore } = useStore(
		'RootStore',
		(store) => ({
			store: store.operationStore,
			authStore: store.authStore
		}));
	const { id } = useParams();

	if (store.hasFetched) {
		return (
			<>
				<div className={styles.header}>
					<h1>
						{t('operations.plural_generic').toUpperCase()}
					</h1>
				</div>
				<>
					<div
						className={styles.filters}
					>
						<HTMLSelect
							id='filter'
							name="OperationFilterProperty"
							className={styles.filterProperty}
							value={store.filterProperty}
							onChange={(event) => store.setFilterProperty(event.currentTarget.value)}
						>
							<option value="name">Name</option>
							<option value="owner">Owner</option>
						</HTMLSelect>
						<InputGroup
							className={styles.filterTextInput}
							leftIcon="search"
							onChange={(evt) => store.setFilterByText(evt.target.value)}
							placeholder={t('map:filter.bytext.description')}
							value={store.filterMatchingText}
						/>
						<Checkbox
							className={styles.filterTextInfo}
							data-test-id='historical'
							checked={store.isInHistoricalMode}
							onChange={(evt) => {
								store.toggleHistoricalMode(evt.target.checked);
							}}
						>
							{t('map:historical_mode_description')}
						</Checkbox>
						{/*<p
								className={styles.filterTextInfo}
							>
								{`Showing ${store.counts.matchingTextAndStateCount} out of ${store.counts.operationCount} operations`}
							</p>*/}
					</div>
					<div
						className={styles.filters2}
					>
						<Checkbox
							data-test-id='layersACCEPTED'
							checked={store.filterShowAccepted}
							onChange={(evt) => {
								store.setFilterAccepted(evt.target.checked);
							}}
						>
							{t('map:filter.accepted')}
						</Checkbox>
						<Checkbox
							data-test-id='layersPENDING'
							checked={store.filterShowPending}
							onChange={(evt) => {
								store.setFilterPending(evt.target.checked);
							}}
						>
							{t('map:filter.pending')}
						</Checkbox>
						<Checkbox
							data-test-id='layersACTIVATED'
							checked={store.filterShowActivated}
							onChange={(evt) => {
								store.setFilterActivated(evt.target.checked);
							}}
						>
							{t('map:filter.activated')}
						</Checkbox>
						<Checkbox
							data-test-id='layersROGUE'
							checked={store.filterShowRogue}
							onChange={(evt) => {
								store.setFilterRogue(evt.target.checked);
							}}
						>
							{t('map:filter.rogue')}
						</Checkbox>
						<Checkbox
							data-test-id='layersCLOSED'
							checked={store.filterShowClosed}
							onChange={(evt) => {
								store.setFilterClosed(evt.target.checked);
							}}
						>
							{t('map:filter.closed')}
						</Checkbox>
					</div>
					<div
						className={styles.filters}
					>
						<p className={styles.filterLabel}>
								Sorting by property:
						</p>
						<HTMLSelect
							id='sorter'
							name="OperationSorter"
							className={styles.filterProperty}
							value={store.sortingProperty}
							minimal
							onChange={(event) => store.setSortingProperty(event.currentTarget.value)}
						>
							<option value="name">Name</option>
							<option value="flight_number">Flight No.</option>
							<option value="owner_name">Owner First Name</option>
							<option value="owner_lastname">Owner Last Name</option>
							<option value="owner_username">Owner Username</option>
							<option value="start">Start</option>
							<option value="end">End</option>
						</HTMLSelect>
						<p className={styles.filterLabel}>
								in
						</p>
						<HTMLSelect
							id='sorter'
							name="OperationSortingOrder"
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
						<Button
							className={styles.buttonAction}
							icon='add'
							onClick={() => {
								history.push('/operation/new');
							}}
						>
							{t('add_operation')}
						</Button>
					</div>
					<GenericList>
						{store.operationsWithVisibility.map((op) => {
							if (op._matchesFiltersByNames && op._matchesFiltersByStates) {
								return <Operation
									key={op.gufi}
									expanded={op.gufi === id}
									selected={op._visibility}
									operation={op}
									isPilot={authStore.role === 'pilot'}
								/>;
							} else {
								return null;
							}
						})}
					</GenericList>
					{store.counts.matchingTextAndStateCount === 0 &&
					<h3 style={{ textAlign: 'center' }}>
						{t('operations.zero_operations')}
					</h3>
					}
				</>

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

export default observer(OperationsList);