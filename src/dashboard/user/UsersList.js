import React, { useState } from 'react';

import { Button, Callout, HTMLSelect, InputGroup, Intent, Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';
import { observer, useObserver } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import styles from '../generic/GenericList.module.css';
import GenericList, { GenericListLine } from '../generic/GenericList';
import Pilot from './Pilot';
import { ISDINACIA } from '../../consts';

function User({ expanded = false,  children }) {
	const { t, } = useTranslation(['glossary', 'common']);
	const history = useHistory();
	const [showProperties, setShowProperties] = useState(expanded);
	const [isEditing, setEditing] = useState(false);
	const toggleOperation = (evt) => {
		evt.stopPropagation();
		setEditing(false);
		setShowProperties(show => {
			if (show === false) {
				history.replace('/dashboard/users/' + children.username);
				return true;
			} else {
				history.replace('/dashboard/users');
				return false;
			}
		});
	};
	return useObserver(() => (
		<Callout
			className={styles.item}
			title={
				<div className={styles.title} onClick={toggleOperation}>
					<p className={styles.titleText}>{`${children.firstName} ${children.lastName}`}</p>
					<Button
						className={styles.button}
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
						data-test-id={`edit${children.username}`}
						className={styles.button}
						small
						minimal
						icon='edit'
						intent={isEditing ? Intent.DANGER : Intent.SUCCESS}
						onClick={(evt) => {evt.stopPropagation(); setShowProperties(false); setEditing(current => !current);}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('edit')}
						</div>
					</Button>
					<Button
						className={styles.button}
						small
						minimal
						icon='known-vehicle'
						intent={Intent.SUCCESS}
						onClick={(evt) => { evt.stopPropagation(); history.push('/dashboard/vehicles/' + children.username);}}
					>
						<div className={styles.buttonHoveredTooltip}>
							{t('vehicles.plural_generic')}
						</div>
					</Button>
				</div>
			}
			data-test-id={'op' + children.name}
			icon="double-chevron-right"
		>
			{showProperties &&
			<div className="animated fadeIn faster">
				{ Object.keys(children).map((prop => {
					if (prop !== 'dinacia_user' && prop !== 'password' && prop !== '_matchesFiltersByNames') {
						return (
							<GenericListLine key={prop}>
								{t(`users.${prop}`)}
								<div data-test-id={`dash#selected#${prop}`}>
									{children[prop]}
								</div>
							</GenericListLine>
						);
					} else {
						return null;
					}
				}))}
				{ ISDINACIA && children.dinacia_user && Object.keys(children.dinacia_user).map((prop => {
					if (prop !== 'dinacia_company' && prop.substr(-4) !== 'path' && prop.substr(-4) !== 'file') {
						return (
							<GenericListLine key={prop}>
								{t(`users.${prop}`)}
								<div data-test-id={`dash#selected#${prop}`}>
									{prop.substr(-5) !== '_date' && children.dinacia_user[prop] !== null && children.dinacia_user[prop]}
									{prop.substr(-5) === '_date' && children.dinacia_user[prop] !== null && children.dinacia_user[prop].toLocaleDateString()}
								</div>
							</GenericListLine>
						);
					} else {
						return null;
					}
				}))}
				{ ISDINACIA && children.dinacia_user && children.dinacia_user.dinacia_company && Object.keys(children.dinacia_user.dinacia_company).map((prop => {
					return (
						<GenericListLine key={prop}>
							{t(`users.${prop}`)}
							<div data-test-id={`dash#selected#${prop}`}>
								{children.dinacia_user.dinacia_company[prop]}
							</div>
						</GenericListLine>
					);
				}))}
				{	ISDINACIA && children.dinacia_user && children.dinacia_user.document_file_path &&
				<GenericListLine>
					<img className={styles.lineImage} src={children.dinacia_user.document_file_path} alt="Document" />
					<p></p>
				</GenericListLine>
				}
				{	ISDINACIA && children.dinacia_user && children.dinacia_user.permit_front_file_path &&
					<GenericListLine>
						<img className={styles.lineImage} src={children.dinacia_user.permit_front_file_path} alt="Front of the permit" />
						<p></p>
					</GenericListLine>
				}
				{	ISDINACIA && children.dinacia_user && children.dinacia_user.permit_back_file_path &&
				<GenericListLine>
					<img className={styles.lineImage} src={children.dinacia_user.permit_back_file_path} alt="Back of the permit" />
					<p></p>
				</GenericListLine>
				}
				{/* {	ISDINACIA && children.dinacia_user && children.dinacia_user.remote_sensor_file_path &&
				<GenericListLine>
					<img className={styles.lineImage} src={children.dinacia_user.remote_sensor_file_path} alt="Remote Sensor ID" />
					<p></p>
				</GenericListLine>
				} */}
				{/* TODO: ADD volumesOfInterest! */}
			</div>
			}
			{isEditing &&
			<Pilot user={children} />
			}
		</Callout>
	));
}

function UsersList() {
	const { t, } = useTranslation('glossary');
	const history = useHistory();

	const { store } = useStore(
		'RootStore',
		(store) => ({
			store: store.userStore
		}));
	const { username } = useParams();
	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('users.plural_generic').toUpperCase()}
				</h1>
			</div>
			{	!store.hasFetched &&
			<div className="fullHW" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE}/>
			</div>
			}
			{	store.allUsers.length > 0 &&
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
							<option value="username">{t('users.username')}</option>
							<option value="firstName">{t('users.firstName')}</option>
							<option value="lastName">{t('users.lastName')}</option>
							<option value="email">{t('users.email')}</option>
							<option value="role">{t('users.role')}</option>
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
							{`Showing ${store.counts.matchesFilters} out of ${store.counts.userCount} vehicles`}
						</p>
					</div>
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
							<option value="username">{t('users.username')}</option>
							<option value="firstName">{t('users.firstName')}</option>
							<option value="lastName">{t('users.lastName')}</option>
							<option value="email">{t('users.email')}</option>
							<option value="role">{t('users.role')}</option>
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
					<div
						className={styles.actionArea}
					>
						<Button
							className={styles.buttonAction}
							icon='add'
							onClick={() => {
								history.push('/dashboard/users/new');
							}}
						>
							{t('add_user')}
						</Button>
					</div>
					<GenericList>
						{store.usersWithVisibility.map((user) => {
							if (user._matchesFiltersByNames) {
								return (
									<User
										key={user.username}
										expanded={user.username === username}
									>
										{user}
									</User>
								);
							} else {
								return null;
							}
						})}
					</GenericList>
				</>
			}
			{	store.allUsers.length === 0 &&
				<h2>
					{t('operations.zero_operations')}
				</h2>
			}
		</>
	);
	
}

export default observer(UsersList);