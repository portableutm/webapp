import React, { useState } from 'react';
import { useStore } from 'mobx-store-provider';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import S from 'sanctuary';
import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import SidebarButton from '../SidebarButton';
import styles from '../Map.module.css';
import { QuickFly as QuickFlyModel } from '../../models/entities/QuickFly';
import { observer, useLocalStore } from 'mobx-react';

const QuickFlyControl = () => {
	const { qfStore, mapStore } = useStore('RootStore',
		(store) => ({
			qfStore: store.quickFlyStore,
			mapStore: store.mapStore
		})
	);
	const { t } = useTranslation('map', 'common');
	const [isCreating, showCreate] = useState(false);
	const localStore = useLocalStore(() => ({
		isInDeleteMode: false,
		setDeleteMode(flag) {
			localStore.isInDeleteMode = flag;
		}
	}));

	const addNewQuickFlyButton = {
		name: 'Add new Quick Fly',
		isSpecial: true,
		div: (<div
			key='thisisauniqueone'
			className={styles.sidebarSeparator}
		>
			<Button
				small={true}
				intent={Intent.PRIMARY}
				onClick={() => showCreate(true)}
			>
				{t('quickfly.add_new')}
			</Button>
			{	!localStore.isInDeleteMode &&
			<Button
				small={true}
				intent={Intent.DANGER}
				onClick={() => localStore.setDeleteMode(true)}
			>
				{t('quickfly.activate_delete_mode')}
			</Button>
			}
			{	localStore.isInDeleteMode &&
			<Button
				small={true}
				intent={Intent.WARNING}
				onClick={() => localStore.setDeleteMode(false)}
			>
				{t('quickfly.deactivate_delete_mode')}
			</Button>
			}
		</div>),
	};

	const onClick = (location) => {
		if (localStore.isInDeleteMode) {
			qfStore.remove(location.id);
		} else {
			mapStore.setCorners(location.cornerNW, location.cornerSE);
		}
	};
	const content = [].concat(qfStore.allQuickflies, [addNewQuickFlyButton]);
	return (
		<>
			{	!isCreating &&
				<SidebarButton
					useCase='quickFly'
					icon='send-to-map'
					label={t('quickfly.title').toUpperCase()}
					onClick={onClick}
					simpleChildren={true}
				>
					{content}
				</SidebarButton>
			}
			{	isCreating &&
				<SidebarButton
					className={'animated flash'}
					useCase='quickFlyNew'
					label={t('quickfly.creating_new')}
					icon='cog'
					forceOpen={true}
					simpleChildren={false}
				>
					<div
						className={styles.sidebarButtonText}
					>
						<FormGroup
							label={t('quickfly.name')}
							inline={true}
							labelFor="qf-name"
							labelInfo={'(' + t('quickfly.required') + ')'}
						>
							<InputGroup data-test-id="mapquickFlyNew" id="qf-name" placeholder={t('quickfly.new_location')} />
						</FormGroup>
					</div>
					<div
						className={styles.sidebarButtonDisabled}
					>
						{t('quickfly.info')}
					</div>
					<div
						className={styles.sidebarSeparator}
					>
						<Button
							small={true}
							intent={Intent.DANGER}
							onClick={() => showCreate(false)}
						>
							{t('common:cancel')}
						</Button>
						<Button
							small={true}
							intent={Intent.PRIMARY}
							onClick={() => {
								/*actions.quickFly.post(
									{
										name: document.getElementById('qf-name').value,
										cornerNW: state.map.cornerNW,
										cornerSE: state.map.cornerSE,
									},
									() => {
										actions.map_dialog.open(t('quickfly.title'), t('quickfly.new_location_created'));
									},
									(error) => {
										actions.map_dialog.open(t('quickfly.title'), 'Error: ' + JSON.stringify(error));
									}
								);*/
								const newQuickFly = QuickFlyModel.create({
									id: 'ignored', // Gets ignored while constructing the object to send to the backend
									name: document.getElementById('qf-name').value,
									cornerNW: mapStore.mapCorners.cornerNW,
									cornerSE: mapStore.mapCorners.cornerSE
								});
								qfStore.post(newQuickFly);
								showCreate(false);
							}}
						>
							{t('quickfly.save')}
						</Button>
					</div>
				</SidebarButton>
			}
		</>
	);
};

QuickFlyControl.propTypes = {
	onClick: PropTypes.func.isRequired // Function to be called after clicking in a location
};

export default observer(QuickFlyControl);