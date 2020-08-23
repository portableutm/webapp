import React from 'react';

/* Visuals */
import styles from '../Map.module.css';
import {Checkbox, InputGroup} from '@blueprintjs/core';

/* Logic */
import S from 'sanctuary';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import SidebarButton from '../SidebarButton';
import {useStore} from 'mobx-store-provider';
import {useObserver, useLocalStore} from 'mobx-react';
import * as classnames from 'classnames';

const StateFilters = () => {
	const { t, } = useTranslation('map');
	const {operationStore: store} = useStore('RootStore');
	return useObserver(() => (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.bystate')}
			</div>
			<div
				className={styles.sidebarButtonText}
			>
				<Checkbox
					className='donotselect'
					data-test-id='layersACCEPTED'
					checked={store.filterShowAccepted}
					onChange={(evt) => {
						store.setFilterAccepted(evt.target.checked);
					}}
				>
					{t('filter.accepted')}
				</Checkbox>
			</div>
			<div
				className={styles.sidebarButtonText}
			>
				<Checkbox
					className='donotselect'
					data-test-id='layersPENDING'
					checked={store.filterShowPending}
					onChange={(evt) => {
						store.setFilterPending(evt.target.checked);
					}}
				>
					{t('filter.pending')}
				</Checkbox>
			</div>

			<div
				className={styles.sidebarButtonText}
			>

				<Checkbox
					className='donotselect'
					data-test-id='layersACTIVATED'
					checked={store.filterShowActivated}
					onChange={(evt) => {
						store.setFilterActivated(evt.target.checked);
					}}
				>
					{t('filter.activated')}
				</Checkbox>
			</div>
			<div
				className={styles.sidebarButtonText}
			>
				<Checkbox
					className='donotselect'
					data-test-id='layersROGUE'
					checked={store.filterShowRogue}
					onChange={(evt) => {
						store.setFilterRogue(evt.target.checked);
					}}
				>
					{t('filter.rogue')}
				</Checkbox>
			</div>
		</>
	));
};

const UvrsFilters = () => {
	const { t, } = useTranslation('map');
	const { store } = useStore(
		'RootStore',
		(store) => ({store: store.uvrStore})
	);
	return useObserver(() => (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.uvrs')}
			</div>
			{store.uvrsWithVisibility.map((uvr, index) => {
				return (
					<div
						key={uvr.message_id}
						className={classnames(
							styles.sidebarButtonText,
							{ [styles.sidebarButtonTextCollapsed]: !uvr._showInLayers }
						)}
					>
						<Checkbox
							className='donotselect'
							disabled={!uvr._showInLayers}
							data-test-id={'uvr' + index}
							checked={uvr._visibility}
							onChange={() => store.toggleVisibility(uvr)}
						>
							{uvr.reason}
						</Checkbox>
					</div>
				);
			})}
		</>
	));
};

const OperationFilters = () => {
	const { t,  } = useTranslation('map');
	const { store } = useStore(
		'RootStore',
		(store) => ({store: store.operationStore})
	);
	const doesOperationStateMatchOneOfTheStateFilters = (operation) => {
		// Do not let user uncheck an operation that is being shown because it matches by state
		if (store.filterShowAccepted && operation.state === 'ACCEPTED') {
			return true;
		} else if (store.filterShowPending && operation.state === 'PENDING') {
			return true;
		} else if (store.filterShowActivated && operation.state === 'ACTIVATED') {
			return true;
		} else if (store.filterShowRogue && operation.state === 'ROGUE') {
			return true;
		} else {
			return false;
		}
	};
	return useObserver(() => (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.byname')}
			</div>
			{store.operationsWithVisibility.map((op) => {
				return (<div
					className={classnames(
						styles.sidebarButtonText,
						{ [styles.sidebarButtonTextCollapsed]: !op._showInLayers }
					)}
					key={op.gufi}
				>
					<Checkbox
						className={styles.sidebarButtonTextContent}
						checked={op._visibility || doesOperationStateMatchOneOfTheStateFilters(op)}
						disabled={!op._showInLayers  || doesOperationStateMatchOneOfTheStateFilters(op)}
						onChange={() => store.toggleVisibility(op)}
						data-test-id={'op' + op.gufi}
					>
						{op.name}
					</Checkbox>
				</div>
				);
			}
			)}
		</>
	));
};

