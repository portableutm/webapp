import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SidebarButton from '../SidebarButton';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import styles from '../Map.module.css';
import { useStore } from 'mobx-store-provider';
import { observer } from 'mobx-react';

function Property({ property, value }) {
	const { t } = useTranslation(['glossary','map']);
	return (
		<>
			<div
				className={styles.sidebarSeparator}
			>
				{t(property)}
			</div>
			<div
				data-test-id={'property' + property}
				className={styles.sidebarButtonText}
			>
				{value || '-'}
			</div>
		</>
	);
}

function SelectedOperation() {
	const history = useHistory();
	const { t } = useTranslation(['glossary','map']);
	const [isDialogShown, showDialog] = useState(false);
	const [isApproved, setApproved] = useState(false);
	const { operation, updatePending, authStore } = useStore(
		'RootStore',
		(store) => ({
			operation: store.mapStore.getSelectedOperation,
			updatePending: store.operationStore.updatePending,
			authStore: store.authStore
		})
	);

	const toShow = operation.map((propvalue) =>
		<Property key={'raop' + propvalue[0]} property={propvalue[0]} value={propvalue[1]} />
	);

	return(
		<>
			<Dialog
				className='bp3-dark'
				title={t('map:editor.operation.complete')}
				isOpen={isDialogShown}
				onClose={() => showDialog(false)}
			>
				<div className='dialogify'>
					<p className='fullW'>
						This operation will be <b>{isApproved ? 'APPROVED' : 'NOT APPROVED'}</b>
					</p>
					<FormGroup
						className='fullW'
						label="Comments"
						inline={true}
						labelFor="comments"
						labelInfo="(optional)"
					>
						<InputGroup id="comments" placeholder="Explanation" />
					</FormGroup>
					<div
						className='fullW'
					>
						<Button
							onClick={() => {
								showDialog(false);
							}}
							intent={Intent.WARNING}
						>
							Close dialog
						</Button>
						<Button
							onClick={() => {
								showDialog(false);
								updatePending(
									operation[1][1],
									document.getElementById('comments').value,
									isApproved
								);
							}}
							intent={Intent.PRIMARY}
						>
							{isApproved ? 'APPROVE' : 'REJECT'}
						</Button>
					</div>

				</div>
			</Dialog>
			<SidebarButton
				useCase='SelectedOperation'
				icon='trending-up'
				label={t('map:selected_operation')}
				simpleChildren={false}
				forceOpen={true}
			>
				{toShow}
				<div
					className={styles.sidebarSeparator}
				>
					<Button
						small={true}
						intent={Intent.PRIMARY}
						fill
						onClick={() => history.push('/dashboard/operations/'+operation[1][1])}
					>
						{t('info')}
					</Button>
				</div>
				{	operation[2][1] === 'PENDING' &&
					authStore.isAdmin &&
				<div
					className={styles.sidebarSeparator}
				>
					<Button
						small={true}
						intent={Intent.SUCCESS}
						onClick={() => {setApproved(true);showDialog(true);}}
					>
						{t('approve')}
					</Button>
					<Button
						small={true}
						intent={Intent.DANGER}
						onClick={() => {setApproved(false);showDialog(true);}}
					>
						{t('reject')}
					</Button>
				</div>
				}
			</SidebarButton>
		</>
	);
}

export default observer(SelectedOperation);