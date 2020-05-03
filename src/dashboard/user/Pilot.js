import React, {useEffect, useState} from 'react';
import profile from '../../images/profile.jpg';
import {Card, Elevation, FormGroup, InputGroup} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import useAdesState from '../../state/AdesState';
import { useParams } from 'react-router-dom';
import S from 'sanctuary';
import {USERS_DATA_TOO_OLD} from '../../consts';

function Pilot({user: passedUser}) {
	const { t, } = useTranslation();
	const [ state, actions ] = useAdesState();
	const { username } = useParams();
	const [ user, setUser ] = useState(passedUser);

	useEffect(() => {
		// Only run in mount
		if (Date.now() - USERS_DATA_TOO_OLD - state.users.updated > USERS_DATA_TOO_OLD) {
			actions.users.fetch();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (user == null) {
			let users = state.users.list;
			if (S.isJust(users)) {
				users = S.fromMaybe({})(users);
				setUser(S.fromMaybe({firstName: 'Does not', lastName: 'exist', username: 'error', email:'error', role:'admin'})(S.value(username)(users)));
			}
		}
	}, [state.users.updated]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.log('user', user);
	}, [user]);


	return (
		<div className='dshPilot'>
			<div className='dshPilotLeft'>
				<img className='dshPilotImg' src={profile} alt="Profile"/>
			</div>
			<div className='dshPilotRight'>
				{   user == null &&
				<h1 className="bp3-heading bp3-skeleton">Loading McLoading</h1>
				}
				{	user != null &&
					<h1 className="bp3-heading">{user.firstName + ' ' + user.lastName}</h1>
				}
			</div>
			<div className='dshPilotBottom'>
				{	user != null &&
				<Card className='fullHW' elevation={Elevation.TWO}>
					<FormGroup
						label={t('app_user')}
						labelFor="text-input"
						labelInfo="(non-editable)"
					>
						<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.username}/>
					</FormGroup>
					<FormGroup
						label={t('app_firstname')}
						labelFor="text-input"
					>
						<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.firstName}/>
					</FormGroup>
					<FormGroup
						label={t('app_lastname')}
						labelFor="text-input"
					>
						<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.lastName}/>
					</FormGroup>
					<FormGroup
						label={t('app_email')}
						labelFor="text-input"
					>
						<InputGroup leftIcon="envelope" id="text-input" disabled={true} value={user.email}/>
					</FormGroup>
					<FormGroup
						label={t('app_role')}
						labelFor="select_role"
					>
						<div id="select-role" className="bp3-select bp3-fill">
							<select disabled={true}>
								<option selected={user.role === 'admin'} value="admin">Operator</option>
								<option selected={user.role === 'pilot'} value="pilot">Pilot</option>
							</select>
						</div>
					</FormGroup>
				</Card>
				}
			</div>
		</div>
	);
}
export default Pilot;