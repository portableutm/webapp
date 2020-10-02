import React, { useState } from 'react';

import { Button, Callout, Intent, Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { useStore } from 'mobx-store-provider';
import { observer, useObserver } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import styles from '../generic/GenericList.module.css';
import GenericList, { GenericListLine } from '../generic/GenericList';
import Pilot from './Pilot';

function User({ expanded = false,  children }) {
	const { t, } = useTranslation(['glossary', 'common']);
	const history = useHistory();
	const [showProperties, setShowProperties] = useState(expanded);
	const [isEditing, setEditing] = useState(false);
	const toggleOperation = (evt) => {
		evt.stopPropagation();
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
						className={styles.button}
						small
						minimal
						icon='edit'
						intent={isEditing ? Intent.DANGER : Intent.SUCCESS}
						onClick={() => setEditing(current => !current)}
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
						onClick={() => history.push('/dashboard/vehicles/' + children.username)}
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
				<GenericListLine>
					{t('users.username')}
					<div data-test-id='dash#selected#username'>
						{children.username}
					</div>
				</GenericListLine>
				<GenericListLine>
					{t('users.firstname')}
					{children.firstName}
				</GenericListLine>
				<GenericListLine>
					{t('users.lastname')}
					{children.lastName}
				</GenericListLine>
				<GenericListLine>
					{t('users.email')}
					{children.email}
				</GenericListLine>
				<GenericListLine>
					{t('users.role')}
					{children.role}
				</GenericListLine>
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
				<GenericList>
					{store.allUsers.map((user) => {
						return (
							<User
								key={user.username}
								expanded={user.username === username}
							>
								{user}
							</User>
						);
					})}
				</GenericList>
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