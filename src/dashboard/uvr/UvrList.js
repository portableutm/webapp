import React, { useState } from 'react';
import GenericList, { GenericListLine } from '../generic/GenericList';
import { Callout, Spinner, Intent, Button, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styles from '../generic/GenericList.module.css';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';

function Uvr({ expanded = false, uvr, changeState, isPilot }) {
	// Renders an UVR's properties
	const history = useHistory();
	const { t, } = useTranslation(['glossary', 'common', 'map']);
	const [showProperties, setShowProperties] = useState(expanded);
	const toggleOperation = (evt) => {
		evt.stopPropagation();
		setShowProperties(show => {
			if (show === false) {
				history.replace('/dashboard/uvrs/' + uvr.message_id);
				return true;
			} else {
				history.replace('/dashboard/uvrs');
				return false;
			}
		});
	};

	return (
		<Callout
			key={uvr.message_id}
			className={styles.item}
			title={
				<div className={styles.title} onClick={toggleOperation}>
					<p className={styles.titleText}>{uvr.reason}</p>
					<Button
						className={styles.button}
						data-test-id={`showHideProperties${uvr.reason}`}
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
						intent={Intent.SUCCESS}
						onClick={(evt) => {
							evt.stopPropagation();
							history.push('/uvr/' + uvr.message_id);
						}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('common:show_on_map')}
						</div>
					</Button>
					<Button
						className={styles.button}
						small
						minimal
						icon='edit'
						intent={Intent.WARNING}
						onClick={(evt) => {
							evt.stopPropagation();
							history.push('/uvr/edit/' + uvr.message_id);
						}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('common:edit_on_map')}
						</div>
					</Button>
				</div>
			}
			data-test-id={'op' + uvr.reason}
			icon="double-chevron-right"
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				<GenericListLine>
					ID
					<div data-test-id='dash#selected#message_id'>
						{uvr.message_id}
					</div>
				</GenericListLine>
				<GenericListLine>
					{t('uvrs.type')}
					{uvr.type}
				</GenericListLine>
				<GenericListLine>
					{t('uvrs.cause')}
					{uvr.cause}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.effective_time_begin')}
					{new Date(uvr.effective_time_begin).toLocaleString()}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.effective_time_end')}
					{new Date(uvr.effective_time_end).toLocaleString()}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.min_altitude')}
					{uvr.min_altitude}
				</GenericListLine>
				<GenericListLine>
					{t('volumes.max_altitude')}
					{uvr.max_altitude}
				</GenericListLine>
			</div>
			}
		</Callout>
	);
}


function UvrList() {
	const { t, } = useTranslation('glossary');
	const { store, authStore } = useStore(
		'RootStore',
		(store) => ({
			store: store.uvrStore,
			authStore: store.authStore
		}));
	const { id } = useParams();

	if (store.hasFetched) {
		return (
			<>
				<div className={styles.header}>
					<h1>
						{t('uvrs.plural_generic').toUpperCase()}
					</h1>
				</div>
				{	store.allUvrs.length > 0 &&
					<>
						<div
							className={styles.filters}
						>
							<HTMLSelect
								id='filter'
								name="UvrFilterProperty"
								className={styles.filterProperty}
								value={store.filterProperty}
								onChange={(event) => store.setFilterProperty(event.currentTarget.value)}
							>
								<option value="reason">Reason</option>
								<option value="type">Type</option>
								<option value="cause">Cause</option>
							</HTMLSelect>
							<InputGroup
								className={styles.filterTextInput}
								leftIcon="search"
								onChange={(evt) => store.setFilterByText(evt.target.value)}
								placeholder={t('map:filter.bytext.description')}
								value={store.filterMatchingText}
							/>
							<p
								className={styles.filterTextInfo}
							>
								{t('glossary:showing_out_of', { sub: store.counts.matchesFilters, total: store.counts.uvrCount })}
							</p>
						</div>
						{/*
						<div
							className={styles.filters}
						>
							<p className={styles.filterLabel}>
								Sorting by property:
							</p>
							<HTMLSelect
								id='sorter'
								name="UvrSorter"
								className={styles.filterProperty}
								value={store.sortingProperty}
								minimal
								onChange={(event) => store.setSortingProperty(event.currentTarget.value)}
							>
								<option value="reason">Reason</option>
								<option value="type">Type</option>
								<option value="cause">Cause</option>
								<option value="start">Start</option>
								<option value="end">End</option>
							</HTMLSelect>
							<p className={styles.filterLabel}>
								in
							</p>
							<HTMLSelect
								id='sorter'
								name="UvrSortingOrder"
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
						*/}
						<GenericList>
							{store.uvrsWithVisibility.map((uvr) => {
								if (uvr._matchesFiltersByNames) {
									return <Uvr
										key={uvr.message_id}
										expanded={uvr.message_id === id}
										uvr={uvr}
										isPilot={authStore.role === 'pilot'}
									/>;
								} else {
									return null;
								}
							})}
						</GenericList>
					</>
				}
				{	store.allUvrs.length === 0 &&
				<h2>
					{t('uvrs.zero_uvrs')}
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

export default observer(UvrList);