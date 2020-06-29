import React from 'react';
import profile from '../../images/profile.png';
import {Card, Elevation, FormGroup, InputGroup} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';

function Pilot({user}) {
	const { t, } = useTranslation();
	//const { username } = useParams();
	//const [ user, setUser ] = useState(passedUser);

	/*
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
	 */

	return (
		<div className='dshPilot'>
			<div className='dshPilotLeft'>
				<img className='dshPilotImg' src={profile} title="User icon by Icons8" alt="Default profile"/>
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
					<>
						<Card className='fullHW' elevation={Elevation.TWO}>
							<FormGroup
								label={t('user.username')}
								labelFor="text-input"
								labelInfo="(non-editable)"
							>
								<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.username}/>
							</FormGroup>
							<FormGroup
								label={t('user.firstname')}
								labelFor="text-input"
							>
								<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.firstName}/>
							</FormGroup>
							<FormGroup
								label={t('user.lastname')}
								labelFor="text-input"
							>
								<InputGroup leftIcon="person" id="text-input" disabled={true} value={user.lastName}/>
							</FormGroup>
							<FormGroup
								label={t('user.email')}
								labelFor="text-input"
							>
								<InputGroup leftIcon="envelope" id="text-input" disabled={true} value={user.email}/>
							</FormGroup>
							<FormGroup
								label={t('user.role')}
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
						<Card className='fullHW' elevation={Elevation.TWO} style={{marginBottom: '5px'}}>
							<FormGroup
								label={t('user.change_password')}
								labelFor="newpassword"
							>
								<InputGroup leftIcon="compass" id="newpassword"/>
							</FormGroup>
						</Card>
					</>
				}
			</div>
		</div>
	);
}
export default Pilot;