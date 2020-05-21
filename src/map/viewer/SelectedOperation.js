import React, {useState} from 'react';
import RightAreaButton from '../RightAreaButton';
import useAdesState from '../../state/AdesState';
import S from 'sanctuary';
import {fM} from '../../libs/SaferSanctuary';
import {useTranslation} from 'react-i18next';
import {Button, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';

function Property({property, value}) {
	return (
		<>
			<div
				className='rightAreaButtonTextsSeparator'
			>
				{property}
			</div>
			<div
				data-test-id={'property' + property}
				className='rightAreaButtonText'
			>
				{value || '-'}
			</div>
		</>
	);
}

function SelectedOperation ({gufi}) {
	const { t } = useTranslation();
	const [state, actions] = useAdesState();
	const [isDialogShown, showDialog] = useState(false);
	const [isApproved, setApproved] = useState(false);
	const operation = fM(S.value(gufi)(fM(state.operations.list)));
	const info = [
		[t('name'), operation.flight_comments],
		['ID',operation.gufi],
		[t('state'), operation.state],
		[t('effective_time_begin'), new Date(operation.operation_volumes[0].effective_time_begin).toLocaleString()],
		[t('effective_time_end'), new Date(operation.operation_volumes[0].effective_time_end).toLocaleString()],
		[t('max_altitude'), operation.operation_volumes[0].max_altitude+'m'],
		[t('contact'), operation.contact],
		[t('phone'), '097431725'],
	];

	const toShow = info.map((propvalue) =>
		<Property key={'raop' + propvalue[0]} property={propvalue[0]} value={propvalue[1]} />
	);

	return(
		<>
			<Dialog
				className='bp3-dark'
				title={t('editor_oinfo_complete')}
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
								actions.operations.pendingacceptation(
									operation.gufi,
									document.getElementById('comments').value,
									isApproved
								);
								showDialog(false);
							}}
							intent={Intent.PRIMARY}
						>
							{isApproved ? 'APPROVE' : 'REJECT'}
						</Button>
					</div>

				</div>
			</Dialog>
			<RightAreaButton
				useCase='SelectedOperation'
				icon='trending-up'
				label={t('selected_operation')}
				simpleChildren={false}
				forceOpen={true}
			>
				{toShow}
				{operation.state === 'PENDING' &&
				<div
					className='rightAreaButtonTextsSeparator'
				>
					<Button
						small={true}
						intent={Intent.SUCCESS}
						onClick={() => {setApproved(true);showDialog(true);}}
					>
						Approve
					</Button>
					<Button
						small={true}
						intent={Intent.DANGER}
						onClick={() => {setApproved(false);showDialog(true);}}
					>
						Reject
					</Button>
				</div>
				}
				{/*
			'ID <b>' + info.gufi + '</b><br/>' + // ID <b>a20ef8d5-506d-4f54-a981-874f6c8bd4de</b>
			t('operation') + ' <b>' + info.flight_comments + '</b><br/>' + // Operation <b>NAME</b>
			t('state') + ' <b>' + state + '</b><br />' + // State <b>STATE</b>
			t('effective_time_begin') + ' <b>' + new Date(info.operation_volumes[0].effective_time_begin).toLocaleString() + '</b><br/>' + // Start Date&Time
			t('effective_time_end') + ' <b>' + new Date(info.operation_volumes[0].effective_time_end).toLocaleString() + '</b><br/>' + // End Date&Time
			t('max_altitude') + ' <b>' + info.operation_volumes[0].max_altitude + '</b><br/>' + // Max Altitude 999
			t('contact') + ' <b>' + info.contact + '</b><br/>' + // Contact Name Lastname
			t('phone') + ' <b>097431725</b>' // Phone 097431725 */}
			</RightAreaButton>
		</>
	);
}

export default SelectedOperation;