const RfvsFilters = () => {
	const { t, } = useTranslation('map');
	const { store } = useStore(
		'RootStore',
		(store => ({store: store.rfvStore})));
	return useObserver(() => (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.rfvs')}
			</div>
			{store.rfvsWithVisibility.map((rfv, index) => {
				return (
					<div
						key={rfv.id}
						className={classnames(
							styles.sidebarButtonText,
							{ [styles.sidebarButtonTextCollapsed]: !rfv._showInLayers }
						)}
					>
						<Checkbox
							className={styles.sidebarButtonTextContent}
							data-test-id={'rfv' + index}
							disabled={!rfv._showInLayers}
							checked={rfv._visibility}
							onChange={() => store.toggleVisibility(rfv)}
						>
							{rfv.comments}
						</Checkbox>
					</div>
				);
			})}
		</>
	));
};

const TextFilter = () => {
	const { t, } = useTranslation('map');
	const {rfvStore, uvrStore, operationStore} = useStore(
		'RootStore',
		(store => ({
			rfvStore: store.rfvStore,
			uvrStore: store.uvrStore,
			operationStore: store.operationStore
		})));
	const filterStore = useLocalStore(() => ({
		text: '',
		setText(newText) {
			uvrStore.setTextToMatchToDisplayInLayersList(newText);
			rfvStore.setTextToMatchToDisplayInLayersList(newText);
			operationStore.setTextToMatchToDisplayInLayersList(newText);
			this.text = newText;
		}
	}));

	return useObserver(() => (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.bytext')}
			</div>
			<div
				style={{height: '40px'}}
				className={styles.sidebarButtonText}
			>
				<InputGroup
					leftIcon="search"
					onChange={(evt) => filterStore.setText(evt.target.value)}
					placeholder={t('filter.bytext.description')}
					value={filterStore.text}
					fill
				/>
			</div>
		</>
	));
};

/* Button that opens a Menu that permits users selects what layers to show */
const Layers = ({filtersSelected, setFiltersSelected, operations, disabled, idsSelected, setIdsSelected, rfvs, setRfvsShowing}) => {
	const { t } = useTranslation('glossary');
	return (
		<>
			{/*
		<div data-test-id='mapButtonLayers' className='layersButton'>
			<Popover content={
				<div>
					<Menu>
						<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
						<OperationFilters operations={operations} ids={idsSelected} setIds={setIdsSelected}/>
					</Menu>
				</div>
			} position={Position.BOTTOM_LEFT} disabled={disabled}>
				<div className='contextualMenu'>
					<Icon icon='layers' iconSize={44} color={disabled ? 'rgb(200,200,200)' : 'rgb(50,50,50)'}/>
				</div>
			</Popover>
		</div>
		*/}
			<SidebarButton
				useCase='FilterOperations'
				icon='filter'
				label={t('filter.bystate').toUpperCase()}
				simpleChildren={false}
			>
				<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
			</SidebarButton>
			<SidebarButton
				forceOpen={true}
				useCase='Layers'
				icon='layers'
				label={t('layers').toUpperCase()}
				simpleChildren={false}
			>
				<TextFilter />
				<OperationFilters />
				<RfvsFilters />
				<UvrsFilters />
			</SidebarButton>
		</>
	);
};

Layers.propTypes = {
	filtersSelected: PropTypes.object.isRequired,
	setFiltersSelected: PropTypes.func.isRequired,
	operations: PropTypes.array.isRequired,
	idsSelected: PropTypes.array.isRequired,
	setIdsSelected: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired
};
export default Layers;