import React, { useState } from 'react';
import GenericList, { GenericListLine } from '../generic/GenericList';
import { Callout, Spinner, Intent, Button, HTMLSelect, InputGroup, Checkbox } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styles from '../generic/GenericList.module.css';
import { useStore } from 'mobx-store-provider';
import { observer, useLocalStore } from 'mobx-react';

function Operation({ expanded = false, selected = false, toggleSelected, operation, changeState, isPilot }) {
	// Renders one Operation text properties for a list
	const history = useHistory();
	const { t, } = useTranslation(['glossary', 'common']);
	const onClick = selected ?
		(evt) => {
			evt.stopPropagation();
			toggleSelected(operation);
		}  :
		(evt) => {
			evt.stopPropagation();
			toggleSelected(operation);
			history.push('/operation/' + operation.gufi);
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
						onClick={() => history.push('/operation/edit/' + operation.gufi)}
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
					return (
						<GenericListLine key={uasr}>
							{t('operations.uas_registration')}
							{uasr}
						</GenericListLine>
					);
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
						onChange={(event) => changeState(operation.gufi, event.currentTarget.value)}
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
	const { t, } = useTranslation('glossary');
	const { store, authStore, toggleSelected } = useStore(
		'RootStore',
		(store) => ({
			store: store.operationStore,
			authStore: store.authStore,
			toggleSelected: store.operationStore.toggleVisibility
		}));
	const { id } = useParams();
	const filterStore = useLocalStore(() => ({
		text: '',
		setText(newText) {
			store.setFilterByText(newText);
			this.text = newText;
		}
	}));
	if (store.hasFetched) {
		return (
			<>
				<div className={styles.header}>
					<h1>
						{t('operations.plural_generic').toUpperCase()}
					</h1>
				</div>
				{	store.allOperations.length > 0 &&
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
								onChange={(evt) => filterStore.setText(evt.target.value)}
								placeholder={t('filter.bytext.description')}
								value={filterStore.text}
							/>
							<p
								className={styles.filterTextInfo}
							>
								{`Showing ${store.counts.matchingTextAndStateCount} out of ${store.counts.operationCount} operations`}
							</p>
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
								{t('filter.accepted')}
							</Checkbox>
							<Checkbox
								data-test-id='layersPENDING'
								checked={store.filterShowPending}
								onChange={(evt) => {
									store.setFilterPending(evt.target.checked);
								}}
							>
								{t('filter.pending')}
							</Checkbox>
							<Checkbox
								data-test-id='layersACTIVATED'
								checked={store.filterShowActivated}
								onChange={(evt) => {
									store.setFilterActivated(evt.target.checked);
								}}
							>
								{t('filter.activated')}
							</Checkbox>
							<Checkbox
								data-test-id='layersROGUE'
								checked={store.filterShowRogue}
								onChange={(evt) => {
									store.setFilterRogue(evt.target.checked);
								}}
							>
								{t('filter.rogue')}
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
						<GenericList>
							{store.operationsWithVisibility.map((op) => {
								if (op._matchesFiltersByNames && op._matchesFiltersByStates) {
									return <Operation
										key={op.gufi}
										expanded={op.gufi === id}
										selected={op._visibility}
										toggleSelected={toggleSelected}
										operation={op}
										changeState={store.updateState}
										isPilot={authStore.role === 'pilot'}
									/>;
								} else {
									return null;
								}
							})}
						</GenericList>
					</>
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
			<div className="fullHW" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
			</div>
		);
	}
}

export default observer(OperationsList);